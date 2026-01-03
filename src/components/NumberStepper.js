import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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
          <MaterialIcons name="arrow-back-ios" size={16} color={disabledDecrement ? theme.disabled : '#0a84ff'} />
        </Pressable>

        <View style={styles.valueBox}>
          <Text style={styles.valueText}>{formatValue ? formatValue(value) : String(value)}</Text>
        </View>

        <Pressable
          onPress={() => !disabledIncrement && onChange(Math.min(max, value + step))}
          style={({ pressed }) => [styles.button, disabledIncrement && styles.disabled, pressed && styles.pressed]}
          accessibilityLabel={`Increase ${label || 'value'}`}
        >
          <MaterialIcons name="arrow-forward-ios" size={16} color={disabledIncrement ? theme.disabled : '#0a84ff'} />
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { marginBottom: 0 },
  label: { fontSize: 11, marginBottom: 4, fontWeight: '600', textAlign: 'center', alignSelf: 'center', color: theme.text },
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  button: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.45 },
  valueBox: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  valueText: { fontSize: 12, fontWeight: '700', color: theme.text },
});
