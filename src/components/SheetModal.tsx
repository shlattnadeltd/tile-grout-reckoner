import React, { memo, ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import theme from '../constants/theme';
import { ICON_STROKE } from './icons';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function SheetModalBase({ visible, title, onClose, children }: Props) {
  const slide = useRef(new Animated.Value(320)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slide.setValue(320);
      fade.setValue(0);
      Animated.parallel([
        Animated.spring(slide, {
          toValue: 0,
          ...theme.animation.sheet,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slide, fade]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.scrim, { opacity: fade }]}>
          <Pressable
            style={styles.scrimPress}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
        </Animated.View>

        {/* box-none so the animated wrapper can never swallow a tap */}
        <Animated.View
          pointerEvents="box-none"
          style={[styles.sheetWrap, { transform: [{ translateY: slide }] }]}>
          <View style={styles.sheet}>
            <View style={styles.head}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Pressable
                style={styles.close}
                hitSlop={HIT}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close sheet">
                <X
                  size={20}
                  strokeWidth={ICON_STROKE}
                  color={theme.colors.accent.slate}
                />
              </Pressable>
            </View>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  scrim: { ...StyleSheet.absoluteFillObject },
  scrimPress: { flex: 1, backgroundColor: theme.colors.ui.scrim },
  sheetWrap: { width: '100%' },
  sheet: {
    width: '100%',
    backgroundColor: theme.colors.surface.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 14,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  title: {
    ...theme.typography.section,
    color: theme.colors.accent.slate,
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const SheetModal = memo(SheetModalBase);
export default SheetModal;
