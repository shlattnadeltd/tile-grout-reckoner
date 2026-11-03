import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { CARD_ICON, ICON_STROKE } from './icons';
import type { IconCmp } from './icons';

type Props = {
  Icon: IconCmp;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * The shared stat pill — identical geometry on Menu and on Result.
 * width:'100%' (NOT flex:1) inside a flex:1 row slot, otherwise RN resolves
 * the height circularly and collapses the text away (rule #19a).
 */
function StatCardBase({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon size={CARD_ICON} strokeWidth={ICON_STROKE} color={valueColor} />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
});

export const StatCard = memo(StatCardBase);
export default StatCard;
