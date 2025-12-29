// Global configuration (CommonJS format to be usable from node scripts)
const WEIGHT_CAP = 15000; // easily adjustable cap for total numeric weights

// When a range (e.g., 25-74) maps to a single base weight in the data,
// this factor controls per-step growth relative to the base value.
// For example, WITHIN_BUCKET_INCREMENT_FACTOR = 1 means moving from 25->30 (5 steps)
// increases the weight by base * 5 (i.e., base * (1 + 5*factor)).
const WITHIN_BUCKET_INCREMENT_FACTOR = 1;

module.exports = { WEIGHT_CAP, WITHIN_BUCKET_INCREMENT_FACTOR };
