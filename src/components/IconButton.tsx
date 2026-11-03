import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
} from 'react-native';
import theme from '../constants/theme';
import { ICON_STROKE } from './icons';
import type { IconCmp } from './icons';

type Props = {
  Icon?: IconCmp;
  image?: ImageSourcePropType;
  onPress?: () => void;
  label: string;
  tone?: 'card' | 'tint';
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** The 40x40 header square — one shape for every navigation glyph. */
function IconButtonBase({ Icon, image, onPress, label, tone = 'card' }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.92,
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

  return (
    <Pressable
      style={styles.press}
      hitSlop={HIT}
      onPress={onPress}
      disabled={!onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        style={[
          styles.box,
          tone === 'tint' ? styles.tint : styles.card,
          { transform: [{ scale }] },
        ]}>
        {Icon ? (
          <Icon
            size={20}
            strokeWidth={ICON_STROKE}
            color={theme.colors.accent.slate}
          />
        ) : null}
        {image ? <Image source={image} style={styles.img} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: 40, height: 40 },
  box: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface.card,
    borderColor: theme.colors.ui.border,
  },
  tint: {
    backgroundColor: theme.colors.surface.tint,
    borderColor: theme.colors.ui.borderMuted,
  },
  img: { width: 24, height: 24, resizeMode: 'contain' },
});

export const IconButton = memo(IconButtonBase);
export default IconButton;
