import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

const formatHeight = (inches) => `${Math.floor(inches / 12)}'${inches % 12}"`;

// Get required attributes for a badge
const getRequiredAttributes = (badge) => {
  // Use the new attributes and attributeLogic fields from badge definition
  const attributes = badge.attributes || [];
  const operator = attributes.length <= 1 ? '' : (badge.attributeLogic || 'and');
  
  return { attributes, operator };
};

// Metallic gradient colors for each badge level
const getMetallicGradient = (color) => {
  const colorMap = {
    '#8B4513': ['#D4915E', '#8B4513', '#5A2D0C'], // Bronze
    '#C0C0C0': ['#F5F5F5', '#C0C0C0', '#A8A8A8'], // Silver
    '#FFD700': ['#FFE55C', '#FFD700', '#CCAC00'], // Gold
    '#7B2FBE': ['#9B59D0', '#7B2FBE', '#5A1F8C'], // Purple (Hall of Fame)
    '#8B0000': ['#B22222', '#8B0000', '#5C0000'], // Dark Red (Legend)
  };
  return colorMap[color] || [color, color, color];
};
export default function BadgesModal({ visible, badges, activeCategory, onClose }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // Filter badges to only show those from the active category
  const filteredBadges = badges.filter(badge => 
    badge.categories && badge.categories.includes(activeCategory)
  );



  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Badges - {activeCategory}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Badge List */}
        <ScrollView style={styles.badgeList}>
          {filteredBadges.map((badge) => {
            const notEligible = !badge.isHeightEligible;
            const progressValue = badge.displayProgress ?? badge.progress ?? 0;
            const maxThreshold = badge.levels.reduce((max, level) => {
              const base = level.threshold ?? Math.max(
                level.ballHandle || 0,
                level.strength || 0,
                level.speedWithBall || 0,
                level.passAccuracy || 0,
                level.midRange || 0,
                level.threePoint || 0,
                level.postControl || 0,
                level.drivingDunk || 0,
                level.standingDunk || 0,
                level.closeShot || 0,
                level.drivingLayup || 0,
              0);
              return Math.max(max, base);
            }, 0);
            return (
              <View
                key={badge.id}
                style={[styles.badgeCard, notEligible && styles.badgeCardLocked]}
              >
                {/* Badge Icon and Title */}
                <View style={styles.badgeHeader}>
                  <Text style={[styles.badgeIcon, notEligible && styles.badgeIconLocked]}>
                    {badge.icon}
                  </Text>
                  <View style={styles.badgeTitleContainer}>
                    <Text style={[styles.badgeName, notEligible && styles.badgeNameLocked]}>
                      {badge.name}
                    </Text>
                    <Text style={[styles.badgeDescription, notEligible && styles.badgeDescriptionLocked]}>
                      {badge.description}
                    </Text>
                  </View>
                </View>

                {/* Requirements Row */}
                <View style={styles.requirementsRow}>
                  {/* Left: Attributes */}
                  <View style={styles.attributesContainer}>
                    {(() => {
                      const { attributes, operator } = getRequiredAttributes(badge);
                      if (attributes.length === 0) return null;
                      
                      return (
                        <Text style={[styles.requirementsText, notEligible && styles.heightTextLocked]}>
                          {attributes.join(` ${operator} `)}
                        </Text>
                      );
                    })()}
                  </View>
                  
                  {/* Right: Height */}
                  <View style={styles.heightContainer}>
                    <Text
                      style={[
                        styles.heightText,
                        notEligible && styles.heightTextLocked,
                      ]}
                    >
                      {formatHeight(badge.minHeight)} - {formatHeight(badge.maxHeight)}
                    </Text>
                  </View>
                </View>
                
                {notEligible && (
                  <Text style={styles.heightWarning}>⚠ Outside eligible height range</Text>
                )}

                {notEligible ? (
                  <View style={styles.lockedOverlay}>
                    <MaterialCommunityIcons name="lock" size={32} color="#999" />
                    <Text style={styles.lockedText}>Badge locked for your height</Text>
                  </View>
                ) : (
                  <>
                    {/* Level Badges */}
                    <View style={styles.levelsContainer}>
                      {badge.levels.map((level) => {
                        const isUnlocked =
                          badge.unlockedLevel &&
                          badge.unlockedLevel.level >= level.level;
                        const gradientColors = getMetallicGradient(level.color);
                        
                        // Get all required skills for this level
                        const requiredSkills = [];
                        if (level.threshold !== undefined) {
                          requiredSkills.push(level.threshold);
                        } else {
                          // Check for individual skill requirements
                          const skillKeys = Object.keys(level).filter(
                            key => !['level', 'label', 'color', 'check'].includes(key)
                          );
                          skillKeys.forEach(key => {
                            if (typeof level[key] === 'number') {
                              requiredSkills.push(level[key]);
                            }
                          });
                        }
                        
                        return (
                          <LinearGradient
                            key={level.level}
                            colors={gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={[
                              styles.levelBadge,
                              !isUnlocked && styles.levelBadgeLocked,
                            ]}
                          >
                            {requiredSkills.map((skill, index) => (
                              <Text
                                key={index}
                                style={[
                                  styles.levelThreshold,
                                  requiredSkills.length > 1 && styles.multiSkillText,
                                  !isUnlocked && styles.levelThresholdLocked,
                                ]}
                              >
                                {skill}
                              </Text>
                            ))}
                          </LinearGradient>
                        );
                      })}
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
  },
  badgeList: {
    flex: 1,
    padding: 12,
  },
  badgeCard: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.cardBorder,
  },
  badgeCardLocked: {
    opacity: 0.6,
    backgroundColor: theme.backgroundSecondary,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  badgeIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeTitleContainer: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  badgeNameLocked: {
    color: theme.textTertiary,
  },
  badgeDescription: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  badgeDescriptionLocked: {
    color: theme.textTertiary,
  },
  requirementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  attributesContainer: {
    flex: 1,
    marginRight: 12,
  },
  requirementsText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  heightContainer: {
    alignItems: 'flex-end',
  },
  heightRequirement: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  heightText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  heightTextLocked: {
    color: theme.textTertiary,
  },
  heightWarning: {
    fontSize: 11,
    color: '#ff453a',
    fontWeight: '600',
  },
  lockedOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  lockedText: {
    fontSize: 13,
    color: theme.textTertiary,
    marginTop: 8,
    fontWeight: '500',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelBadge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 0,
  },
  levelBadgeLocked: {
    opacity: 0.33,
  },
  levelNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  levelNumberUnlocked: {
    color: '#fff',
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  levelLabelUnlocked: {
    color: '#fff',
  },
  levelThreshold: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  levelThresholdLocked: {
    opacity: 1.8,
    fontWeight: '900',
  },
  multiSkillText: {
    fontSize: 13,
  },
  levelThresholdUnlocked: {
    color: '#fff',
  },
});
