import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue,
  label,
  style,
}) {
  const disabledDecrement = value <= min;
  const disabledIncrement = value >= max;

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        <Pressable
          onPress={() => !disabledDecrement && onChange(Math.max(min, value - step))}
          style={({ pressed }) => [styles.button, disabledDecrement && styles.disabled, pressed && styles.pressed]}
          accessibilityLabel={`Decrease ${label || 'value'}`}
        >
          <MaterialIcons name="arrow-back-ios" size={18} color={disabledDecrement ? '#aaa' : '#0a84ff'} />
        </Pressable>

        <View style={styles.valueBox}>
          <Text style={styles.valueText}>{formatValue ? formatValue(value) : String(value)}</Text>
        </View>

        <Pressable
          onPress={() => !disabledIncrement && onChange(Math.min(max, value + step))}
          style={({ pressed }) => [styles.button, disabledIncrement && styles.disabled, pressed && styles.pressed]}
          accessibilityLabel={`Increase ${label || 'value'}`}
        >
          <MaterialIcons name="arrow-forward-ios" size={18} color={disabledIncrement ? '#aaa' : '#0a84ff'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center' },
  button: {
    padding: 8,
    borderRadius: 6,
  },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.45 },
  valueBox: {
    minWidth: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  valueText: { fontSize: 16, fontWeight: '700' },
});
