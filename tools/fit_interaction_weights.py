#!/usr/bin/env python3
"""
Fit a small set of interaction weights to reduce variance in total build cost
for 99 OVR builds using existing build_weights.json.

Total cost = base cumulative weight from build_weights.json
           + sum_i (w_i * interaction_i)

We solve a ridge regression to minimize squared error to the target mean cost
across 99 OVR builds.
"""
import json
import csv
import re
import numpy as np
from pathlib import Path

SKILLS = [
    'Close Shot', 'Driving Layup', 'Driving Dunk', 'Standing Dunk', 'Post Control',
    'Mid Range Shot', 'Three Point Shot', 'Free Throw', 'Pass Accuracy', 'Ball Handle',
    'Speed With Ball', 'Interior Defense', 'Perimeter Defense', 'Steal', 'Block',
    'Offensive Rebound', 'Defensive Rebound', 'Speed', 'Agility', 'Strength', 'Vertical'
]

# Generate all unique interaction pairs (i < j)
INTERACTIONS = [(SKILLS[i], SKILLS[j]) for i in range(len(SKILLS)) for j in range(i + 1, len(SKILLS))]

TARGET_MEAN = 1721  # from 99 OVR observed average
RIDGE_LAMBDA = 1e-2


def parse_height(height_str):
    if isinstance(height_str, int):
        return height_str
    height_str = str(height_str).strip()
    m = re.search(r"(\d+)\s*[^\d]+\s*(\d+)", height_str)
    if m:
        return int(m.group(1)) * 12 + int(m.group(2))
    return None


def load_weights(weights_path):
    with open(weights_path, 'r') as f:
        return json.load(f)


def cumulative_cost_for_skill(arr, value):
    total = 0
    for v in range(25, value + 1):
        idx = v - 25
        if 0 <= idx < len(arr) and arr[idx] is not None:
            total += arr[idx]
    return total


def load_builds(csv_path, overall_filter=99):
    builds = []
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        headers = {h.lower(): h for h in reader.fieldnames}
        for row in reader:
            overall = int(row[headers['overall']])
            if overall != overall_filter:
                continue
            height = parse_height(row[headers['height']])
            if not height:
                continue
            skills = {}
            for skill in SKILLS:
                skills[skill] = int(row[headers[skill.lower()]])
            builds.append({'height': height, 'overall': overall, 'skills': skills})
    return builds


def build_matrix(builds, weights_data):
    X_rows = []
    base_totals = []
    for b in builds:
        h_key = str(b['height'])
        if h_key not in weights_data:
            continue
        hw = weights_data[h_key]
        # base total
        base = 0
        for skill, val in b['skills'].items():
            arr = hw.get(skill)
            if arr is None:
                continue
            base += cumulative_cost_for_skill(arr, val)
        base_totals.append(base)
        # interaction features
        feats = []
        for s1, s2 in INTERACTIONS:
            v1 = b['skills'][s1] / 99.0
            v2 = b['skills'][s2] / 99.0
            feats.append(v1 * v2)
        X_rows.append(feats)
    return np.array(base_totals, dtype=float), np.array(X_rows, dtype=float)


def fit_interactions(base_totals, X, target_mean=TARGET_MEAN, ridge=RIDGE_LAMBDA):
    # We want base + X w ≈ target_mean for all rows -> minimize |(base - target) + X w|^2 + lambda||w||^2
    y = target_mean - base_totals
    # Solve (X^T X + lambda I) w = X^T y
    XtX = X.T @ X
    XtX += ridge * np.eye(XtX.shape[0])
    Xty = X.T @ y
    w = np.linalg.solve(XtX, Xty)
    return w


def evaluate(base_totals, X, w):
    preds = base_totals + X @ w
    return {
        'mean': float(np.mean(preds)),
        'std': float(np.std(preds)),
        'min': float(np.min(preds)),
        'max': float(np.max(preds)),
    }


def main():
    csv_path = '/Users/ethanco/Downloads/2kbuilds-68.csv'
    weights_path = Path(__file__).parent.parent / 'src' / 'data' / 'build_weights.json'

    print(f"Loading weights from {weights_path}...")
    weights_data = load_weights(weights_path)
    print("Loading 99 OVR builds...")
    builds = load_builds(csv_path, overall_filter=99)
    print(f"Loaded {len(builds)} builds")

    base_totals, X = build_matrix(builds, weights_data)
    print(f"Base totals: mean={np.mean(base_totals):.1f}, std={np.std(base_totals):.1f}, min={np.min(base_totals):.1f}, max={np.max(base_totals):.1f}")

    w = fit_interactions(base_totals, X)
    stats = evaluate(base_totals, X, w)

    paired = list(zip(INTERACTIONS, w))
    paired_sorted = sorted(paired, key=lambda p: abs(p[1]), reverse=True)

    print("\nTop interaction weights (sorted by absolute weight):")
    for name, val in paired_sorted:
        print(f"  {name}: {val:.3f}")

    print("\nTotals after interaction adjustment:")
    print(f"  mean={stats['mean']:.1f}, std={stats['std']:.1f}, min={stats['min']:.1f}, max={stats['max']:.1f}")

if __name__ == '__main__':
    main()
