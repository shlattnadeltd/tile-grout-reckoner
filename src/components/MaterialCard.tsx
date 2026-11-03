import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { ICON_STROKE } from './icons';
import type { IconCmp } from './icons';

type Props = {
  Icon: IconCmp;
  value: string;
  sub: string;
  accent: string;
  index?: number;
};

/** The 84px bold-numeral card on the Materials Summary. */
function MaterialCardBase({ Icon, value, sub, accent, index = 0 }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 70;
    Animated.parallel([
      Animated.timing(enter, {
        toValue: 1,
        duration: 280,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(bar, {
        toValue: 1,
        duration: 320,
        delay: delay + 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [enter, bar, index]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.card, { opacity: enter, transform: [{ translateY }] }]}>
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: accent, transform: [{ scaleY: bar }] },
        ]}
      />
      <View style={[styles.iconWrap, { backgroundColor: accent + '1A' }]}>
        <Icon size={26} strokeWidth={ICON_STROKE} color={accent} />
      </View>
      <View style={styles.texts}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {sub}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingLeft: 19,
    paddingRight: 16,
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    overflow: 'hidden',
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, gap: 4 },
  value: {
    ...theme.typography.numeral,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  sub: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
});

export const MaterialCard = memo(MaterialCardBase);
export default MaterialCard;
