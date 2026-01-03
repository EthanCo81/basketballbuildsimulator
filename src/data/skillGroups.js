// Skill groups with associated colors
const SKILL_GROUPS = {
  Finishing: {
    color: '#0a84ff', // blue
    skills: ['Close Shot', 'Driving Layup', 'Driving Dunk', 'Standing Dunk', 'Post Control'],
  },
  Shooting: {
    color: '#10b981', // green
    skills: ['Mid Range Shot', 'Three Point Shot', 'Free Throw'],
  },
  Playmaking: {
    color: '#f59e0b', // gold
    skills: ['Pass Accuracy', 'Ball Handle', 'Speed with Ball'],
  },
  Defense: {
    color: '#ef4444', // red
    skills: ['Interior Defense', 'Perimeter Defense', 'Steal', 'Block'],
  },
  Rebounding: {
    color: '#a855f7', // purple
    skills: ['Offensive Rebound', 'Defensive Rebound'],
  },
  Physicals: {
    color: '#d4a574', // beige
    skills: ['Speed', 'Agility', 'Strength', 'Vertical'],
  },
};

// Helper function to get group info for a skill
function getSkillGroup(skillName) {
  for (const [groupName, groupData] of Object.entries(SKILL_GROUPS)) {
    if (groupData.skills.includes(skillName)) {
      return { name: groupName, color: groupData.color };
    }
  }
  return null;
}

// Get all skills in group order
function getOrderedSkills() {
  const ordered = [];
  for (const groupData of Object.values(SKILL_GROUPS)) {
    ordered.push(...groupData.skills);
  }
  return ordered;
}

module.exports = { SKILL_GROUPS, getSkillGroup, getOrderedSkills };
