# Reverse Engineering Weights

This tool reverse-engineers individual skill weights from complete build configurations.

## Requirements

```bash
pip install numpy scipy
```

## Input Format

Create a JSON file with your build data. Each build should have:
- `height`: integer (69-88)
- `skills`: object with all 21 skill values (25-99)
- `totalWeight`: the exact total weight for this build

Example (`my-builds.json`):
```json
[
  {
    "height": 80,
    "skills": {
      "Close Shot": 60,
      "Driving Layup": 65,
      "Driving Dunk": 50,
      ...all 21 skills...
    },
    "totalWeight": 30000
  },
  ...100 more builds...
]
```

## Running the Tool

```bash
python tools/reverse-engineer-weights.py my-builds.json
```

This will:
1. Process builds for each height separately
2. Use constrained optimization to find weights that best fit your data
3. Apply monotonicity constraints (weights increase with skill value)
4. Apply smoothness constraints (no wild jumps)
5. Generate `src/data/build_weights_engineered.json`

## Validation

The tool reports:
- **RMSE**: Root mean squared error in predictions
- **Mean error %**: Average prediction error as percentage
- **Max error %**: Worst-case prediction error

Target: Mean error < 5% (95%+ accuracy)

## Using the Results

After validation, replace the current weights:
```bash
cp src/data/build_weights_engineered.json src/data/build_weights.json
```

## Data Collection Tips

For best results, provide **diverse** builds:
- Vary which skills are high/low
- Include specialist builds (one skill maxed, others low)
- Include balanced builds (all skills medium)
- Include different archetypes (shooter, defender, athletic, etc.)

**Per height: 100 builds recommended**
**Total for all heights: 2000 builds** (20 heights × 100 each)
