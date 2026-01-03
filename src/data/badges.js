/**
 * Badge system with multiple levels based on attribute values
 */

export const BADGES = [
  {
    id: 'deadeye',
    name: 'Deadeye',
    description: 'Ability to Ignore Defense When Shooting',
    icon: '🔫',
    categories: ['Shooting'],
    attributes: ['Mid Range Shot', 'Three Point Shot'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 73, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 85, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 92, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 95, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => Math.max(values['Mid Range Shot'] || 0, values['Three Point Shot'] || 0),
  },
  {
    id: 'limitless_range',
    name: 'Limitless Range',
    description: 'Ability to Shoot Far Beyond the Arc',
    icon: '🌌',
    categories: ['Shooting'],
    attributes: ['Three Point Shot'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 83, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 89, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 93, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 96, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Three Point Shot'] || 0,
  },
  {
    id: 'mini_marksman',
    name: 'Mini Marksman',
    description: 'Increases Shot Window When Shooting Over Taller Defenders',
    icon: '📏',
    categories: ['Shooting'],
    attributes: ['Mid Range Shot', 'Three Point Shot'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 75, // 6'3"
    levels: [
      { level: 1, threshold: 71, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 82, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 94, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 97, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => Math.max(values['Mid Range Shot'] || 0, values['Three Point Shot'] || 0),
  },
  {
    id: 'set_shot_specialist',
    name: 'Set Shot Specialist',
    description: 'Increases Shot Window When Standing Still',
    icon: '🦵',
    categories: ['Shooting'],
    attributes: ['Mid Range Shot', 'Three Point Shot'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 65, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 78, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 89, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 95, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 98, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => Math.max(values['Mid Range Shot'] || 0, values['Three Point Shot'] || 0),
  },
  {
    id: 'shifty_shooter',
    name: 'Shifty Shooter',
    description: 'Increases Green Window When Shooting on the Move',
    icon: '🏃',
    categories: ['Shooting'],
    attributes: ['Mid Range Shot', 'Three Point Shot'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 83, // 6'11"
    levels: [
      { level: 1, threshold: 76, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 87, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 91, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 96, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => Math.max(values['Mid Range Shot'] || 0, values['Three Point Shot'] || 0),
  },
  {
    id: 'ankle_assassin',
    name: 'Ankle Assassin',
    description: 'Increases Chance of Ankle-Breaking Animation on Defenders',
    icon: '👟',
    categories: ['Playmaking'],
    attributes: ['Ball Handle'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 82, // 6'10"
    levels: [
      { level: 1, threshold: 75, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 86, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 93, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 95, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 98, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Ball Handle'] || 0,
  },
  {
    id: 'bail_out',
    name: 'Bail Out',
    description: 'More Likely to Succeed When Passing Out of Shot',
    icon: '🙌',
    categories: ['Playmaking'],
    attributes: ['Pass Accuracy'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 85, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 91, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 94, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 96, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Pass Accuracy'] || 0,
  },
  {
    id: 'break_starter',
    name: 'Break Starter',
    description: 'Sling it Downcourt After a Rebound',
    icon: '🚀',
    categories: ['Playmaking'],
    attributes: ['Pass Accuracy'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 65, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 75, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 87, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 93, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 98, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Pass Accuracy'] || 0,
  },
  {
    id: 'dimer',
    name: 'Dimer',
    description: 'Increased Green Window After Passing',
    icon: '🤝',
    categories: ['Playmaking'],
    attributes: ['Pass Accuracy'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 55, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 71, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 82, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 92, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 98, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Pass Accuracy'] || 0,
  },
  {
    id: 'versitile_visionary',
    name: 'Versitile Visionary',
    description: 'Affects OOP Attempts and Makes Passes Harder to Steal',
    icon: '👁️',
    categories: ['Playmaking'],
    attributes: ['Pass Accuracy'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 70, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 76, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 84, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 95, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Pass Accuracy'] || 0,
  },
  {
    id: 'aerial_wizard',
    name: 'Aerial Wizard',
    description: 'Ability to Convert OOPs and Putbacks',
    icon: '🪄',
    categories: ['Finishing'],
    attributes: ['Driving Dunk', 'Standing Dunk'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      {
        level: 1,
        label: 'Bronze',
        color: '#8B4513',
        drivingDunk: 64,
        standingDunk: 60,
        check: (p) => (p.drivingDunk >= 64) || (p.standingDunk >= 60),
      },
      {
        level: 2,
        label: 'Silver',
        color: '#C0C0C0',
        drivingDunk: 70,
        standingDunk: 75,
        check: (p) => (p.drivingDunk >= 70) || (p.standingDunk >= 75),
      },
      {
        level: 3,
        label: 'Gold',
        color: '#FFD700',
        drivingDunk: 80,
        standingDunk: 84,
        check: (p) => (p.drivingDunk >= 80) || (p.standingDunk >= 84),
      },
      {
        level: 4,
        label: 'Hall of Fame',
        color: '#7B2FBE',
        drivingDunk: 89,
        standingDunk: 92,
        check: (p) => (p.drivingDunk >= 89) || (p.standingDunk >= 92),
      },
      {
        level: 5,
        label: 'Legend',
        color: '#8B0000',
        drivingDunk: 97,
        standingDunk: 98,
        check: (p) => (p.drivingDunk >= 97) || (p.standingDunk >= 98),
      },
    ],
    getProgress: (values) => ({
      drivingDunk: values['Driving Dunk'] || 0,
      standingDunk: values['Standing Dunk'] || 0,
      displayValue: Math.max(values['Driving Dunk'] || 0, values['Standing Dunk'] || 0),
    }),
  },
  {
    id: 'float_game',
    name: 'Float Game',
    description: 'Increases Green Window for Floaters',
    icon: '🌫️',
    categories: ['Finishing'],
    attributes: ['Close Shot', 'Driving Layup'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      {
        level: 1,
        label: 'Bronze',
        color: '#8B4513',
        closeShot: 68,
        drivingLayup: 65,
        check: (p) => (p.closeShot >= 68) || (p.drivingLayup >= 65),
      },
      {
        level: 2,
        label: 'Silver',
        color: '#C0C0C0',
        closeShot: 78,
        drivingLayup: 78,
        check: (p) => (p.closeShot >= 78) || (p.drivingLayup >= 78),
      },
      {
        level: 3,
        label: 'Gold',
        color: '#FFD700',
        closeShot: 86,
        drivingLayup: 88,
        check: (p) => (p.closeShot >= 86) || (p.drivingLayup >= 88),
      },
      {
        level: 4,
        label: 'Hall of Fame',
        color: '#7B2FBE',
        closeShot: 92,
        drivingLayup: 95,
        check: (p) => (p.closeShot >= 92) || (p.drivingLayup >= 95),
      },
      {
        level: 5,
        label: 'Legend',
        color: '#8B0000',
        closeShot: 98,
        drivingLayup: 98,
        check: (p) => (p.closeShot >= 98) || (p.drivingLayup >= 98),
      },
    ],
    getProgress: (values) => ({
      closeShot: values['Close Shot'] || 0,
      drivingLayup: values['Driving Layup'] || 0,
      displayValue: Math.max(values['Close Shot'] || 0, values['Driving Layup'] || 0),
    }),
  },
  {
    id: 'hook_specialist',
    name: 'Hook Specialist',
    description: 'Increases Green Window for Hook Shots',
    icon: '🪝',
    categories: ['Finishing'],
    attributes: ['Close Shot', 'Post Control'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', closeShot: 60, postControl: 61, check: (p) => p.closeShot >= 60 && p.postControl >= 61 },
      { level: 2, label: 'Silver', color: '#C0C0C0', closeShot: 75, postControl: 65, check: (p) => p.closeShot >= 75 && p.postControl >= 65 },
      { level: 3, label: 'Gold', color: '#FFD700', closeShot: 87, postControl: 80, check: (p) => p.closeShot >= 87 && p.postControl >= 80 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', closeShot: 94, postControl: 90, check: (p) => p.closeShot >= 94 && p.postControl >= 90 },
      { level: 5, label: 'Legend', color: '#8B0000', closeShot: 99, postControl: 97, check: (p) => p.closeShot >= 99 && p.postControl >= 97 },
    ],
    getProgress: (values) => ({
      closeShot: values['Close Shot'] || 0,
      postControl: values['Post Control'] || 0,
      displayValue: Math.min(values['Close Shot'] || 0, values['Post Control'] || 0),
    }),
  },
  {
    id: 'layup_mixmaster',
    name: 'Layup Mixmaster',
    description: 'Ability to Convert Difficult Layups',
    icon: '🎨',
    categories: ['Finishing'],
    attributes: ['Driving Layup'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 83, // 6'11"
    levels: [
      { level: 1, threshold: 75, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 85, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 93, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 97, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Driving Layup'] || 0,
  },
  {
    id: 'paint_prodigy',
    name: 'Paint Prodigy',
    description: 'Ability to Finish Near the Rim',
    icon: '🎯',
    categories: ['Finishing'],
    attributes: ['Close Shot'],
    attributeLogic: 'and',
    minHeight: 75, // 6'3"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 73, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 84, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 92, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 96, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Close Shot'] || 0,
  },
  {
    id: 'physical_finisher',
    name: 'Physical Finisher',
    description: 'Ability to Convert Layups Through Contact',
    icon: '💥',
    categories: ['Finishing', 'Physicals'],
    attributes: ['Strength', 'Driving Layup'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', strength: 60, drivingLayup: 70, check: (p) => p.strength >= 60 && p.drivingLayup >= 70 },
      { level: 2, label: 'Silver', color: '#C0C0C0', strength: 67, drivingLayup: 80, check: (p) => p.strength >= 67 && p.drivingLayup >= 80 },
      { level: 3, label: 'Gold', color: '#FFD700', strength: 75, drivingLayup: 90, check: (p) => p.strength >= 75 && p.drivingLayup >= 90 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', strength: 83, drivingLayup: 96, check: (p) => p.strength >= 83 && p.drivingLayup >= 96 },
      { level: 5, label: 'Legend', color: '#8B0000', strength: 97, drivingLayup: 97, check: (p) => p.strength >= 97 && p.drivingLayup >= 97 },
    ],
    getProgress: (values) => ({
      strength: values['Strength'] || 0,
      drivingLayup: values['Driving Layup'] || 0,
      displayValue: Math.min(values['Strength'] || 0, values['Driving Layup'] || 0),
    }),
  },
  {
    id: 'posterizer',
    name: 'Posterizer',
    description: 'Increases chance for dunking on defenders',
    icon: '🔥',
    categories: ['Finishing', 'Physicals'],
    attributes: ['Driving Dunk', 'Vertical'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', drivingDunk: 73, vertical: 65, check: (p) => p.drivingDunk >= 73 && p.vertical >= 65 },
      { level: 2, label: 'Silver', color: '#C0C0C0', drivingDunk: 87, vertical: 75, check: (p) => p.drivingDunk >= 87 && p.vertical >= 75 },
      { level: 3, label: 'Gold', color: '#FFD700', drivingDunk: 93, vertical: 80, check: (p) => p.drivingDunk >= 93 && p.vertical >= 80 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', drivingDunk: 96, vertical: 85, check: (p) => p.drivingDunk >= 96 && p.vertical >= 85 },
      { level: 5, label: 'Legend', color: '#8B0000', drivingDunk: 99, vertical: 90, check: (p) => p.drivingDunk >= 99 && p.vertical >= 90 },
    ],
    getProgress: (values) => ({
      drivingDunk: values['Driving Dunk'] || 0,
      vertical: values['Vertical'] || 0,
      displayValue: Math.min(values['Driving Dunk'] || 0, values['Vertical'] || 0),
    }),
  },
  {
    id: 'rise_up',
    name: 'Rise Up',
    description: 'Increases chance of standing dunk',
    icon: '⬆️',
    categories: ['Finishing', 'Physicals'],
    attributes: ['Standing Dunk', 'Vertical'],
    attributeLogic: 'and',
    minHeight: 78, // 6'6"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', standingDunk: 72, vertical: 60, check: (p) => p.standingDunk >= 72 && p.vertical >= 60 },
      { level: 2, label: 'Silver', color: '#C0C0C0', standingDunk: 81, vertical: 62, check: (p) => p.standingDunk >= 81 && p.vertical >= 62 },
      { level: 3, label: 'Gold', color: '#FFD700', standingDunk: 90, vertical: 66, check: (p) => p.standingDunk >= 90 && p.vertical >= 66 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', standingDunk: 95, vertical: 69, check: (p) => p.standingDunk >= 95 && p.vertical >= 69 },
      { level: 5, label: 'Legend', color: '#8B0000', standingDunk: 99, vertical: 71, check: (p) => p.standingDunk >= 99 && p.vertical >= 71 },
    ],
    getProgress: (values) => ({
      standingDunk: values['Standing Dunk'] || 0,
      vertical: values['Vertical'] || 0,
      displayValue: Math.min(values['Standing Dunk'] || 0, values['Vertical'] || 0),
    }),
  },
  {
    id: 'post_fade_phenom',
    name: 'Post Fade Phenom',
    description: 'Increases Green Window for Post Fades',
    icon: '🔄',
    categories: ['Finishing', 'Shooting'],
    attributes: ['Post Control', 'Mid Range Shot'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', postControl: 60, midRange: 61, check: (p) => p.postControl >= 60 && p.midRange >= 61 },
      { level: 2, label: 'Silver', color: '#C0C0C0', postControl: 70, midRange: 71, check: (p) => p.postControl >= 70 && p.midRange >= 71 },
      { level: 3, label: 'Gold', color: '#FFD700', postControl: 79, midRange: 80, check: (p) => p.postControl >= 79 && p.midRange >= 80 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', postControl: 84, midRange: 90, check: (p) => p.postControl >= 84 && p.midRange >= 90 },
      { level: 5, label: 'Legend', color: '#8B0000', postControl: 90, midRange: 94, check: (p) => p.postControl >= 90 && p.midRange >= 94 },
    ],
    getProgress: (values) => ({
      postControl: values['Post Control'] || 0,
      midRange: values['Mid Range Shot'] || 0,
      displayValue: Math.min(values['Post Control'] || 0, values['Mid Range Shot'] || 0),
    }),
  },
  {
    id: 'post_powerhouse',
    name: 'Post Powerhouse',
    description: 'Increases success when backing down defenders',
    icon: '💪',
    categories: ['Finishing', 'Physicals'],
    attributes: ['Post Control', 'Strength'],
    attributeLogic: 'and',
    minHeight: 76, // 6'4"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', postControl: 64, strength: 70, check: (p) => p.postControl >= 64 && p.strength >= 70 },
      { level: 2, label: 'Silver', color: '#C0C0C0', postControl: 75, strength: 79, check: (p) => p.postControl >= 75 && p.strength >= 79 },
      { level: 3, label: 'Gold', color: '#FFD700', postControl: 85, strength: 86, check: (p) => p.postControl >= 85 && p.strength >= 86 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', postControl: 93, strength: 95, check: (p) => p.postControl >= 93 && p.strength >= 95 },
      { level: 5, label: 'Legend', color: '#8B0000', postControl: 98, strength: 96, check: (p) => p.postControl >= 98 && p.strength >= 96 },
    ],
    getProgress: (values) => ({
      postControl: values['Post Control'] || 0,
      strength: values['Strength'] || 0,
      displayValue: Math.min(values['Post Control'] || 0, values['Strength'] || 0),
    }),
  },
  {
    id: 'post_up_poet',
    name: 'Post-Up Poet',
    description: 'Increases chance of defenders biting on post fakes',
    icon: '🎭',
    categories: ['Finishing'],
    attributes: ['Post Control'],
    attributeLogic: 'and',
    minHeight: 72, // 6'0"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 67, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 77, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 87, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 95, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Post Control'] || 0,
  },
  {
    id: 'handles_for_days',
    name: 'Handles For Days',
    description: 'Decreases Stamina Usage When Chaining Dribble Moves',
    icon: '🌀',
    categories: ['Playmaking'],
    attributes: ['Ball Handle'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 84, // 7'0"
    levels: [
      { level: 1, threshold: 71, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 81, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 90, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 94, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 97, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Ball Handle'] || 0,
  },
  {
    id: 'lightning_launch',
    name: 'Lightning Launch',
    description: 'Burst Out of Triple Threat or Standing Dribble',
    icon: '⚡️',
    categories: ['Playmaking'],
    attributes: ['Speed with Ball'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 83, // 6'11"
    levels: [
      { level: 1, threshold: 68, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 75, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 86, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 91, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 94, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Speed with Ball'] || 0,
  },
  {
    id: 'strong_handle',
    name: 'Strong Handle',
    description: 'Unbothered by On-Ball Defenders',
    icon: '🛡️',
    categories: ['Playmaking', 'Physicals'],
    attributes: ['Ball Handle', 'Strength'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4" (default cap)
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', ballHandle: 60, strength: 60, check: (p) => p.ballHandle >= 60 && p.strength >= 60 },
      { level: 2, label: 'Silver', color: '#C0C0C0', ballHandle: 67, strength: 65, check: (p) => p.ballHandle >= 67 && p.strength >= 65 },
      { level: 3, label: 'Gold', color: '#FFD700', ballHandle: 73, strength: 73, check: (p) => p.ballHandle >= 73 && p.strength >= 73 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', ballHandle: 77, strength: 84, check: (p) => p.ballHandle >= 77 && p.strength >= 84 },
      { level: 5, label: 'Legend', color: '#8B0000', ballHandle: 80, strength: 93, check: (p) => p.ballHandle >= 80 && p.strength >= 93 },
    ],
    getProgress: (values) => ({
      ballHandle: values['Ball Handle'] || 0,
      strength: values['Strength'] || 0,
    }),
  },
  {
    id: 'unpluckable',
    name: 'Unpluckable',
    description: 'Deny Steal Attempts',
    icon: '✋',
    categories: ['Playmaking', 'Finishing'],
    attributes: ['Ball Handle', 'Post Control'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      {
        level: 1,
        label: 'Bronze',
        color: '#8B4513',
        ballHandle: 70,
        postControl: 75,
        check: (p) => (p.ballHandle >= 70) || (p.postControl >= 75),
      },
      {
        level: 2,
        label: 'Silver',
        color: '#C0C0C0',
        ballHandle: 80,
        postControl: 86,
        check: (p) => (p.ballHandle >= 80) || (p.postControl >= 86),
      },
      {
        level: 3,
        label: 'Gold',
        color: '#FFD700',
        ballHandle: 92,
        postControl: 96,
        check: (p) => (p.ballHandle >= 92) || (p.postControl >= 96),
      },
      {
        level: 4,
        label: 'Hall of Fame',
        color: '#7B2FBE',
        ballHandle: 96,
        postControl: null,
        check: (p) => p.ballHandle >= 96,
      },
      {
        level: 5,
        label: 'Legend',
        color: '#8B0000',
        ballHandle: 99,
        postControl: null,
        check: (p) => p.ballHandle >= 99,
      },
    ],
    getProgress: (values) => ({
      ballHandle: values['Ball Handle'] || 0,
      postControl: values['Post Control'] || 0,
      displayValue: Math.max(values['Ball Handle'] || 0, values['Post Control'] || 0),
    }),
  },
  {
    id: 'challenger',
    name: 'Challenger',
    description: 'Increases contest on opponent jumpshots',
    icon: '🙅',
    categories: ['Defense'],
    attributes: ['Perimeter Defense'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 83, // 6'11"
    levels: [
      { level: 1, threshold: 71, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 82, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 92, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 95, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Perimeter Defense'] || 0,
  },
  {
    id: 'glove',
    name: 'Glove',
    description: 'Increased chance to steal from dribbling opponent',
    icon: '🧤',
    categories: ['Defense'],
    attributes: ['Steal'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 84, // 7'0"
    levels: [
      { level: 1, threshold: 67, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 79, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 91, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 96, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Steal'] || 0,
  },
  {
    id: 'high_flying_denier',
    name: 'High-Flying Denier',
    description: 'Increases chance to block a shot when sprinting',
    icon: '🚫',
    categories: ['Defense', 'Physicals'],
    attributes: ['Block', 'Vertical'],
    attributeLogic: 'and',
    minHeight: 75, // 6'3"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', block: 68, vertical: 60, check: (p) => p.block >= 68 && p.vertical >= 60 },
      { level: 2, label: 'Silver', color: '#C0C0C0', block: 78, vertical: 74, check: (p) => p.block >= 78 && p.vertical >= 74 },
      { level: 3, label: 'Gold', color: '#FFD700', block: 88, vertical: 80, check: (p) => p.block >= 88 && p.vertical >= 80 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', block: 92, vertical: 83, check: (p) => p.block >= 92 && p.vertical >= 83 },
      { level: 5, label: 'Legend', color: '#8B0000', block: 99, vertical: 85, check: (p) => p.block >= 99 && p.vertical >= 85 },
    ],
    getProgress: (values) => ({
      block: values['Block'] || 0,
      vertical: values['Vertical'] || 0,
    }),
  },
  {
    id: 'immovable_enforcer',
    name: 'Immovable Enforcer',
    description: 'Ability to stonewall opposing ball handlers',
    icon: '🧱',
    categories: ['Defense', 'Physicals'],
    attributes: ['Perimeter Defense', 'Strength'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', perimeterDefense: 62, strength: 71, check: (p) => p.perimeterDefense >= 62 && p.strength >= 71 },
      { level: 2, label: 'Silver', color: '#C0C0C0', perimeterDefense: 72, strength: 82, check: (p) => p.perimeterDefense >= 72 && p.strength >= 82 },
      { level: 3, label: 'Gold', color: '#FFD700', perimeterDefense: 84, strength: 85, check: (p) => p.perimeterDefense >= 84 && p.strength >= 85 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', perimeterDefense: 89, strength: 91, check: (p) => p.perimeterDefense >= 89 && p.strength >= 91 },
      { level: 5, label: 'Legend', color: '#8B0000', perimeterDefense: 94, strength: 92, check: (p) => p.perimeterDefense >= 94 && p.strength >= 92 },
    ],
    getProgress: (values) => ({
      perimeterDefense: values['Perimeter Defense'] || 0,
      strength: values['Strength'] || 0,
    }),
  },
  {
    id: 'interceptor',
    name: 'Interceptor',
    description: 'Increased chance at stealing passes',
    icon: '📬',
    categories: ['Defense'],
    attributes: ['Steal'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 60, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 73, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 85, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 94, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 98, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Steal'] || 0,
  },
  {
    id: 'off_ball_pest',
    name: 'Off-Ball Pest',
    description: 'Ability to bump opponents off-ball',
    icon: '👊',
    categories: ['Defense'],
    attributes: ['Interior Defense', 'Perimeter Defense'],
    attributeLogic: 'or',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      {
        level: 1,
        label: 'Bronze',
        color: '#8B4513',
        interiorDefense: 69,
        perimeterDefense: 58,
        check: (p) => (p.interiorDefense >= 69) || (p.perimeterDefense >= 58),
      },
      {
        level: 2,
        label: 'Silver',
        color: '#C0C0C0',
        interiorDefense: 76,
        perimeterDefense: 68,
        check: (p) => (p.interiorDefense >= 76) || (p.perimeterDefense >= 68),
      },
      {
        level: 3,
        label: 'Gold',
        color: '#FFD700',
        interiorDefense: 85,
        perimeterDefense: 80,
        check: (p) => (p.interiorDefense >= 85) || (p.perimeterDefense >= 80),
      },
      {
        level: 4,
        label: 'Hall of Fame',
        color: '#7B2FBE',
        interiorDefense: 94,
        perimeterDefense: 87,
        check: (p) => (p.interiorDefense >= 94) || (p.perimeterDefense >= 87),
      },
      {
        level: 5,
        label: 'Legend',
        color: '#8B0000',
        interiorDefense: 97,
        perimeterDefense: 98,
        check: (p) => (p.interiorDefense >= 97) || (p.perimeterDefense >= 98),
      },
    ],
    getProgress: (values) => ({
      interiorDefense: values['Interior Defense'] || 0,
      perimeterDefense: values['Perimeter Defense'] || 0,
      displayValue: Math.max(values['Interior Defense'] || 0, values['Perimeter Defense'] || 0),
    }),
  },
  {
    id: 'on_ball_menace',
    name: 'On-Ball Menace',
    description: 'Prevent broken ankles and lock up ball handler',
    icon: '🔒',
    categories: ['Defense', 'Physicals'],
    attributes: ['Perimeter Defense', 'Agility'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 81, // 6'9"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', perimeterDefense: 74, agility: 70, check: (p) => p.perimeterDefense >= 74 && p.agility >= 70 },
      { level: 2, label: 'Silver', color: '#C0C0C0', perimeterDefense: 85, agility: 76, check: (p) => p.perimeterDefense >= 85 && p.agility >= 76 },
      { level: 3, label: 'Gold', color: '#FFD700', perimeterDefense: 91, agility: 80, check: (p) => p.perimeterDefense >= 91 && p.agility >= 80 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', perimeterDefense: 96, agility: 84, check: (p) => p.perimeterDefense >= 96 && p.agility >= 84 },
      { level: 5, label: 'Legend', color: '#8B0000', perimeterDefense: 99, agility: 86, check: (p) => p.perimeterDefense >= 99 && p.agility >= 86 },
    ],
    getProgress: (values) => ({
      perimeterDefense: values['Perimeter Defense'] || 0,
      agility: values['Agility'] || 0,
    }),
  },
  {
    id: 'paint_patroller',
    name: 'Paint Patroller',
    description: 'Contest shots at the rim',
    icon: '🛡️',
    categories: ['Defense'],
    attributes: ['Interior Defense', 'Block'],
    attributeLogic: 'and',
    minHeight: 78, // 6'6"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', interiorDefense: 60, block: 74, check: (p) => p.interiorDefense >= 60 && p.block >= 74 },
      { level: 2, label: 'Silver', color: '#C0C0C0', interiorDefense: 70, block: 84, check: (p) => p.interiorDefense >= 70 && p.block >= 84 },
      { level: 3, label: 'Gold', color: '#FFD700', interiorDefense: 77, block: 93, check: (p) => p.interiorDefense >= 77 && p.block >= 93 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', interiorDefense: 84, block: 97, check: (p) => p.interiorDefense >= 84 && p.block >= 97 },
      { level: 5, label: 'Legend', color: '#8B0000', interiorDefense: 86, block: 99, check: (p) => p.interiorDefense >= 86 && p.block >= 99 },
    ],
    getProgress: (values) => ({
      interiorDefense: values['Interior Defense'] || 0,
      block: values['Block'] || 0,
    }),
  },
  {
    id: 'pick_dodger',
    name: 'Pick Dodger',
    description: 'Ability to avoid screens',
    icon: '🏃‍♂️',
    categories: ['Defense', 'Physicals'],
    attributes: ['Perimeter Defense', 'Agility'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 82, // 6'10"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', perimeterDefense: 73, agility: 71, check: (p) => p.perimeterDefense >= 73 && p.agility >= 71 },
      { level: 2, label: 'Silver', color: '#C0C0C0', perimeterDefense: 83, agility: 75, check: (p) => p.perimeterDefense >= 83 && p.agility >= 75 },
      { level: 3, label: 'Gold', color: '#FFD700', perimeterDefense: 90, agility: 79, check: (p) => p.perimeterDefense >= 90 && p.agility >= 79 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', perimeterDefense: 97, agility: 85, check: (p) => p.perimeterDefense >= 97 && p.agility >= 85 },
      { level: 5, label: 'Legend', color: '#8B0000', perimeterDefense: 99, agility: 92, check: (p) => p.perimeterDefense >= 99 && p.agility >= 92 },
    ],
    getProgress: (values) => ({
      perimeterDefense: values['Perimeter Defense'] || 0,
      agility: values['Agility'] || 0,
    }),
  },
  {
    id: 'post_lockdown',
    name: 'Post Lockdown',
    description: 'Ability to defend and strip post moves',
    icon: '🔐',
    categories: ['Defense', 'Physicals'],
    attributes: ['Interior Defense', 'Strength'],
    attributeLogic: 'and',
    minHeight: 77, // 6'5"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', interiorDefense: 74, strength: 70, check: (p) => p.interiorDefense >= 74 && p.strength >= 70 },
      { level: 2, label: 'Silver', color: '#C0C0C0', interiorDefense: 82, strength: 78, check: (p) => p.interiorDefense >= 82 && p.strength >= 78 },
      { level: 3, label: 'Gold', color: '#FFD700', interiorDefense: 88, strength: 84, check: (p) => p.interiorDefense >= 88 && p.strength >= 84 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', interiorDefense: 93, strength: 92, check: (p) => p.interiorDefense >= 93 && p.strength >= 92 },
      { level: 5, label: 'Legend', color: '#8B0000', interiorDefense: 99, strength: 97, check: (p) => p.interiorDefense >= 99 && p.strength >= 97 },
    ],
    getProgress: (values) => ({
      interiorDefense: values['Interior Defense'] || 0,
      strength: values['Strength'] || 0,
    }),
  },
  {
    id: 'boxout_beast',
    name: 'Boxout Beast',
    description: 'Ability to fight for position when rebounding',
    icon: '📦',
    categories: ['Rebounding'],
    attributes: ['Offensive Rebound', 'Defensive Rebound'],
    attributeLogic: 'or',
    minHeight: 75, // 6'3"
    maxHeight: 88, // 7'4"
    levels: [
      {
        level: 1,
        label: 'Bronze',
        color: '#8B4513',
        offensiveRebound: 55,
        defensiveRebound: 55,
        check: (p) => (p.offensiveRebound >= 55) || (p.defensiveRebound >= 55),
      },
      {
        level: 2,
        label: 'Silver',
        color: '#C0C0C0',
        offensiveRebound: 70,
        defensiveRebound: 70,
        check: (p) => (p.offensiveRebound >= 70) || (p.defensiveRebound >= 70),
      },
      {
        level: 3,
        label: 'Gold',
        color: '#FFD700',
        offensiveRebound: 85,
        defensiveRebound: 85,
        check: (p) => (p.offensiveRebound >= 85) || (p.defensiveRebound >= 85),
      },
      {
        level: 4,
        label: 'Hall of Fame',
        color: '#7B2FBE',
        offensiveRebound: 94,
        defensiveRebound: 94,
        check: (p) => (p.offensiveRebound >= 94) || (p.defensiveRebound >= 94),
      },
      {
        level: 5,
        label: 'Legend',
        color: '#8B0000',
        offensiveRebound: 98,
        defensiveRebound: 98,
        check: (p) => (p.offensiveRebound >= 98) || (p.defensiveRebound >= 98),
      },
    ],
    getProgress: (values) => ({
      offensiveRebound: values['Offensive Rebound'] || 0,
      defensiveRebound: values['Defensive Rebound'] || 0,
      displayValue: Math.max(values['Offensive Rebound'] || 0, values['Defensive Rebound'] || 0),
    }),
  },
  {
    id: 'rebound_chaser',
    name: 'Rebound Chaser',
    description: 'Ability to get boards',
    icon: '🏀',
    categories: ['Rebounding'],
    attributes: ['Offensive Rebound', 'Defensive Rebound'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', offensiveRebound: 60, defensiveRebound: 60, check: (p) => p.offensiveRebound >= 60 && p.defensiveRebound >= 60 },
      { level: 2, label: 'Silver', color: '#C0C0C0', offensiveRebound: 80, defensiveRebound: 80, check: (p) => p.offensiveRebound >= 80 && p.defensiveRebound >= 80 },
      { level: 3, label: 'Gold', color: '#FFD700', offensiveRebound: 92, defensiveRebound: 92, check: (p) => p.offensiveRebound >= 92 && p.defensiveRebound >= 92 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', offensiveRebound: 96, defensiveRebound: 96, check: (p) => p.offensiveRebound >= 96 && p.defensiveRebound >= 96 },
      { level: 5, label: 'Legend', color: '#8B0000', offensiveRebound: 99, defensiveRebound: 99, check: (p) => p.offensiveRebound >= 99 && p.defensiveRebound >= 99 },
    ],
    getProgress: (values) => ({
      offensiveRebound: values['Offensive Rebound'] || 0,
      defensiveRebound: values['Defensive Rebound'] || 0,
    }),
  },
  {
    id: 'brick_wall',
    name: 'Brick Wall',
    description: 'Set crazy tough screens',
    icon: '🧱',
    categories: ['Physicals'],
    attributes: ['Strength'],
    attributeLogic: 'and',
    minHeight: 77, // 6'5"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 72, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 83, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 91, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 95, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 99, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Strength'] || 0,
  },
  {
    id: 'slippery_off_ball',
    name: 'Slippery Off-Ball',
    description: 'Ability to get past defenders when cutting',
    icon: '💨',
    categories: ['Physicals'],
    attributes: ['Speed', 'Agility'],
    attributeLogic: 'and',
    minHeight: 69, // 5'9"
    maxHeight: 81, // 6'9"
    levels: [
      { level: 1, label: 'Bronze', color: '#8B4513', speed: 57, agility: 57, check: (p) => p.speed >= 57 && p.agility >= 57 },
      { level: 2, label: 'Silver', color: '#C0C0C0', speed: 73, agility: 65, check: (p) => p.speed >= 73 && p.agility >= 65 },
      { level: 3, label: 'Gold', color: '#FFD700', speed: 85, agility: 77, check: (p) => p.speed >= 85 && p.agility >= 77 },
      { level: 4, label: 'Hall of Fame', color: '#7B2FBE', speed: 92, agility: 88, check: (p) => p.speed >= 92 && p.agility >= 88 },
      { level: 5, label: 'Legend', color: '#8B0000', speed: 99, agility: 96, check: (p) => p.speed >= 99 && p.agility >= 96 },
    ],
    getProgress: (values) => ({
      speed: values['Speed'] || 0,
      agility: values['Agility'] || 0,
    }),
  },
  {
    id: 'pogo_stick',
    name: 'Pogo Stick',
    description: 'Decreased time between jump attempts',
    icon: '⬆️',
    categories: ['Physicals'],
    attributes: ['Vertical'],
    attributeLogic: 'and',
    minHeight: 76, // 6'4"
    maxHeight: 88, // 7'4"
    levels: [
      { level: 1, threshold: 63, label: 'Bronze', color: '#8B4513' },
      { level: 2, threshold: 70, label: 'Silver', color: '#C0C0C0' },
      { level: 3, threshold: 77, label: 'Gold', color: '#FFD700' },
      { level: 4, threshold: 83, label: 'Hall of Fame', color: '#7B2FBE' },
      { level: 5, threshold: 88, label: 'Legend', color: '#8B0000' },
    ],
    getProgress: (values) => values['Vertical'] || 0,
  },
];

/**
 * Get current badge status for all badges
 * Returns array of badge status objects with unlock level info
 */
export function evaluateBadges(values, heightInches = null) {
  return BADGES.map((badge) => {
    // Check if height is within badge requirements
    const isHeightEligible = heightInches === null || (heightInches >= badge.minHeight && heightInches <= badge.maxHeight);
    
    const progress = badge.getProgress(values);
    const numericProgress = typeof progress === 'number'
      ? progress
      : (progress && typeof progress === 'object'
        ? (typeof progress.displayValue === 'number'
          ? progress.displayValue
          : (Object.values(progress).length > 0 ? Math.min(...Object.values(progress)) : 0))
        : 0);
    let unlockedLevel = null;

    // Find highest unlocked level (only if height is eligible)
    if (isHeightEligible) {
      for (const levelData of badge.levels) {
        const meetsThreshold = typeof levelData.check === 'function'
          ? levelData.check(progress)
          : progress >= levelData.threshold;
        if (meetsThreshold) { unlockedLevel = levelData; }
      }
    }

    return {
      badge, // Include reference to original badge definition
      id: badge.id,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      categories: badge.categories,
      attributes: badge.attributes,
      attributeLogic: badge.attributeLogic,
      progress,
      displayProgress: numericProgress,
      unlockedLevel,
      levels: badge.levels,
      minHeight: badge.minHeight,
      maxHeight: badge.maxHeight,
      isHeightEligible,
    };
  });
}
