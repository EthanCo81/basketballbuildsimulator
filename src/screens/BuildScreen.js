import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import NumberStepper from '../components/NumberStepper';
import { getWeight, hasBaseWeight, getValidSliderBounds } from '../utils/getWeight';
import { WEIGHT_CAP } from '../config';

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

export default function HomeScreen() {
  const [heightInches, setHeightInches] = useState(74); // default 6'2"
  // Wingspan depends on height: min = height, max = height + 6
  const [wingspan, setWingspan] = useState(74);
  const [weight, setWeight] = useState(210);

  // Default each slider to 25
  const [values, setValues] = useState(Object.fromEntries(SKILLS.map((s) => [s, 25])));

  const [capError, setCapError] = useState(null);
  const capTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdSkillRef = useRef(null);
  const holdDirectionRef = useRef(null);

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

    // Prevent any forward movement if cap is already reached
    if (newVal > oldVal && totalWeight >= WEIGHT_CAP) {
      showCapError('Cap reached — cannot increase any slider');
      return;
    }

    const prevWeight = getWeight(heightInches, skill, oldVal) || 0;
    const candidateWeight = getWeight(heightInches, skill, newVal) || 0;
    const newTotal = totalWeight - prevWeight + candidateWeight;

    if (newTotal <= WEIGHT_CAP) {
      setValues((prev) => ({ ...prev, [skill]: newVal }));
      return;
    }

    // If increasing, try to clamp down to the highest allowed value between oldVal and newVal
    if (newVal > oldVal) {
      for (let v = newVal; v > oldVal; v--) {
        if (!hasBaseWeight(heightInches, skill, v)) continue;
        const w = getWeight(heightInches, skill, v) || 0;
        if (totalWeight - prevWeight + w <= WEIGHT_CAP) {
          setValues((prev) => ({ ...prev, [skill]: v }));
          return;
        }
      }
      // no allowed increase
      showCapError('Cap reached — cannot increase this slider');
      return;
    }

    // If decreasing, always allow
    setValues((prev) => ({ ...prev, [skill]: newVal }));
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

  const formatHeight = (inches) => `${Math.floor(inches / 12)}'${inches % 12}"`;

  const startHold = useCallback((skill, direction) => {
    // direction: 1 for increment, -1 for decrement
    holdSkillRef.current = skill;
    holdDirectionRef.current = direction;

    // Initial delay before rapid increment starts
    const initialDelay = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        setValues((prev) => {
          const currentVal = prev[skill] || 25;
          const newVal = currentVal + direction;
          handleSliderChange(skill, newVal);
          return prev;
        });
      }, 40); // repeat every 40ms for rapid increment
    }, 150); // 150ms before starting

    return () => clearTimeout(initialDelay);
  }, [handleSliderChange]);

  const endHold = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    holdSkillRef.current = null;
    holdDirectionRef.current = null;
  }, []);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputsRow}>
          <NumberStepper
            label="Height"
            value={heightInches}
            onChange={handleHeightChange}
            min={69}
            max={88}
            step={1}
            formatValue={(v) => `${Math.floor(v / 12)}'${v % 12}\"`}
            style={{ flex: 1, marginRight: 8 }}
          />

          <NumberStepper
            label="Wingspan"
            value={wingspan}
            onChange={setWingspan}
            min={heightInches}
            max={heightInches + 6}
            step={1}
            formatValue={(v) => `${v} in`}
            style={{ flex: 1, marginHorizontal: 4 }}
          />

          <NumberStepper
            label="Weight"
            value={weight}
            onChange={setWeight}
            min={120}
            max={360}
            step={1}
            formatValue={(v) => `${v} lb`}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        <View style={styles.totalsRow}>
          <Text style={styles.totalText}>Total weight: {totalWeight.toFixed(2)}</Text>
          <Text style={styles.capText}>Cap: {WEIGHT_CAP.toLocaleString()}</Text>
        </View>
        {capError ? <Text style={styles.capError}>{capError}</Text> : null}

        {SKILLS.map((skill) => {
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

          const range = bounds ? (bounds.max - bounds.min) : 1;
          const fillPercent = bounds ? ((displayValue - bounds.min) / range) * 100 : 0;

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
                  style={[styles.button, !canDecrement && styles.buttonDisabled]}
                  onPress={() => handleSliderChange(skill, displayValue - 1)}
                  onPressIn={() => startHold(skill, -1)}
                  onPressOut={endHold}
                  disabled={!canDecrement}
                >
                  <Text style={styles.buttonText}>−</Text>
                </TouchableOpacity>

                <View style={styles.barWrapper}>
                  <View style={styles.barBackground}>
                    <View style={[styles.barFill, { width: `${fillPercent}%` }]} />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, !canIncrement && styles.buttonDisabled]}
                  onPress={() => handleSliderChange(skill, displayValue + 1)}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingBottom: 40 },
  inputsRow: { flexDirection: 'row', marginBottom: 12 },
  skillBlock: { marginBottom: 18 },
  skillDisabled: { opacity: 0.5 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '600' },
  labelDisabled: { color: '#999' },
  valueColumn: { alignItems: 'flex-end' },
  value: { fontSize: 16, color: '#333', minWidth: 36, textAlign: 'right' },
  subValue: { fontSize: 12, color: '#666' },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  totalText: { fontSize: 14, fontWeight: '700' },
  capText: { fontSize: 12, color: '#666' },
  capError: { color: '#b00020', marginBottom: 8 },
  barContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0a84ff', justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
  barWrapper: { flex: 1, height: 40, justifyContent: 'center' },
  barBackground: { height: 12, backgroundColor: '#ddd', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#0a84ff' },
});
