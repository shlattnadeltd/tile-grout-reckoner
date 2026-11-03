import React, { memo, ReactNode } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  centerSlot?: ReactNode;
  title?: string;
  subtitle?: string;
  bordered?: boolean;
  style?: ViewStyle;
};

/**
 * The one header used on Menu / Game / Result. Screens differ only by what
 * they pass into leftSlot / centerSlot / rightSlot, so the padding, the
 * 40x40 slot size and the hairline never drift between screens.
 */
function ScreenHeaderBase({
  leftSlot,
  rightSlot,
  centerSlot,
  title,
  subtitle,
  bordered = true,
  style,
}: Props) {
  return (
    <View style={[styles.wrap, bordered ? styles.bordered : null, style]}>
      <View style={styles.side}>{leftSlot}</View>

      <View style={styles.center}>
        {centerSlot}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: theme.headerTop, // rule #6 — never overlap the status bar
    minHeight: theme.headerTop + 56,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.tint,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.border,
  },
  side: {
    minWidth: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sideRight: { justifyContent: 'flex-end' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: theme.colors.accent.slate,
  },
  subtitle: {
    ...theme.typography.micro,
    color: theme.colors.text.secondary,
  },
});

export const ScreenHeader = memo(ScreenHeaderBase);
export default ScreenHeader;
