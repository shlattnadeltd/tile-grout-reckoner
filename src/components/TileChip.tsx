import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  width?: number;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function TileChipBase({ label, active, onPress, width = 74 }: Props) {
  return (
    <Pressable
      style={[
        styles.chip,
        { width, height: 40 },
        active ? styles.active : null,
      ]}
      hitSlop={HIT}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}>
      <Text
        style={[styles.label, active ? styles.labelActive : null]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.surface.card,
  },
  active: {
    borderWidth: 1.5,
    borderColor: theme.colors.accent.coral,
    backgroundColor: theme.colors.surface.coralTint,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    lineHeight: 16,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  labelActive: { color: theme.colors.text.primary },
});

export const TileChip = memo(TileChipBase);
export default TileChip;
