import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import theme from '../constants/theme';
import { ICON_STROKE } from './icons';

type Props = {
  name: string;
  dims: string;
  tiles: number;
  active: boolean;
  index: number;
  onPress: () => void;
  onRemove: () => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function RoomCardBase({
  name,
  dims,
  tiles,
  active,
  index,
  onPress,
  onRemove,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 260,
      delay: Math.min(index, 5) * 60,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.98,
      ...theme.animation.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      ...theme.animation.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{ opacity: enter, transform: [{ translateY }] }}>
      <Pressable
        style={styles.press}
        hitSlop={HIT}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${tiles} tiles`}>
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          {active ? <View style={styles.activeBar} /> : null}
          <View style={styles.texts}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.dims} numberOfLines={1}>
              {dims}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{tiles}</Text>
            <Text style={styles.badgeLabel}>TILES</Text>
          </View>
        </Animated.View>
      </Pressable>

      <Pressable
        style={styles.trash}
        hitSlop={HIT}
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${name}`}>
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
  press: { width: '100%', height: 70, marginBottom: 10 },
  card: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 17,
    paddingRight: 48,
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    overflow: 'hidden',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: theme.colors.accent.coral,
  },
  texts: { flex: 1, gap: 4 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: theme.colors.text.primary,
  },
  dims: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'],
  },
  badge: { alignItems: 'flex-end', gap: 2 },
  badgeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.accent.coral,
    fontVariant: ['tabular-nums'],
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  trash: {
    position: 'absolute',
    right: 10,
    top: 11,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const RoomCard = memo(RoomCardBase);
export default RoomCard;
