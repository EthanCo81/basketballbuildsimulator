const weightsByHeight = require('../data/build_weights.json');

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

/**
 * Get the numeric weight for a given height (inches), skill name, and slider value (25..99)
 *
 * Returns the cumulative sum of weights from 25 up to the current slider value (inclusive).
 */
function getWeight(heightInches, skillName, sliderValue) {
  if (!heightInches || !skillName || !sliderValue) return null;
  const h = findClosestHeight(Number(heightInches));
  const skillKey = findSkillEntry(weightsByHeight[h], skillName);
  if (!skillKey) return null;
  const arr = weightsByHeight[h][skillKey];
  const idx = Number(sliderValue) - 25;
  if (!Array.isArray(arr) || idx < 0 || idx >= arr.length) return null;

  // Simple cumulative sum from index 0 (value 25) up to idx
  let total = 0;
  for (let i = 0; i <= idx; i++) {
    const val = arr[i];
    if (val != null) {
      total += Number(val);
    }
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
