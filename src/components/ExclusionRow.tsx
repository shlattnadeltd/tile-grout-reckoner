import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import NumericField from './NumericField';
import { ICON_STROKE } from './icons';

type Props = {
  id: string;
  index: number;
  w: string;
  h: string;
  unit: string;
  onChange: (id: string, key: 'w' | 'h', value: string) => void;
  onRemove: (id: string) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function ExclusionRowBase({
  id,
  index,
  w,
  h,
  unit,
  onChange,
  onRemove,
}: Props) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: theme.animation.hatch,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const setW = useCallback((v: string) => onChange(id, 'w', v), [id, onChange]);
  const setH = useCallback((v: string) => onChange(id, 'h', v), [id, onChange]);
  const remove = useCallback(() => onRemove(id), [id, onRemove]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.row, { opacity: fade }]}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>{`[${index + 1}]`}</Text>
      </View>
      <NumericField
        compact
        label="Exclusion width"
        value={w}
        unit={unit}
        onChange={setW}
        style={styles.field}
      />
      <NumericField
        compact
        label="Exclusion height"
        value={h}
        unit={unit}
        onChange={setH}
        style={styles.field}
      />
      <Pressable
        style={styles.trash}
        hitSlop={HIT}
        onPress={remove}
        accessibilityRole="button"
        accessibilityLabel={`Remove exclusion ${index + 1}`}>
        <Trash2
          size={18}
          strokeWidth={ICON_STROKE}
          color={theme.colors.text.muted}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    width: 32,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.accent.coral,
    letterSpacing: 0.6,
  },
  field: { flex: 1 },
  trash: {
    width: 36,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const ExclusionRow = memo(ExclusionRowBase);
export default ExclusionRow;
