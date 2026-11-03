import React, { memo, useCallback, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/** h48 tinted slate + hairline border. Text only — never an icon, so the
 *  icon size can never disagree with the primary button (rule #20). */
function SecondaryButtonBase({ label, onPress, disabled, style }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
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
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: '100%', height: 48 },
  disabled: { opacity: 0.45 },
  anim: {
    width: '100%',
    height: 48,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderMuted,
    backgroundColor: theme.colors.surface.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.6,
    lineHeight: 18,
    color: theme.colors.accent.slate,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
export default SecondaryButton;
