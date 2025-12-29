#!/usr/bin/env node
/*
Converts src/resources/build_weights.csv or .xlsx into src/data/build_weights.json

Supported input formats:
- Long: rows with columns: height, skill, slider (or value), weight
- Wide with arrays: first column is height, other columns are skill names and cell values are semicolon or pipe-separated lists of weights corresponding to slider values 25..99
- Wide transposed (rows as slider values) is NOT supported automatically; convert externally or open an issue.

Usage: node tools/convert-build-weights.js

Outputs: src/data/build_weights.json
*/

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const xlsx = require('xlsx');

const IN_DIR = path.join(__dirname, '..', 'src', 'resources');
const OUT_DIR = path.join(__dirname, '..', 'src', 'data');
const OUT_FILE = path.join(OUT_DIR, 'build_weights.json');

const possibleFiles = [
  path.join(IN_DIR, 'build_weights.csv'),
  path.join(IN_DIR, 'build_weights.xlsx'),
  path.join(IN_DIR, 'build_weights.xls'),
];

const exists = (p) => {
  try {
    return fs.existsSync(p);
  } catch (e) {
    return false;
  }
};

const inputFile = possibleFiles.find(exists);
if (!inputFile) {
  console.error('No build_weights.csv/.xlsx/.xls found in src/resources. Exiting.');
  process.exit(1);
}

console.log('Parsing', inputFile);

let rows = [];
let headers = [];

// Read a bit of the file first to detect file type (some CSVs may actually be XLSX files)
const fileBuf = fs.readFileSync(inputFile);
const isZip = fileBuf && fileBuf.length >= 2 && fileBuf[0] === 0x50 && fileBuf[1] === 0x4b; // PK\x03\x04

if (/\.csv$/i.test(inputFile) && !isZip) {
  const raw = fileBuf.toString('utf8');
  rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true });
  headers = Object.keys(rows[0] || {});
} else {
  // treat as Excel/workbook
  const workbook = xlsx.read(fileBuf, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  headers = Object.keys(rows[0] || {});
}

if (!rows.length) {
  console.error('No rows parsed from input file. Exiting.');
  process.exit(1);
}

const lower = (s) => (s || '').toString().toLowerCase();
const findKey = (names) => headers.find((h) => names.includes(lower(h)));

// Detect long format: height, skill, value/slider, weight
const heightKey = findKey(['height', 'inches', 'height_in', 'height_inches']);
const skillKey = findKey(['skill', 'ability', 'stat']);
const sliderKey = findKey(['slider', 'value', 'sliderValue'.toLowerCase()]);
const weightKey = findKey(['weight', 'weights', 'w']);

let result = {};

// Helper to ensure arrays
const ensureArray = (h, skill, len = 75) => {
  result[h] = result[h] || {};
  result[h][skill] = result[h][skill] || Array(len).fill(null);
};

if (heightKey && skillKey && (sliderKey || weightKey)) {
  console.log('Detected long/record format (height, skill, slider/value, weight)');
  rows.forEach((r) => {
    const h = Number(r[heightKey]);
    if (!Number.isFinite(h)) return;
    const skill = String(r[skillKey]).trim();
    const sliderVal = sliderKey ? Number(r[sliderKey]) : null;
    const weight = weightKey ? Number(r[weightKey]) : null;
    if (!skill) return;
    ensureArray(h, skill);
    if (Number.isFinite(sliderVal)) {
      const idx = sliderVal - 25;
      if (idx >= 0 && idx < 75) {
        result[h][skill][idx] = Number.isFinite(weight) ? weight : null;
      }
    } else if (Number.isFinite(weight)) {
      // If slider not provided but a single weight cell exists, we can't place into array
      console.warn(`Row for height=${h}, skill=${skill} has a weight but no slider/value column; skipping`);
    }
  });
} else if (heightKey) {
  console.log('Detected wide format (rows per height, columns per skill)');
  // Identify skill column if present (e.g., 'Attribute', 'Skill')
  const skillCol = findKey(['attribute', 'skill', 'ability', 'stat', 'statistic']) || findKey(['skill', 'ability', 'stat']);
  const heightCol = heightKey;

  // Detect range-style headers like "25-74" or "99"
  const rangeHeaderRe = /^\s*(\d{1,3})(?:-(\d{1,3}))?\s*$/;
  const rangeHeaders = headers.filter((h) => rangeHeaderRe.test(h));
  const nonRangeSkillHeaders = headers.filter((h) => !rangeHeaderRe.test(h) && lower(h) !== lower(heightCol) && h !== skillCol);

  rows.forEach((r) => {
    // parse height strings like "6'2" or "6' 2" or "6 ft 2 in" or numeric inches
    const parseHeight = (s) => {
      if (s == null) return null;
      if (typeof s === 'number') return s;
      const str = String(s).trim();
      const m = str.match(/^(\d+)['’]\s*(\d{1,2})\"?$/); // e.g., 6'2 or 6' 2
      if (m) return Number(m[1]) * 12 + Number(m[2]);
      const m2 = str.match(/^(\d+)\s*ft\s*(\d{1,2})\s*in/i);
      if (m2) return Number(m2[1]) * 12 + Number(m2[2]);
      const digits = Number(str.replace(/[^0-9]/g, ''));
      return Number.isFinite(digits) ? digits : null;
    };

    const rawHeight = r[heightCol];
    const h = parseHeight(rawHeight);
    if (!Number.isFinite(h)) return;
    result[h] = result[h] || {};

    // If skill is in its own column, use that; otherwise treat remaining headers as skill columns
    if (skillCol) {
      const skill = String(r[skillCol]).trim();
      if (!skill) return;
      ensureArray(h, skill);

      // process range headers into per-slider values
      rangeHeaders.forEach((rh) => {
        const cell = r[rh];
        if (cell == null || cell === '') return;
        const num = Number(String(cell).replace(/[^0-9.-]/g, ''));
        if (!Number.isFinite(num)) return;
        const m = String(rh).match(rangeHeaderRe);
        let start = Number(m[1]);
        const end = m[2] ? Number(m[2]) : start;
        // Per spec: treat a "25-74" range as "26-74" so index 25 is not implicitly included
        if (start === 25 && end === 74) start = 26;
        for (let v = start; v <= end; v++) {
          if (v < 25 || v > 99) continue;
          const idx = v - 25;
          result[h][skill][idx] = num;
        }
      });

      // Also check any non-range skill headers where the cell might be a list/array
      nonRangeSkillHeaders.forEach((sh) => {
        const cell = r[sh];
        if (cell == null || cell === '') return;
        const asStr = String(cell).trim();
        if (asStr.includes(';') || asStr.includes('|') || (asStr.includes('[') && asStr.includes(']')) ) {
          const parts = asStr.replace(/^\[|\]$/g, '')
            .split(/\s*[;|]\s*/) // split on ; or |
            .map((x) => x.trim())
            .filter((x) => x.length);
          const nums = parts.map((p) => { const n = Number(p.replace(/[^0-9.-]/g, '')); return Number.isFinite(n) ? n : null; });
          if (nums.length) result[h][skill] = nums.slice(0, 75);
        }
      });
    } else {
      // No dedicated skill column: treat each non-height header as a skill name with either constant or list values
      headers.forEach((sh) => {
        if (lower(sh) === lower(heightCol)) return;
        const cell = r[sh];
        if (cell == null || cell === '') return;
        const asStr = String(cell).trim();
        // If header is a range (e.g., '25-74'), we need a skill name, but without skill column we can't map — skip
      });
    }
  });
} else {
  console.error('Could not detect CSV/Excel format. Expected columns including height or a long format (height, skill, slider, weight).');
  process.exit(1);
}

// Normalize: ensure every height between 69 and 88 has entries for each skill seen
const heights = Object.keys(result).map(Number).filter(Number.isFinite);
if (!heights.length) {
  console.error('No height rows found after parsing. Exiting.');
  process.exit(1);
}

const allSkills = new Set();
heights.forEach((h) => Object.keys(result[h] || {}).forEach((s) => allSkills.add(s)));

const out = {};
heights.sort((a,b)=>a-b).forEach((h)=>{
  out[h] = out[h] || {};
  allSkills.forEach((skill)=>{
    const arr = result[h][skill];
    if (Array.isArray(arr)) {
      // pad or trim to 75
      const a = arr.slice(0,75);
      while (a.length < 75) a.push(null);
      out[h][skill] = a;
    } else {
      // missing -> fill with nulls
      out[h][skill] = Array(75).fill(null);
    }
  });
});

// Map all slider value 25 (index 0) to 0, per user request
Object.keys(out).forEach((h) => {
  Object.keys(out[h]).forEach((skill) => {
    if (Array.isArray(out[h][skill]) && out[h][skill].length >= 1) {
      out[h][skill][0] = 0;
    }
  });
});

// Ensure output dir
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', OUT_FILE);
console.log('Heights:', Object.keys(out).length, 'skills:', Array.from(allSkills).length);
console.log('Done.');
