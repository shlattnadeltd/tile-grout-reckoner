import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { BTN_ICON, ICON_STROKE } from './icons';
import type { IconCmp } from './icons';

type Props = {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function PrimaryButtonBase({ label, Icon, onPress, disabled, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
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
      style={[styles.press, style, disabled ? styles.disabled : null]}
      hitSlop={HIT}
      disabled={disabled}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View style={[styles.anim, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={theme.gradients.coral}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? (
              <Icon
                size={BTN_ICON}
                strokeWidth={ICON_STROKE}
                color={theme.colors.text.inverse}
              />
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    ...theme.shadows.cta,
  },
  disabled: { opacity: 0.45 },
  anim: {
    width: '100%',
    height: 60,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  },
  grad: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    ...theme.typography.button,
    lineHeight: BTN_ICON,
    color: theme.colors.text.inverse,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
export default PrimaryButton;
