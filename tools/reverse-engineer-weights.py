#!/usr/bin/env python3
"""
Reverse-engineer individual skill weights from complete build configurations.

Input: CSV file with build data
Columns: position, height, weight, wingspan, and all skills
(Close Shot, Driving Layup, Driving Dunk, Standing Dunk, Post Control,
 Mid Range Shot, Three Point Shot, Free Throw, Pass Accuracy, Ball Handle,
 Speed with Ball, Interior Defense, Perimeter Defense, Steal, Block,
 Offensive Rebound, Defensive Rebound, Speed, Agility, Strength, Vertical)

Output: build_weights.json with estimated individual weights
"""

import json
import csv
import re
import argparse
import numpy as np
from scipy.optimize import minimize
from pathlib import Path

SKILLS = [
    'Close Shot', 'Driving Layup', 'Driving Dunk', 'Standing Dunk', 'Post Control',
    'Mid Range Shot', 'Three Point Shot', 'Free Throw', 'Pass Accuracy', 'Ball Handle',
    'Speed with Ball', 'Interior Defense', 'Perimeter Defense', 'Steal', 'Block',
    'Offensive Rebound', 'Defensive Rebound', 'Speed', 'Agility', 'Strength', 'Vertical'
]

# Optimize across full skill range
MIN_VALUE = 25
MAX_VALUE = 99
NUM_VALUES = 75  # Full range for output (25-99)

def parse_height(height_str):
    """Parse height string in format X'Y (e.g., "6'8" or "6'8\"") to total inches."""
    if isinstance(height_str, int):
        # Already an integer (in inches)
        return height_str
    
    height_str = str(height_str).strip()
    
    # Use regex to match: feet (digits), any non-digit separator(s), inches (digits)
    # This is flexible enough to handle any quote character
    match = re.match(r"(\d+)\s*[^\d]+\s*(\d+)", height_str)
    
    if match:
        feet = int(match.group(1))
        inches = int(match.group(2))
        return feet * 12 + inches
    
    # If no pattern matched, try to parse as integer
    try:
        return int(height_str)
    except ValueError:
        raise ValueError(f"Could not parse height: {height_str}. Expected format like 6'8 or 80 (inches)")

def load_build_data_csv(filepath, total_constant=None):
    """Load build data from CSV file. If total_constant is provided, use it for all builds."""
    builds = []
    with open(filepath, 'r') as f:
        reader = csv.DictReader(f)
        # Normalize fieldnames to lowercase for case-insensitive matching
        reader.fieldnames = [name.lower() if name else name for name in reader.fieldnames]
        
        for row in reader:
            # Create a lowercase key version of the row for case-insensitive access
            row_lower = {k.lower(): v for k, v in row.items()}

            # Resolve total weight column with flexible naming
            total_weight_key = next((k for k in row_lower.keys() if k in {'totalweight', 'total_weight', 'total weight'}), None)
            if total_weight_key is not None:
                total_weight_val = float(row_lower[total_weight_key])
            else:
                total_weight_val = float(total_constant)

            # Resolve overall column (optional)
            overall_key = next((k for k in row_lower.keys() if k in {'overall', 'ovr'}), None)
            overall_val = int(row_lower[overall_key]) if overall_key else None

            build = {
                'position': row_lower['position'],
                'height': parse_height(row_lower['height']),
                'weight': int(row_lower['weight']),
                'wingspan': parse_height(row_lower['wingspan']),
                'overall': overall_val,
                'skills': {},
                'totalWeight': total_weight_val,
            }
            # Load all skill values (case-insensitive)
            for skill in SKILLS:
                skill_lower = skill.lower()
                build['skills'][skill] = int(row_lower[skill_lower])
            builds.append(build)
    return builds

def load_prior_weights(filepath, height, param_map):
    """
    Load existing build weights as a prior/initial guess for the optimizer.
    Returns a vector matching param_map dimensions, or None if file doesn't exist.
    """
    try:
        with open(filepath, 'r') as f:
            weights_data = json.load(f)
        
        # Height is stored as string key in the JSON
        height_key = str(height)
        if height_key not in weights_data:
            print(f"  No prior weights found for height {height}, using defaults")
            return None
        
        height_weights = weights_data[height_key]
        
        # Build prior vector matching param_map structure
        prior = np.zeros(len(param_map))
        
        for skill in SKILLS:
            skill_weights = height_weights.get(skill, [])
            for val in range(MIN_VALUE, MAX_VALUE + 1):
                col_idx = param_map[(skill, val)]
                # Index into skill_weights array (0-indexed for value 25, etc.)
                array_idx = val - MIN_VALUE
                if array_idx < len(skill_weights) and skill_weights[array_idx] is not None:
                    prior[col_idx] = skill_weights[array_idx]
        
        print(f"  ✓ Loaded prior weights from {filepath}")
        return prior
    except (FileNotFoundError, KeyError, json.JSONDecodeError):
        print(f"  Could not load prior weights, using defaults")
        return None

def create_observation_matrix(builds, height):
    """
    Create observation matrix for a specific height.
    Each row is a build, each column is a (skill, value) pair.
    Uses 'overall' as the target y value (25-99 scale).
    """
    height_builds = [b for b in builds if b['height'] == height]
    
    if not height_builds:
        return None, None, None
    
    # Create mapping from (skill, value) to column index
    param_map = {}
    idx = 0
    for skill in SKILLS:
        for val in range(MIN_VALUE, MAX_VALUE + 1):
            param_map[(skill, val)] = idx
            idx += 1
    
    # Build observation matrix
    X = np.zeros((len(height_builds), len(param_map)))
    y = np.zeros(len(height_builds))
    
    for i, build in enumerate(height_builds):
        for skill in SKILLS:
            skill_val = build['skills'][skill]
            if MIN_VALUE <= skill_val <= MAX_VALUE:
                col_idx = param_map[(skill, skill_val)]
                X[i, col_idx] = 1
        # Use overall as target; if not in CSV, use average of skills
        if 'overall' in build:
            y[i] = build['overall']
        else:
            # Compute as weighted average of skills (quick proxy)
            skill_vals = [build['skills'][s] for s in SKILLS]
            y[i] = np.mean(skill_vals)
    
    return X, y, param_map

def enforce_constraints(weights_flat, param_map):
    """
    Enforce monotonicity (non-decreasing) and mild smoothness.

    - Monotonicity: every increment costs the same or more than the previous.
    - Smoothness: keep extreme jumps from getting out of hand.
    """
    penalty = 0.0
    MONO_PENALTY = 1e3    # penalty for decreases (violation of monotonicity)
    SMOOTH_ALLOW = 100.0  # allow jumps up to 100 before penalizing
    SMOOTH_WEIGHT = 10.0  # lighter weight for smoothing

    for skill in SKILLS:
        skill_weights = []
        for val in range(MIN_VALUE, MAX_VALUE + 1):
            idx = param_map[(skill, val)]
            skill_weights.append(weights_flat[idx])

        # Monotonicity: weights should be non-decreasing
        for i in range(len(skill_weights) - 1):
            if skill_weights[i+1] < skill_weights[i]:
                dec = skill_weights[i] - skill_weights[i+1]
                penalty += MONO_PENALTY * (dec ** 2)

        # Smoothness: penalize very large jumps
        for i in range(len(skill_weights) - 1):
            diff = abs(skill_weights[i+1] - skill_weights[i])
            if diff > SMOOTH_ALLOW:
                penalty += SMOOTH_WEIGHT * ((diff - SMOOTH_ALLOW) ** 2)

    return penalty

def objective(weights_flat, X, y, param_map, prior=None, lambda_reg=0.001, lambda_constraints=0.1, lambda_prior=2.0):
    """
    Objective function: Minimize variance of predictions + regularization + prior deviation.
    When all targets are the same (all 99 overall), minimize variance in total weights.
    """
    predictions = X @ weights_flat
    
    # Minimize variance instead of MSE when all targets are identical
    mean_pred = np.mean(predictions)
    variance = np.mean((predictions - mean_pred) ** 2)
    
    # L2 regularization to keep weights small
    reg_term = lambda_reg * np.sum(weights_flat ** 2)
    
    # Prior deviation (stay close to existing weights)
    prior_term = 0
    if prior is not None:
        prior_term = lambda_prior * np.sum((weights_flat - prior) ** 2)
    
    # Constraint penalties
    constraint_penalty = lambda_constraints * enforce_constraints(weights_flat, param_map)
    
    return variance + reg_term + prior_term + constraint_penalty

def optimize_weights(X, y, param_map, prior=None):
    """
    Find optimal weights using constrained optimization.
    If prior is provided, use it as the initial guess.
    """
    n_params = len(param_map)
    
    # Initial guess: use prior if available, otherwise small positive values
    if prior is not None:
        x0 = prior.copy()
    else:
        x0 = np.ones(n_params) * 50
    
    # Bounds: weights must be non-negative
    bounds = [(0, None) for _ in range(n_params)]
    
    print(f"  Optimizing {n_params} parameters from {len(y)} observations...")
    
    result = minimize(
        objective,
        x0,
        args=(X, y, param_map, prior, 0.001, 0.1, 2.0),
        method='L-BFGS-B',
        bounds=bounds,
        options={'maxiter': 50000, 'disp': True}
    )
    
    if result.success:
        print(f"  ✓ Optimization converged")
    else:
        print(f"  ⚠ Optimization did not fully converge: {result.message}")
    
    return result.x

def convert_to_output_format(weights_flat, param_map, height, prior_weights_full=None):
    """
    Convert flat weight array to JSON format matching build_weights.json structure.
    Uses optimized weights for MIN_VALUE-MAX_VALUE range, and prior weights for the rest.
    """
    height_data = {}
    
    for skill in SKILLS:
        skill_weights = []
        
        # Build full 75-element array (indices 0-74 for values 25-99)
        for val in range(25, 100):
            array_idx = val - 25  # 0-based index in output array
            
            if val < MIN_VALUE or val > MAX_VALUE:
                # Use prior weight for values outside optimized range
                if prior_weights_full and skill in prior_weights_full:
                    prior_value = prior_weights_full[skill][array_idx]
                    skill_weights.append(prior_value)
                else:
                    skill_weights.append(None)
            else:
                # Use optimized weight for values in range
                if (skill, val) in param_map:
                    idx = param_map[(skill, val)]
                    weight = weights_flat[idx]
                    skill_weights.append(0 if val == MIN_VALUE else round(weight))
                else:
                    skill_weights.append(None)
        
        height_data[skill] = skill_weights
    
    return height_data

def validate_results(X, y, weights_flat):
    """
    Validate the results by checking prediction accuracy.
    """
    predictions = X @ weights_flat
    
    # Diagnostics
    print(f"\n  Diagnostics:")
    print(f"    Target overall range: {y.min():.1f} - {y.max():.1f}")
    print(f"    Raw predictions range: {predictions.min():.1f} - {predictions.max():.1f}")
    print(f"    Weights range: {weights_flat.min():.1f} - {weights_flat.max():.1f}")
    
    mse = np.mean((predictions - y) ** 2)
    rmse = np.sqrt(mse)
    
    # Calculate percentage errors
    errors = np.abs(predictions - y) / y * 100
    mean_error = np.mean(errors)
    max_error = np.max(errors)
    
    print(f"\n  Validation:")
    print(f"    RMSE: {rmse:.2f}")
    print(f"    Mean error: {mean_error:.2f}%")
    print(f"    Max error: {max_error:.2f}%")
    
    return mean_error < 5.0  # Success if mean error < 5%

def main():
    parser = argparse.ArgumentParser(description="Reverse-engineer individual skill weights from build CSV data")
    parser.add_argument('input_file', help='Path to input CSV file')
    parser.add_argument('--overall', type=int, default=99, help='Filter to only builds with this overall rating (default: 99)')
    parser.add_argument('--total-constant', type=float, default=100000.0, help='If all builds share the same total weight, provide that value here (used when CSV lacks a total weight column). Default: 100000')
    args = parser.parse_args()

    input_file = args.input_file
    output_file = Path(__file__).parent.parent / 'src' / 'data' / 'build_weights_engineered.json'
    prior_file = Path(__file__).parent.parent / 'src' / 'data' / 'build_weights.json'
    
    print(f"Loading build data from {input_file}...")
    builds = load_build_data_csv(input_file, total_constant=args.total_constant)
    
    print(f"Loaded {len(builds)} builds")
    
    # Filter to target overall if specified
    if args.overall:
        builds = [b for b in builds if b.get('overall') == args.overall]
        print(f"Filtered to {len(builds)} builds with overall={args.overall}")
    
    # Get unique heights
    heights = sorted(set(b['height'] for b in builds))
    print(f"Heights: {heights}")
    
    output_data = {}
    
    for height in heights:
        print(f"\nProcessing height {height}\"...")
        
        X, y, param_map = create_observation_matrix(builds, height)
        
        if X is None:
            print(f"  No data for height {height}, skipping")
            continue
        
        print(f"  {len(y)} builds available")
        
        # Load prior weights if available (for full range)
        prior = load_prior_weights(str(prior_file), height, param_map)
        
        # Also load full prior weights for output (to preserve values outside optimized range)
        prior_weights_full = None
        try:
            with open(prior_file, 'r') as f:
                prior_data = json.load(f)
                prior_weights_full = prior_data.get(str(height), {})
        except:
            pass
        
        # Optimize weights
        weights_flat = optimize_weights(X, y, param_map, prior=prior)
        
        # Validate
        if validate_results(X, y, weights_flat):
            print(f"  ✓ Validation passed")
        else:
            print(f"  ⚠ Validation warning: error > 5%")
        
        # Convert to output format (preserving prior weights for values outside range)
        height_data = convert_to_output_format(weights_flat, param_map, height, prior_weights_full)
        output_data[str(height)] = height_data
    
    # Save results
    print(f"\nSaving results to {output_file}...")
    with open(output_file, 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print("✓ Done!")
    print(f"\nTo use these weights, replace src/data/build_weights.json with:")
    print(f"  cp {output_file} src/data/build_weights.json")

if __name__ == '__main__':
    main()
