import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import theme from '../constants/theme';

type Props = { step: number; total: number };

/** Four dots; the current one stretches into a 20x8 coral pill. */
function StepStripBase({ step, total }: Props) {
  const dots = [];
  for (let i = 1; i <= total; i += 1) {
    const isActive = i === step;
    const isDone = i < step;
    dots.push(
      <View
        key={i}
        style={[
          styles.dot,
          isActive ? styles.active : null,
          isDone ? styles.done : null,
        ]}
      />,
    );
  }
  return <View style={styles.row}>{dots}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.ui.borderMuted,
  },
  active: { width: 20, backgroundColor: theme.colors.accent.coral },
  done: { backgroundColor: theme.colors.accent.slate },
});

export const StepStrip = memo(StepStripBase);
export default StepStrip;
