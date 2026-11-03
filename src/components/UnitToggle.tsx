import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { Unit } from '../constants/config';

type Props = { unit: Unit; onChange: (u: Unit) => void };

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function Segment({
  value,
  active,
  onPress,
}: {
  value: Unit;
  active: boolean;
  onPress: (u: Unit) => void;
}) {
  const handle = useCallback(() => onPress(value), [onPress, value]);
  return (
    <Pressable
      style={[styles.seg, active ? styles.segActive : null]}
      hitSlop={HIT}
      onPress={handle}
      accessibilityRole="button"
      accessibilityLabel={`Use ${value === 'm' ? 'metres' : 'feet'}`}>
      <Text style={[styles.label, active ? styles.labelActive : null]}>
        {value.toUpperCase()}
      </Text>
    </Pressable>
  );
}

function UnitToggleBase({ unit, onChange }: Props) {
  return (
    <View style={styles.track}>
      <Segment value="m" active={unit === 'm'} onPress={onChange} />
      <Segment value="ft" active={unit === 'ft'} onPress={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 72,
    height: 32,
    flexDirection: 'row',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.alt,
    padding: 2,
  },
  seg: {
    width: 34,
    height: 28,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segActive: { backgroundColor: theme.colors.accent.slate },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    lineHeight: 16,
    color: theme.colors.text.secondary,
  },
  labelActive: { color: theme.colors.text.inverse },
});

export const UnitToggle = memo(UnitToggleBase);
export default UnitToggle;
