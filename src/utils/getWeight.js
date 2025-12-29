const weightsByHeight = require('../data/build_weights.json');
const { WITHIN_BUCKET_INCREMENT_FACTOR = 1 } = require('../config');

function findClosestHeight(h) {
  const heights = Object.keys(weightsByHeight).map(Number).filter(Number.isFinite);
  if (heights.includes(h)) return h;
  let closest = heights[0];
  let bestDiff = Math.abs(h - closest);
  for (let i = 1; i < heights.length; i++) {
    const diff = Math.abs(h - heights[i]);
    if (diff < bestDiff) {
      bestDiff = diff;
      closest = heights[i];
    }
  }
  return closest;
}

// Case-insensitive skill key lookup
function findSkillEntry(skillsObj, skillName) {
  if (!skillsObj) return null;
  if (Object.prototype.hasOwnProperty.call(skillsObj, skillName)) return skillName;
  const lower = skillName.toLowerCase();
  const keys = Object.keys(skillsObj);
  for (const k of keys) {
    if (k.toLowerCase() === lower) return k;
  }
  // try substring match
  for (const k of keys) {
    if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase())) return k;
  }
  return null;
}

// Helper: find contiguous bucket (startIdx..endIdx) of identical values containing idx
function findBucketRange(arr, idx) {
  const n = arr.length;
  const base = arr[idx];
  if (base == null) return [idx, idx];
  let start = idx;
  while (start > 0 && arr[start - 1] === base) start--;
  let end = idx;
  while (end < n - 1 && arr[end + 1] === base) end++;
  return [start, end];
}

/**
 * Get the numeric weight for a given height (inches), skill name, and slider value (25..99)
 *
 * NEW: Returns the *cumulative* sum of per-step adjusted weights from 25 up to the current
 * slider value (inclusive). This preserves accumulated increments when moving past a bucket
 * boundary (e.g., moving from 74->75 keeps the contributions from 26..74).
 *
 * For an individual index inside a bucket, the per-step adjusted value is computed as:
 *   adjusted = base * (1 + (idx - bucketStart) * WITHIN_BUCKET_INCREMENT_FACTOR)
 * where base is the bucket's value at that index.
 */
function getWeight(heightInches, skillName, sliderValue) {
  if (!heightInches || !skillName || !sliderValue) return null;
  const h = findClosestHeight(Number(heightInches));
  const skillKey = findSkillEntry(weightsByHeight[h], skillName);
  if (!skillKey) return null;
  const arr = weightsByHeight[h][skillKey];
  const idx = Number(sliderValue) - 25;
  if (!Array.isArray(arr) || idx < 0 || idx >= arr.length) return null;

  // helper: compute adjusted per-index value (returns 0 for nulls)
  const adjustedAt = (i) => {
    const val = arr[i];
    if (val == null) return 0;
    const [start, end] = findBucketRange(arr, i);
    if (start === end || !WITHIN_BUCKET_INCREMENT_FACTOR) return Number(val);
    const deltaSteps = i - start;
    return Number(val) * (1 + deltaSteps * Number(WITHIN_BUCKET_INCREMENT_FACTOR));
  };

  // cumulative sum from index 0 (25) up to idx
  let total = 0;
  for (let i = 0; i <= idx; i++) {
    total += adjustedAt(i);
  }
  return total;
}

function hasBaseWeight(heightInches, skillName, sliderValue) {
  if (!heightInches || !skillName || !sliderValue) return false;
  const h = findClosestHeight(Number(heightInches));
  const skillKey = findSkillEntry(weightsByHeight[h], skillName);
  if (!skillKey) return false;
  const arr = weightsByHeight[h][skillKey];
  const idx = Number(sliderValue) - 25;
  return Array.isArray(arr) && idx >= 0 && idx < arr.length && arr[idx] != null;
}

function getValidSliderBounds(heightInches, skillName) {
  if (!heightInches || !skillName) return null;
  const h = findClosestHeight(Number(heightInches));
  const skillKey = findSkillEntry(weightsByHeight[h], skillName);
  if (!skillKey) return null;
  const arr = weightsByHeight[h][skillKey];
  if (!Array.isArray(arr)) return null;
  let first = -1;
  let last = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] != null) {
      if (first === -1) first = i;
      last = i;
    }
  }
  if (first === -1) return null;
  return { min: 25 + first, max: 25 + last };
}

module.exports = { getWeight, findClosestHeight, hasBaseWeight, getValidSliderBounds };
