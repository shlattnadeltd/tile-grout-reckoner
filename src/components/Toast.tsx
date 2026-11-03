import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

type Props = { text: string; visible: boolean };

function ToastBase({ text, visible }: Props) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: visible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [visible, fade]);

  if (!visible) {
    return null;
  }

  const translateY = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity: fade, transform: [{ translateY }] }]}>
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 28,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent.slate,
    borderRadius: theme.radius.md,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.inverse,
  },
});

export const Toast = memo(ToastBase);
export default Toast;
