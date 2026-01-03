#!/usr/bin/env python3
"""
Script to create a VC weights CSV file from user input.
Reads the template from vc_weight_template.csv and populates it with transformed data.
"""

import csv
import os
from pathlib import Path


def load_template(template_path):
    """
    Load the template CSV structure without modifying the original file.
    Returns a list of rows representing the template.
    """
    with open(template_path, 'r', newline='') as f:
        reader = csv.reader(f)
        template_data = list(reader)
    return template_data


def transform_numbers(numbers):
    """
    Transform cumulative input numbers to cell values by calculating differences.
    
    The first number is the actual cell value.
    Each subsequent number is cumulative, so we subtract the previous cumulative
    value to get the cell value for that position.
    
    Args:
        numbers: List of cumulative numbers from user
    
    Returns:
        List of cell values (differences between consecutive cumulative values)
    """
    if not numbers:
        return []
    
    cell_values = [numbers[0]]  # First value is already the cell value
    
    for i in range(1, len(numbers)):
        difference = numbers[i] - numbers[i-1]
        cell_values.append(difference)
    
    return cell_values


def populate_csv(template_data, transformed_data, row_name, starting_column):
    """
    Populate the template with transformed data.
    
    Args:
        template_data: The template structure (list of rows)
        transformed_data: The transformed numbers to insert
        row_name: Name of the row to populate (e.g., "Close Shot")
        starting_column: Column value to start at (25-99)
    
    Returns:
        Populated CSV data
    """
    # Deep copy the template
    populated = [row[:] for row in template_data]
    
    # Find the row index for the given row name
    row_index = None
    for i, row in enumerate(populated):
        if row[0] == row_name:
            row_index = i
            break
    
    if row_index is None:
        print(f"Warning: Row '{row_name}' not found in template")
        return populated
    
    # Calculate the column index offset (column 25 is at index 1, 26 at index 2, etc.)
    column_offset = starting_column - 25 + 1
    
    # Insert the transformed data starting at the specified column
    for i, value in enumerate(transformed_data):
        col_index = column_offset + i
        if col_index < len(populated[row_index]):
            populated[row_index][col_index] = value
        else:
            print(f"Warning: Column index {col_index} out of range")
            break
    
    return populated


def write_output_csv(data, output_path):
    """
    Write the populated data to a new CSV file.
    
    Args:
        data: List of rows to write
        output_path: Path to the output CSV file
    """
    with open(output_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)
    print(f"CSV file created successfully: {output_path}")


def get_user_input(row_name):
    """
    Get starting column and a series of cumulative numbers from user input.
    
    Args:
        row_name: Name of the row being populated (e.g., "Close Shot")
    
    Returns:
        Tuple of (starting_column, list of cumulative numbers), or (None, None) if skipped
    """
    # Get starting column
    while True:
        try:
            starting_input = input(f"{row_name} starting value (26-80, or 's' to skip): ")
            
            # Allow skipping this row
            if starting_input.lower() in ['s', 'skip']:
                return None, None
            
            starting_column = int(starting_input)
            if 26 <= starting_column <= 80:
                break
            else:
                print("Please enter a value between 26 and 80.")
        except ValueError:
            print("Invalid input. Please enter a number or 's' to skip.")
    
    # Get cumulative values
    print(f"\nEnter cumulative values for {row_name} starting at column {starting_column}.")
    print("Type 'x' when finished.")
    
    numbers = []
    while True:
        user_input = input(f"Value {len(numbers) + 1}: ")
        
        if user_input.lower() == 'x':
            break
        
        try:
            value = int(user_input)
            numbers.append(value)
        except ValueError:
            print("Invalid input. Please enter a number or 'x'.")
    
    return starting_column, numbers


def main():
    # Set up paths
    script_dir = Path(__file__).parent
    workspace_root = script_dir.parent
    template_path = workspace_root / "src" / "resources" / "vc_weight_template.csv"
    output_dir = workspace_root / "src" / "resources" / "vc_weights"
    
    # Verify template exists
    if not template_path.exists():
        print(f"Error: Template file not found at {template_path}")
        return
    
    print(f"Loading template from: {template_path}")
    template_data = load_template(template_path)
    
    # Start with a copy of the template
    populated_data = [row[:] for row in template_data]
    
    # Get all row names (skip the header row)
    row_names = [row[0] for row in template_data[1:] if row[0]]
    
    # Process each row
    for row_name in row_names:
        print(f"\n{'='*60}")
        
        # Get user input for this row
        starting_column, user_numbers = get_user_input(row_name)
        
        # Check if user skipped this row
        if starting_column is None:
            print(f"{row_name} skipped.\\n")
            continue
        
        if not user_numbers:
            print(f"No data entered for {row_name}. Skipping.")
            continue
        
        # Transform the numbers (cumulative to differences)
        transformed = transform_numbers(user_numbers)
        
        # Calculate the ending column
        ending_column = starting_column + len(transformed) - 1
        
        # Populate the CSV with transformed data
        populated_data = populate_csv(populated_data, transformed, row_name, starting_column)
        
        # Show confirmation
        print(f"\n{row_name} received values for {starting_column} - {ending_column}")
    
    # Prompt for filename
    print(f"\n{'='*60}")
    filename = input("\nEnter filename to save (without .csv extension): ")
    if not filename:
        filename = "vc_weights_output"
    
    # Ensure .csv extension
    if not filename.endswith('.csv'):
        filename += '.csv'
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename
    
    # Write output
    write_output_csv(populated_data, output_path)


if __name__ == "__main__":
    main()
