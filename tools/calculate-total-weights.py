#!/usr/bin/env python3
"""
Calculate total weights for builds using existing build_weights.json.
Useful for finding the total weight that corresponds to 99 overall rating.
"""

import json
import csv
import re
import numpy as np
from pathlib import Path

SKILLS = [
    'Close Shot', 'Driving Layup', 'Driving Dunk', 'Standing Dunk', 'Post Control',
    'Mid Range Shot', 'Three Point Shot', 'Free Throw', 'Pass Accuracy', 'Ball Handle',
    'Speed with Ball', 'Interior Defense', 'Perimeter Defense', 'Steal', 'Block',
    'Offensive Rebound', 'Defensive Rebound', 'Speed', 'Agility', 'Strength', 'Vertical'
]

def parse_height(height_str):
    """Parse height string in format X'Y to total inches."""
    if isinstance(height_str, int):
        return height_str
    
    height_str = str(height_str).strip()
    match = re.search(r"(\d+)\s*[^\d]+\s*(\d+)", height_str)
    if match:
        feet = int(match.group(1))
        inches = int(match.group(2))
        return feet * 12 + inches
    return None

def load_weights(weights_file):
    """Load build_weights.json."""
    with open(weights_file, 'r') as f:
        return json.load(f)

def calculate_build_weight(build, weights_data):
    """Calculate total weight for a build using build_weights.json.
    Simple cumulative sum (no bucket multipliers)."""
    height = build['height']
    height_key = str(height)
    
    if height_key not in weights_data:
        return None
    
    height_weights = weights_data[height_key]
    total = 0
    
    for skill in SKILLS:
        skill_value = build['skills'][skill]
        
        if skill not in height_weights:
            continue
        
        skill_weights_array = height_weights[skill]
        
        # Sum all weights from 25 up to skill_value (no bucket multipliers)
        for val in range(25, skill_value + 1):
            index = val - 25
            if 0 <= index < len(skill_weights_array):
                weight = skill_weights_array[index]
                if weight is not None:
                    total += weight
    
    return total

def load_builds_from_csv(csv_file):
    """Load builds from CSV file."""
    builds = []
    
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        
        # Normalize column names (case-insensitive)
        headers = {h.lower().strip(): h for h in reader.fieldnames}
        
        for row in reader:
            # Parse height
            height_col = headers.get('height')
            height = parse_height(row[height_col])
            if not height:
                continue
            
            # Get overall rating
            overall_col = headers.get('overall') or headers.get('ovr')
            overall = int(row[overall_col]) if overall_col else None
            
            # Parse skills
            skills = {}
            for skill in SKILLS:
                skill_lower = skill.lower()
                if skill_lower in headers:
                    skills[skill] = int(row[headers[skill_lower]])
            
            if len(skills) != len(SKILLS):
                continue
            
            builds.append({
                'height': height,
                'overall': overall,
                'skills': skills,
                'position': row.get(headers.get('position', ''), 'Unknown')
            })
    
    return builds

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Calculate total weights for builds")
    parser.add_argument('csv_file', help='Path to CSV file with builds')
    parser.add_argument('--overall', type=int, help='Filter by overall rating (e.g., 99)')
    args = parser.parse_args()
    
    # Load weights
    weights_file = Path(__file__).parent.parent / 'src' / 'data' / 'build_weights.json'
    print(f"Loading weights from {weights_file}...")
    weights_data = load_weights(weights_file)
    
    # Load builds
    print(f"Loading builds from {args.csv_file}...")
    builds = load_builds_from_csv(args.csv_file)
    print(f"Loaded {len(builds)} builds")
    
    # Filter by overall if specified
    if args.overall:
        builds = [b for b in builds if b['overall'] == args.overall]
        print(f"Filtered to {len(builds)} builds with overall={args.overall}")
    
    if not builds:
        print("No builds found matching criteria")
        return
    
    # Calculate weights
    print("\nCalculating total weights...")
    results = []
    
    for build in builds:
        total_weight = calculate_build_weight(build, weights_data)
        if total_weight is not None:
            results.append({
                'position': build['position'],
                'height': build['height'],
                'overall': build['overall'],
                'total_weight': total_weight
            })
    
    if not results:
        print("Could not calculate weights for any builds")
        return
    
    # Print results
    print(f"\nResults for {len(results)} builds:")
    print("-" * 80)
    print(f"{'Position':<10} {'Height':<8} {'Overall':<8} {'Total Weight':<15}")
    print("-" * 80)
    
    for r in results:
        print(f"{r['position']:<10} {r['height']}\"      {r['overall']:<8} {r['total_weight']:,.0f}")
    
    # Statistics
    weights = [r['total_weight'] for r in results]
    print("-" * 80)
    print(f"\nStatistics:")
    print(f"  Mean:   {np.mean(weights):,.0f}")
    print(f"  Median: {np.median(weights):,.0f}")
    print(f"  Min:    {np.min(weights):,.0f}")
    print(f"  Max:    {np.max(weights):,.0f}")
    print(f"  Std:    {np.std(weights):,.0f}")
    
    if args.overall:
        print(f"\n💡 Suggested total weight constant for overall={args.overall}: {np.mean(weights):,.0f}")

if __name__ == '__main__':
    main()
