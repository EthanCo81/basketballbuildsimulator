/**
 * Attribute dependency constraints.
 * 
 * Each constraint defines a relationship between a primary and dependent attribute.
 * When the primary attribute changes, the dependent may need to adjust.
 * Constraints can be height-specific.
 * 
 * HOW TO ADD A NEW CONSTRAINT:
 * 
 * 1. Add a new object to the ATTRIBUTE_CONSTRAINTS array
 * 2. Set primary and dependent skill names (must match SKILLS array exactly)
 * 3. Set constraint as an array of objects with:
 *    - height: height in inches (e.g., 80 for 6'8") or null for all heights
 *    - maxDifference: primary can't exceed dependent by more than this value
 * 
 * Example:
 * {
 *   primary: 'Driving Dunk',
 *   dependent: 'Close Shot',
 *   constraint: [{ height: 80, maxDifference: 20 }],
 * }
 */

export const ATTRIBUTE_CONSTRAINTS = [
  // FINISHING
  {
    // For 6'8" players: Close Shot can't be more than 25 above Driving Layup
    primary: 'Close Shot',
    dependent: 'Driving Layup',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Close Shot can't be more than 40 above Free Throw
    primary: 'Close Shot',
    dependent: 'Free Throw',
    constraint: [{ height: 80, maxDifference: 40 }],
  },
  {
    // For 6'8" players: Close Shot can't be more than 40 above Mid Range Shot
    primary: 'Close Shot',
    dependent: 'Mid Range Shot',
    constraint: [{ height: 80, maxDifference: 40 }],
  },
  {
    // For 6'8" players: Driving Layup can't be more than 10 above Close Shot
    primary: 'Driving Layup',
    dependent: 'Close Shot',
    constraint: [{ height: 80, maxDifference: 10 }],
  },
  {
    // For 6'8" players: Driving Layup can't be more than 30 above Ball Handle
    primary: 'Driving Layup',
    dependent: 'Ball Handle',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Driving Layup can't be more than 35 above Strength
    primary: 'Driving Layup',
    dependent: 'Strength',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  {
    // For 6'8" players: Driving Dunk can't be more than 20 above Close Shot
    primary: 'Driving Dunk',
    dependent: 'Close Shot',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Driving Dunk can't be more than 20 above Driving Layup
    primary: 'Driving Dunk',
    dependent: 'Driving Layup',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Driving Dunk can't be more than 20 above Vertical
    primary: 'Driving Dunk',
    dependent: 'Vertical',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Driving Dunk can't be more than 35 above Ball Handle
    primary: 'Driving Dunk',
    dependent: 'Ball Handle',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  {
    // For 6'8" players: Driving Dunk can't be more than 40 above Standing Dunk
    primary: 'Driving Dunk',
    dependent: 'Standing Dunk',
    constraint: [{ height: 80, maxDifference: 40 }],
  },
  {
    // For 6'8" players: Driving Dunk can't be more than 40 above Strength
    primary: 'Driving Dunk',
    dependent: 'Strength',
    constraint: [{ height: 80, maxDifference: 40 }],
  },
  {
    // For 6'8" players: Standing Dunk can't be more than 15 above Close Shot
    primary: 'Standing Dunk',
    dependent: 'Close Shot',
    constraint: [{ height: 80, maxDifference: 15 }],
  },
  {
    // For 6'8" players: Standing Dunk can't be more than 15 above Driving Dunk
    primary: 'Standing Dunk',
    dependent: 'Driving Dunk',
    constraint: [{ height: 80, maxDifference: 15 }],
  },
  {
    // For 6'8" players: Post Control can't be more than 5 above Close Shot
    primary: 'Post Control',
    dependent: 'Close Shot',
    constraint: [{ height: 80, maxDifference: 5 }],
  },
  {
    // For 6'8" players: Post Control can't be more than 30 above Strength
    primary: 'Post Control',
    dependent: 'Strength',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Post Control can't be more than 40 above Ball Handle
    primary: 'Post Control',
    dependent: 'Ball Handle',
    constraint: [{ height: 80, maxDifference: 40 }],
  },
  {
    // For 6'8" players: Post Control can't be more than 40 above Offensive Rebound
    primary: 'Post Control',
    dependent: 'Offensive Rebound',
    constraint: [{ height: 80, maxDifference: 40 }],
  },
  // SHOOTING
  {
    // For 6'8" players: Mid Range Shot can't be more than 15 above Close Shot
    primary: 'Mid Range Shot',
    dependent: 'Close Shot',
    constraint: [{ height: 80, maxDifference: 15 }],
  },
  {
    // For 6'8" players: Mid Range Shot can't be more than 25 above Free Throw
    primary: 'Mid Range Shot',
    dependent: 'Free Throw',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Mid Range Shot can't be more than 45 above Three Point Shot
    primary: 'Mid Range Shot',
    dependent: 'Three Point Shot',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // Three Point Shot can't be more than 10 above Mid Range Shot
    primary: 'Three Point Shot',
    dependent: 'Mid Range Shot',
    constraint: [{ height: null, maxDifference: 10 }],
    // When primary increases, dependent must be at least (primary - maxDifference)
    // When dependent decreases, primary must also decrease if needed
  },
  {
    // For 6'8" players: Three Point Shot can't be more than 25 above Free Throw
    primary: 'Three Point Shot',
    dependent: 'Free Throw',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Free Throw can't be more than 25 above Mid Range Shot
    primary: 'Free Throw',
    dependent: 'Mid Range Shot',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Free Throw can't be more than 35 above Three Point Shot
    primary: 'Free Throw',
    dependent: 'Three Point Shot',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  // PLAYMAKING
  {
    // For 6'8" players: Pass Accuracy can't be more than 20 above Ball Handle
    primary: 'Pass Accuracy',
    dependent: 'Ball Handle',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Ball Handle can't be more than 15 above Driving Layup
    primary: 'Ball Handle',
    dependent: 'Driving Layup',
    constraint: [{ height: 80, maxDifference: 15 }],
  },
  {
    // For 6'8" players: Ball Handle can't be more than 15 above Pass Accuracy
    primary: 'Ball Handle',
    dependent: 'Pass Accuracy',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Ball Handle can't be more than 25 above Post Control
    primary: 'Ball Handle',
    dependent: 'Post Control',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  {
    // For 6'8" players: Ball Handle can't be more than 20 above Speed with Ball
    primary: 'Ball Handle',
    dependent: 'Speed with Ball',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Speed with Ball can't be more than 5 above Ball Handle
    primary: 'Speed with Ball',
    dependent: 'Ball Handle',
    constraint: [{ height: 80, maxDifference: 5 }],
  },
  {
    // For 6'8" players: Speed with Ball can't be higher than Speed
    primary: 'Speed with Ball',
    dependent: 'Speed',
    constraint: [{ height: 80, maxDifference: 0 }],
  },
  // DEFENSE
  {
    // For 6'8" players: Interior Defense can't be more than 20 above Defensive Rebound
    primary: 'Interior Defense',
    dependent: 'Defensive Rebound',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Interior Defense can't be more than 20 above Strength
    primary: 'Interior Defense',
    dependent: 'Strength',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Interior Defense can't be more than 30 above Block
    primary: 'Interior Defense',
    dependent: 'Block',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Interior Defense can't be more than 45 above Steal
    primary: 'Interior Defense',
    dependent: 'Steal',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // For 6'8" players: Interior Defense can't be more than 50 above Perimeter Defense
    primary: 'Interior Defense',
    dependent: 'Perimeter Defense',
    constraint: [{ height: 80, maxDifference: 50 }],
  },
  {
    // For 6'8" players: Perimeter Defense can't be more than 20 above Agility
    primary: 'Perimeter Defense',
    dependent: 'Agility',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Perimeter Defense can't be more than 30 above Steal
    primary: 'Perimeter Defense',
    dependent: 'Steal',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Perimeter Defense can't be more than 30 above Defensive Rebound
    primary: 'Perimeter Defense',
    dependent: 'Defensive Rebound',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Perimeter Defense can't be more than 35 above Strength
    primary: 'Perimeter Defense',
    dependent: 'Strength',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  {
    // For 6'8" players: Perimeter Defense can't be more than 45 above Interior Defense
    primary: 'Perimeter Defense',
    dependent: 'Interior Defense',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // For 6'8" players: Perimeter Defense can't be more than 45 above Block
    primary: 'Perimeter Defense',
    dependent: 'Block',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // For 6'8" players: Steal can't be more than 25 above Interior Defense
    primary: 'Steal',
    dependent: 'Interior Defense',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Steal can't be more than 25 above Perimeter Defense
    primary: 'Steal',
    dependent: 'Perimeter Defense',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Steal can't be more than 35 above Agility
    primary: 'Steal',
    dependent: 'Agility',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  {
    // For 6'8" players: Block can't be more than 20 above Interior Defense
    primary: 'Block',
    dependent: 'Interior Defense',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Block can't be more than 25 above Defensive Rebound
    primary: 'Block',
    dependent: 'Defensive Rebound',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Block can't be more than 30 above Vertical
    primary: 'Block',
    dependent: 'Vertical',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Block can't be more than 45 above Steal
    primary: 'Block',
    dependent: 'Steal',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // For 6'8" players: Defensive Rebound can't be more than 25 above Offensive Rebound
    primary: 'Defensive Rebound',
    dependent: 'Offensive Rebound',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Defensive Rebound can't be more than 25 above Interior Defense
    primary: 'Defensive Rebound',
    dependent: 'Interior Defense',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Defensive Rebound can't be more than 40 above Block
    primary: 'Defensive Rebound',
    dependent: 'Block',
    constraint: [{ height: 80, maxDifference: 40 }],
  },
  {
    // For 6'8" players: Defensive Rebound can't be more than 45 above Vertical
    primary: 'Defensive Rebound',
    dependent: 'Vertical',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // For 6'8" players: Offensive Rebound can't be more than 15 above Close Shot
    primary: 'Offensive Rebound',
    dependent: 'Close Shot',
    constraint: [{ height: 80, maxDifference: 15 }],
  },
  {
    // For 6'8" players: Offensive Rebound can't be more than 15 above Defensive Rebound
    primary: 'Offensive Rebound',
    dependent: 'Defensive Rebound',
    constraint: [{ height: 80, maxDifference: 15 }],
  },
  {
    // For 6'8" players: Offensive Rebound can't be more than 45 above Vertical
    primary: 'Offensive Rebound',
    dependent: 'Vertical',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  // PHYSICALS
  {
    // For 6'8" players: Agility can't be more than 10 above Speed
    primary: 'Agility',
    dependent: 'Speed',
    constraint: [{ height: 80, maxDifference: 10 }],
  },
  {
    // For 6'8" players: Agility can't be more than 30 above Defensive Rebound
    primary: 'Agility',
    dependent: 'Defensive Rebound',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Agility can't be more than 45 above Steal
    primary: 'Agility',
    dependent: 'Steal',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // For 6'8" players: Speed can't be more than 15 above Agility
    primary: 'Speed',
    dependent: 'Agility',
    constraint: [{ height: 80, maxDifference: 15 }],
  },
  {
    // For 6'8" players: Speed can't be more than 30 above Speed with Ball
    primary: 'Speed',
    dependent: 'Speed with Ball',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Speed can't be more than 30 above Perimeter Defense
    primary: 'Speed',
    dependent: 'Perimeter Defense',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Speed can't be more than 30 above Vertical
    primary: 'Speed',
    dependent: 'Vertical',
    constraint: [{ height: 80, maxDifference: 30 }],
  },
  {
    // For 6'8" players: Strength can't be more than 20 above Interior Defense
    primary: 'Strength',
    dependent: 'Interior Defense',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Strength can't be more than 35 above Post Control
    primary: 'Strength',
    dependent: 'Post Control',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  {
    // For 6'8" players: Vertical can't be more than 20 above Close Shot
    primary: 'Vertical',
    dependent: 'Close Shot',
    constraint: [{ height: 80, maxDifference: 20 }],
  },
  {
    // For 6'8" players: Vertical can't be more than 25 above Driving Dunk
    primary: 'Vertical',
    dependent: 'Driving Dunk',
    constraint: [{ height: 80, maxDifference: 25 }],
  },
  {
    // For 6'8" players: Vertical can't be more than 35 above Standing Dunk
    primary: 'Vertical',
    dependent: 'Standing Dunk',
    constraint: [{ height: 80, maxDifference: 35 }],
  },
  {
    // For 6'8" players: Vertical can't be more than 37 above Defensive Rebound
    primary: 'Vertical',
    dependent: 'Defensive Rebound',
    constraint: [{ height: 80, maxDifference: 37 }],
  },
  {
    // For 6'8" players: Vertical can't be more than 45 above Block
    primary: 'Vertical',
    dependent: 'Block',
    constraint: [{ height: 80, maxDifference: 45 }],
  },
  {
    // For 6'8" players: Vertical can't be more than 55 above Offensive Rebound
    primary: 'Vertical',
    dependent: 'Offensive Rebound',
    constraint: [{ height: 80, maxDifference: 55 }],
  },
];

/**
 * Check if a skill change would violate constraints when it's the primary attribute
 * Returns { valid: boolean, updates: object, error: string }
 */
export function checkPrimaryConstraints(skill, newValue, currentValues, heightInches) {
  const updates = {};
  
  // Find all constraints where this skill is the primary
  const constraints = ATTRIBUTE_CONSTRAINTS.filter(c => c.primary === skill);
  
  for (const constraintDef of constraints) {
    // Find the maxDifference for the current height
    const heightConstraint = constraintDef.constraint.find(c => c.height === null || c.height === heightInches);
    if (!heightConstraint) continue;
    
    const dependentValue = currentValues[constraintDef.dependent];
    
    // Primary can't be more than maxDifference above dependent
    const requiredDependent = newValue - heightConstraint.maxDifference;
    
    if (dependentValue < requiredDependent) {
      updates[constraintDef.dependent] = requiredDependent;
    }
  }
  
  return { valid: true, updates };
}

/**
 * Check if a skill change would violate constraints when it's the dependent attribute
 * Also handles auto-adjusting the primary if dependent is decreased
 * Returns { valid: boolean, updates: object, error: string }
 */
export function checkDependentConstraints(skill, newValue, currentValues, heightInches) {
  const updates = {};
  
  // Find all constraints where this skill is the dependent
  const constraints = ATTRIBUTE_CONSTRAINTS.filter(c => c.dependent === skill);
  
  for (const constraintDef of constraints) {
    // Find the maxDifference for the current height
    const heightConstraint = constraintDef.constraint.find(c => c.height === null || c.height === heightInches);
    if (!heightConstraint) continue;
    
    const primaryValue = currentValues[constraintDef.primary];
    
    // When dependent decreases, check if primary needs to decrease too
    // Primary can't be more than maxDifference above dependent
    const maxAllowedPrimary = newValue + heightConstraint.maxDifference;
    
    if (primaryValue > maxAllowedPrimary) {
      // Auto-adjust primary downward
      updates[constraintDef.primary] = maxAllowedPrimary;
    }
  }
  
  return { valid: true, updates };
}

/**
 * Resolve all cascading constraint updates.
 * Iteratively applies constraints until no more changes are needed.
 * Returns the final set of updates including the initial change.
 */
export function resolveAllConstraints(skill, newValue, currentValues, heightInches) {
  const MAX_ITERATIONS = 20; // Prevent infinite loops
  let iteration = 0;
  
  // Start with the initial change
  let pendingUpdates = { [skill]: newValue };
  let finalValues = { ...currentValues, ...pendingUpdates };
  
  while (iteration < MAX_ITERATIONS) {
    iteration++;
    let hasNewUpdates = false;
    const iterationUpdates = {};
    
    // For each pending update, check what constraints it triggers
    for (const [changedSkill, changedValue] of Object.entries(pendingUpdates)) {
      // Check primary constraints (this skill affects others)
      const primaryCheck = checkPrimaryConstraints(changedSkill, changedValue, finalValues, heightInches);
      
      // Check dependent constraints (this skill is affected by others)
      const dependentCheck = checkDependentConstraints(changedSkill, changedValue, finalValues, heightInches);
      
      // Merge new updates
      for (const [updateSkill, updateValue] of Object.entries({ ...primaryCheck.updates, ...dependentCheck.updates })) {
        if (finalValues[updateSkill] !== updateValue) {
          iterationUpdates[updateSkill] = updateValue;
          hasNewUpdates = true;
        }
      }
    }
    
    if (!hasNewUpdates) {
      // No more changes needed, we're done
      break;
    }
    
    // Apply iteration updates to final values and prepare for next iteration
    finalValues = { ...finalValues, ...iterationUpdates };
    pendingUpdates = iterationUpdates;
  }
  
  // Return only the attributes that changed from the original currentValues
  const updates = {};
  for (const [key, value] of Object.entries(finalValues)) {
    if (currentValues[key] !== value) {
      updates[key] = value;
    }
  }
  
  return { valid: true, updates };
}
