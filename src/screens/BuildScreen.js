import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import NumberStepper from '../components/NumberStepper';
import BadgesModal from '../components/BadgesModal';
import { getWeight, hasBaseWeight, getValidSliderBounds } from '../utils/getWeight';
import { WEIGHT_CAP } from '../config';
import { SKILL_GROUPS, getSkillGroup } from '../data/skillGroups';
import { checkPrimaryConstraints, checkDependentConstraints, resolveAllConstraints } from '../data/attributeConstraints';
import { saveBuild, updateBuild } from '../utils/buildStorage';
import { evaluateBadges } from '../data/badges';
import { useTheme } from '../contexts/ThemeContext';

const SKILLS = [
  'Close Shot',
  'Driving Layup',
  'Driving Dunk',
  'Standing Dunk',
  'Post Control',
  'Mid Range Shot',
  'Three Point Shot',
  'Free Throw',
  'Pass Accuracy',
  'Ball Handle',
  'Speed with Ball',
  'Interior Defense',
  'Perimeter Defense',
  'Steal',
  'Block',
  'Offensive Rebound',
  'Defensive Rebound',
  'Speed',
  'Agility',
  'Strength',
  'Vertical',
];

export default function HomeScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [heightInches, setHeightInches] = useState(80); // default 6'8"
  // Wingspan depends on height: min = height, max = height + 6, default = height + 4
  const [wingspan, setWingspan] = useState(84);
  const [weight, setWeight] = useState(210);

  // Default each slider to 25
  const [values, setValues] = useState(Object.fromEntries(SKILLS.map((s) => [s, 25])));

  const [capError, setCapError] = useState(null);
  const capTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const holdSkillRef = useRef(null);
  const holdDirectionRef = useRef(null);

  // Save state
  const [currentBuildId, setCurrentBuildId] = useState(null);
  const [buildName, setBuildName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  // Badge state
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const badgesList = useMemo(() => evaluateBadges(values, heightInches), [values, heightInches]);
  const [activeCategory, setActiveCategory] = useState('Finishing');
  const categoryPositionsRef = useRef({});
  const scrollViewRef = useRef(null);
  const activeCategoryColor = SKILL_GROUPS[activeCategory]?.color || '#007AFF';

  // Handle navigation params for loading builds
  useEffect(() => {
    if (route.params?.loadBuild) {
      const build = route.params.loadBuild;
      setHeightInches(build.heightInches);
      setWingspan(build.wingspan);
      setWeight(build.weight);
      setValues(build.values);
      setCurrentBuildId(build.id);
      setBuildName(build.name);
      // Clear the param
      navigation.setParams({ loadBuild: undefined });
    } else if (route.params?.newBuild) {
      // Reset to defaults
      setHeightInches(80);
      setWingspan(84);
      setWeight(210);
      setValues(Object.fromEntries(SKILLS.map((s) => [s, 25])));
      setCurrentBuildId(null);
      setBuildName('');
      // Clear the param
      navigation.setParams({ newBuild: undefined });
    }
  }, [route.params, navigation]);


  const clearCapError = useCallback(() => {
    if (capTimeoutRef.current) {
      clearTimeout(capTimeoutRef.current);
      capTimeoutRef.current = null;
    }
    setCapError(null);
  }, []);

  useEffect(() => {
    return () => {
      clearCapError();
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
      if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    };
  }, [clearCapError]);

  const totalWeight = useMemo(() => {
    return SKILLS.reduce((sum, skill) => sum + (getWeight(heightInches, skill, values[skill]) || 0), 0);
  }, [heightInches, values]);

  const showCapError = useCallback((msg) => {
    clearCapError();
    setCapError(msg);
    capTimeoutRef.current = setTimeout(() => setCapError(null), 2500);
  }, [clearCapError]);

  const setValue = (key, v) => {
    setValues((prev) => ({ ...prev, [key]: Math.round(v) }));
  };

  const handleSliderChange = useCallback((skill, rawVal) => {
    const rawNew = Math.round(rawVal);
    const oldVal = values[skill];
    if (rawNew === oldVal) return;

    // If the selected raw value has no base weight, find the nearest valid value and prefer
    // the direction the user is moving in (up or down). If no valid value exists, abort.
    const preferHigher = rawNew > oldVal;
    let newVal = rawNew;
    if (!hasBaseWeight(heightInches, skill, newVal)) {
      let found = null;
      const LOW = 25, HIGH = 99;
      for (let r = 0; r <= HIGH - LOW; r++) {
        const candidates = preferHigher ? [newVal + r, newVal - r] : [newVal - r, newVal + r];
        for (const c of candidates) {
          if (c < LOW || c > HIGH) continue;
          if (hasBaseWeight(heightInches, skill, c)) {
            found = c;
            break;
          }
        }
        if (found != null) break;
      }
      if (found == null) {
        showCapError('No valid value available for this skill');
        return;
      }
      // If nearest valid is the same as old value, do nothing
      if (found === oldVal) return;
      newVal = found;
    }

    if (newVal === oldVal) return;

    // Resolve all cascading constraints
    const constraintResult = resolveAllConstraints(skill, newVal, values, heightInches);
    const updates = constraintResult.updates;

    // Prevent any forward movement if cap is already reached
    if (newVal > oldVal && totalWeight >= WEIGHT_CAP) {
      showCapError('Cap reached — cannot increase any slider');
      return;
    }

    // Calculate total weight change for all updates
    let totalWeightChange = 0;
    for (const [updateSkill, updateVal] of Object.entries(updates)) {
      const oldSkillVal = values[updateSkill];
      const prevWeight = getWeight(heightInches, updateSkill, oldSkillVal) || 0;
      const candidateWeight = getWeight(heightInches, updateSkill, updateVal) || 0;
      totalWeightChange += (candidateWeight - prevWeight);
    }

    const newTotal = totalWeight + totalWeightChange;

    if (newTotal <= WEIGHT_CAP) {
      setValues((prev) => ({ ...prev, ...updates }));
      return;
    }

    // If increasing, try to clamp down to the highest allowed value between oldVal and newVal
    if (newVal > oldVal) {
      for (let v = newVal; v > oldVal; v--) {
        if (!hasBaseWeight(heightInches, skill, v)) continue;
        
        // Resolve all cascading constraints for this clamped value
        const clampedResult = resolveAllConstraints(skill, v, values, heightInches);
        const clampedUpdates = clampedResult.updates;
        
        // Calculate weight for clamped updates
        let clampedWeightChange = 0;
        for (const [updateSkill, updateVal] of Object.entries(clampedUpdates)) {
          const oldSkillVal = values[updateSkill];
          const prevWeight = getWeight(heightInches, updateSkill, oldSkillVal) || 0;
          const candidateWeight = getWeight(heightInches, updateSkill, updateVal) || 0;
          clampedWeightChange += (candidateWeight - prevWeight);
        }
        
        if (totalWeight + clampedWeightChange <= WEIGHT_CAP) {
          setValues((prev) => ({ ...prev, ...clampedUpdates }));
          return;
        }
      }
      // no allowed increase
      showCapError('Cap reached — cannot increase this slider');
      return;
    }

    // If decreasing, always allow
    setValues((prev) => ({ ...prev, ...updates }));
  }, [heightInches, totalWeight, values, showCapError]);

  const handleHeightChange = useCallback((newHeight) => {
    // For each skill, ensure the current slider value is valid for the new height. If not, pick the nearest valid value.
    const LOW = 25, HIGH = 99;

    const adjustedValues = { ...values };
    for (const skill of SKILLS) {
      const cur = adjustedValues[skill];
      if (!hasBaseWeight(newHeight, skill, cur)) {
        // find nearest valid
        let found = null;
        for (let r = 0; r <= HIGH - LOW; r++) {
          const candA = cur - r;
          const candB = cur + r;
          if (candA >= LOW && hasBaseWeight(newHeight, skill, candA)) { found = candA; break; }
          if (candB <= HIGH && hasBaseWeight(newHeight, skill, candB)) { found = candB; break; }
        }
        if (found == null) {
          showCapError(`No valid slider values for ${skill} at new height`);
          return;
        }
        adjustedValues[skill] = found;
      }
    }

    // compute total if height changed (using adjusted values)
    const newTotal = SKILLS.reduce((sum, skill) => sum + (getWeight(newHeight, skill, adjustedValues[skill]) || 0), 0);
    if (newTotal <= WEIGHT_CAP) {
      // clamp wingspan into the new valid range [newHeight, newHeight+6]
      const minW = newHeight;
      const maxW = newHeight + 6;
      setHeightInches(newHeight);
      setValues(adjustedValues);
      setWingspan((prev) => Math.min(Math.max(prev, minW), maxW));
    } else {
      showCapError('Changing height would exceed cap — lower sliders first');
    }
  }, [values, showCapError, wingspan]);

  const formatHeight = (inches) => `${Math.floor(inches / 12)}'${inches % 12}`;

  const startHold = useCallback((skill, direction) => {
    // direction: 1 for increment, -1 for decrement
    holdSkillRef.current = skill;
    holdDirectionRef.current = direction;

    // Immediately trigger one increment on press
    const currentVal = values[skill] || 25;
    const newVal = currentVal + direction;
    handleSliderChange(skill, newVal);

    // Initial delay before rapid increment starts
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        // Read the latest skill value directly from current ref
        setValues((prev) => {
          const latestVal = prev[skill] || 25;
          const nextVal = latestVal + direction;
          // Schedule the handler to run after state update
          setTimeout(() => handleSliderChange(skill, nextVal), 0);
          return { ...prev, [skill]: nextVal };
        });
      }, 40); // repeat every 40ms for rapid increment
    }, 150); // 150ms before starting
  }, [values, handleSliderChange]);

  const endHold = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    holdSkillRef.current = null;
    holdDirectionRef.current = null;
  }, []);

  const handleSaveNew = useCallback(async () => {
    if (!buildName.trim()) {
      Alert.alert('Error', 'Please enter a build name');
      return;
    }

    try {
      const buildData = {
        heightInches,
        wingspan,
        weight,
        values,
      };

      const newId = await saveBuild(buildName, buildData);
      setCurrentBuildId(newId);

      Alert.alert('Success', 'Build saved!', [
        { text: 'OK', onPress: () => navigation.navigate('SavedBuilds') }
      ]);

      setShowSaveInput(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save build');
    }
  }, [buildName, heightInches, wingspan, weight, values, navigation]);

  const handleUpdateSave = useCallback(async () => {
    if (!currentBuildId) {
      Alert.alert('Error', 'No build to update');
      return;
    }
    if (!buildName.trim()) {
      Alert.alert('Error', 'Please enter a build name');
      return;
    }

    try {
      const buildData = {
        heightInches,
        wingspan,
        weight,
        values,
      };

      await updateBuild(currentBuildId, buildName, buildData);
      Alert.alert('Success', 'Build updated!', [
        { text: 'OK', onPress: () => navigation.navigate('SavedBuilds') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update build');
    }
  }, [currentBuildId, buildName, heightInches, wingspan, weight, values, navigation]);

  const handleResetAttributes = useCallback(() => {
    Alert.alert(
      'Reset Attributes',
      'Reset all attributes to 25? Height, wingspan, and weight will stay the same.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => setValues(Object.fromEntries(SKILLS.map((s) => [s, 25]))),
        },
      ],
    );
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={handleResetAttributes} style={{ paddingHorizontal: 8 }}>
          <Text style={{ color: '#0a84ff', fontWeight: '600' }}>Reset</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleResetAttributes]);

  const handleScroll = useCallback((event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const viewportHeight = event.nativeEvent.layoutMeasurement.height;
    const middleY = scrollY + viewportHeight / 2;

    // Find which category the middle of the screen is in
    let currentCategory = 'Finishing';
    let minDistance = Infinity;

    Object.entries(categoryPositionsRef.current).forEach(([category, position]) => {
      const categoryMiddle = position.y + position.height / 2;
      const distance = Math.abs(middleY - categoryMiddle);
      if (distance < minDistance) {
        minDistance = distance;
        currentCategory = category;
      }
    });

    if (currentCategory !== activeCategory) {
      setActiveCategory(currentCategory);
    }
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.inputsRow}>
          <NumberStepper
            label="Height"
            value={heightInches}
            onChange={handleHeightChange}
            min={69}
            max={88}
            step={1}
            formatValue={(v) => `${Math.floor(v / 12)}'${v % 12}`}
            style={{ flex: 1, marginRight: 4, alignSelf: 'flex-start' }}
          />

          <NumberStepper
            label="Wingspan"
            value={wingspan}
            onChange={setWingspan}
            min={heightInches}
            max={heightInches + 6}
            step={1}
            formatValue={(v) => `${Math.floor(v / 12)}'${v % 12}`}
            style={{ flex: 1, marginHorizontal: 2, alignSelf: 'flex-start' }}
          />

          <NumberStepper
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={120}
            max={360}
            step={1}
            formatValue={(v) => `${v}`}
            style={{ flex: 1, marginLeft: 4, alignSelf: 'flex-start' }}
          />
        </View>

        <View style={styles.totalsRow}>
          <Text style={styles.totalText}>Total weight: {totalWeight.toFixed(2)}</Text>
          <Text style={styles.capText}>Cap: {WEIGHT_CAP.toLocaleString()}</Text>
        </View>
        {capError ? <Text style={styles.capError}>{capError}</Text> : null}

        {Object.entries(SKILL_GROUPS).map(([groupName, groupData]) => (
          <View 
            key={groupName}
            onLayout={(event) => {
              const { y, height } = event.nativeEvent.layout;
              categoryPositionsRef.current[groupName] = { y, height };
            }}
          >
            <Text style={[styles.groupHeader, { color: groupData.color }]}>{groupName}</Text>
            {groupData.skills.map((skill) => {
              const bounds = getValidSliderBounds(heightInches, skill);
              const current = values[skill];
              const displayValue = bounds ? Math.min(Math.max(current, bounds.min), bounds.max) : current;

              // compute whether moving exactly one step (+1) would push us over the cap
              let nextValidFromOneStep = null;
              const ONE_STEP = displayValue + 1;
              const LOW = 25, HIGH = 99;
              if (bounds && ONE_STEP <= bounds.max) {
                let rawNew = ONE_STEP;
                if (hasBaseWeight(heightInches, skill, rawNew)) {
                  nextValidFromOneStep = rawNew;
                } else {
                  for (let r = 0; r <= HIGH - LOW; r++) {
                    const candidates = [rawNew + r, rawNew - r];
                    let found = null;
                    for (const c of candidates) {
                      if (c < LOW || c > HIGH) continue;
                      if (hasBaseWeight(heightInches, skill, c)) { found = c; break; }
                    }
                    if (found != null) { nextValidFromOneStep = found; break; }
                  }
                }
                if (nextValidFromOneStep != null && nextValidFromOneStep <= displayValue) {
                  nextValidFromOneStep = null;
                }
              }

              const currentWeight = getWeight(heightInches, skill, displayValue) || 0;
              const nextWeight = nextValidFromOneStep ? (getWeight(heightInches, skill, nextValidFromOneStep) || 0) : null;
              const wouldExceedOnNext = nextValidFromOneStep ? (totalWeight - currentWeight + nextWeight > WEIGHT_CAP) : false;

              const disabledForCap = totalWeight >= WEIGHT_CAP || wouldExceedOnNext;
              const disabled = !bounds || disabledForCap;

              // Can decrement if displayValue > bounds.min
              const canDecrement = bounds && displayValue > bounds.min;
              // Can increment if not disabled and displayValue < bounds.max
              const canIncrement = !disabled && bounds && displayValue < bounds.max;

              // Bar always spans 25 to 99 (range = 74)
              const fullRange = 99 - 25;
              const fillPercent = ((displayValue - 25) / fullRange) * 100;

              // Get group color for this skill
              const skillGroup = getSkillGroup(skill);
              const groupColor = skillGroup ? skillGroup.color : '#0a84ff';

              return (
                <View key={skill} style={[styles.skillBlock, disabled ? styles.skillDisabled : null]}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.label, disabled ? styles.labelDisabled : null]}>{skill}</Text>
                    <View style={styles.valueColumn}>
                      <Text style={[styles.value, disabled ? styles.labelDisabled : null]}>{displayValue}</Text>
                      <Text style={styles.subValue}>{(() => {
                        const w = getWeight(heightInches, skill, displayValue);
                        return w == null ? '-' : w.toFixed(2);
                      })()}</Text>
                    </View>
                  </View>

                  {/* Progress bar container with +/- buttons */}
                  <View style={styles.barContainer}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: groupColor }, !canDecrement && styles.buttonDisabled]}
                      onPressIn={() => startHold(skill, -1)}
                      onPressOut={endHold}
                      disabled={!canDecrement}
                    >
                      <Text style={styles.buttonText}>−</Text>
                    </TouchableOpacity>

                    <View style={styles.barWrapper}>
                      <View style={styles.barBackground}>
                        <View style={[styles.barFill, { backgroundColor: groupColor, width: `${fillPercent}%` }]} />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: groupColor }, !canIncrement && styles.buttonDisabled]}
                      onPressIn={() => startHold(skill, 1)}
                      onPressOut={endHold}
                      disabled={!canIncrement}
                    >
                      <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        {/* Save Section */}
        <View style={styles.saveSection}>
          {showSaveInput ? (
            <View style={styles.saveInputContainer}>
              <TextInput
                style={styles.saveInput}
                placeholder="Enter build name..."
                value={buildName}
                onChangeText={setBuildName}
                autoFocus
              />
              <View style={styles.saveButtonsRow}>
                <TouchableOpacity
                  style={[styles.saveButton, styles.saveCancelButton]}
                  onPress={() => setShowSaveInput(false)}
                >
                  <Text style={styles.saveButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, styles.saveConfirmButton]}
                  onPress={handleSaveNew}
                >
                  <Text style={styles.saveButtonText}>Save New</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : currentBuildId ? (
            <View style={styles.saveButtonsRow}>
              <TouchableOpacity
                style={[styles.dualSaveButton, styles.updateSaveButton]}
                onPress={handleUpdateSave}
              >
                <Text style={styles.dualSaveButtonText}>Update Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dualSaveButton, styles.saveNewButton]}
                onPress={() => {
                  setBuildName('');
                  setShowSaveInput(true);
                }}
              >
                <Text style={styles.dualSaveButtonText}>Save New</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.mainSaveButton}
              onPress={() => setShowSaveInput(true)}
            >
              <Text style={styles.mainSaveButtonText}>Save Build</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Badges FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: activeCategoryColor }]}
        onPress={() => setShowBadgesModal(true)}
      >
        <MaterialCommunityIcons name="medal" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Badges Modal */}
      <BadgesModal
        visible={showBadgesModal}
        badges={badgesList}
        activeCategory={activeCategory}
        onClose={() => setShowBadgesModal(false)}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.background },
  container: { padding: 16, paddingBottom: 40 },
  inputsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 4 },
  groupHeader: { fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 8, color: theme.text },
  skillBlock: { marginBottom: 18 },
  skillDisabled: { opacity: 0.5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: theme.text },
  labelDisabled: { color: theme.textTertiary },
  valueColumn: { alignItems: 'flex-end' },
  value: { fontSize: 14, fontWeight: '600', color: theme.text, minWidth: 36, textAlign: 'right' },
  subValue: { fontSize: 12, color: theme.textSecondary },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  totalText: { fontSize: 14, fontWeight: '700', color: theme.text },
  capText: { fontSize: 12, color: theme.textSecondary },
  capError: { color: '#ff453a', marginBottom: 8 },
  barContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0a84ff', justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { backgroundColor: theme.disabled },
  buttonText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  barWrapper: { flex: 1, height: 40, justifyContent: 'center' },
  barBackground: { height: 12, backgroundColor: theme.barBackground, borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%' },
  
  // Save section
  saveSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: theme.borderSecondary,
  },
  mainSaveButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  mainSaveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  saveInputContainer: {
    gap: 12,
  },
  saveInput: {
    borderWidth: 1,
    borderColor: theme.inputBorder,
    backgroundColor: theme.input,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  },
  saveButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveCancelButton: {
    backgroundColor: theme.disabled,
  },
  saveConfirmButton: {
    backgroundColor: '#0a84ff',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dualSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  updateSaveButton: {
    backgroundColor: '#0a84ff',
  },
  saveNewButton: {
    backgroundColor: '#34c759',
  },
  dualSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
