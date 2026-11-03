import React, { memo, useCallback, useRef } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import theme from '../constants/theme';
import { clamp } from '../utils/format';
import { ICON_STROKE } from './icons';

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  accent?: string;
  onChange: (v: number) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** Two 48x48 steppers plus a tappable track — a full replacement for a
 *  pan gesture, so no external pan/touch dependency is needed (rule #8). */
function StepperSliderBase({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  accent = theme.colors.accent.coral,
  onChange,
}: Props) {
  const trackW = useRef(1);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    trackW.current = Math.max(1, e.nativeEvent.layout.width);
  }, []);

  const dec = useCallback(
    () => onChange(clamp(value - step, min, max)),
    [onChange, value, step, min, max],
  );
  const inc = useCallback(
    () => onChange(clamp(value + step, min, max)),
    [onChange, value, step, min, max],
  );

  const onTrack = useCallback(
    (e: GestureResponderEvent) => {
      const ratio = clamp(e.nativeEvent.locationX / trackW.current, 0, 1);
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Math.round(snapped * 100) / 100, min, max));
    },
    [onChange, min, max, step],
  );

  const pct = clamp((value - min) / Math.max(max - min, 1), 0, 1);

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color: accent }]}>
          {`${value}${unit}`}
        </Text>
      </View>

      <View style={styles.row}>
        <Pressable
          style={styles.step}
          hitSlop={HIT}
          onPress={dec}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}>
          <Minus
            size={20}
            strokeWidth={ICON_STROKE}
            color={theme.colors.accent.slate}
          />
        </Pressable>

        <Pressable
          style={styles.track}
          onLayout={onLayout}
          onPress={onTrack}
          accessibilityRole="adjustable"
          accessibilityLabel={label}>
          <View style={styles.trackBg} />
          <View
            style={[
              styles.trackFill,
              { width: `${pct * 100}%`, backgroundColor: accent },
            ]}
          />
          <View
            style={[
              styles.knob,
              { left: `${pct * 100}%`, borderColor: accent },
            ]}
          />
        </Pressable>

        <Pressable
          style={styles.step}
          hitSlop={HIT}
          onPress={inc}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}>
          <Plus
            size={20}
            strokeWidth={ICON_STROKE}
            color={theme.colors.accent.slate}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    ...theme.typography.micro,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
    fontVariant: ['tabular-nums'],
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  step: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.surface.card,
  },
  track: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  trackBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.bg.deep,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    borderRadius: 2,
  },
  knob: {
    position: 'absolute',
    marginLeft: -9,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    backgroundColor: theme.colors.surface.card,
  },
});

export const StepperSlider = memo(StepperSliderBase);
export default StepperSlider;
