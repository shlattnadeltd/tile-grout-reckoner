import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import theme from '../constants/theme';

type Props = {
  label: string;
  value: string;
  unit: string;
  onChange: (v: string) => void;
  style?: ViewStyle;
  compact?: boolean;
};

function NumericFieldBase({
  label,
  value,
  unit,
  onChange,
  style,
  compact,
}: Props) {
  const [focused, setFocused] = useState(false);
  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  return (
    <View style={[styles.wrap, style]}>
      {compact ? null : <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.field,
          compact ? styles.fieldCompact : null,
          focused ? styles.focused : null,
        ]}>
        <TextInput
          style={[styles.input, compact ? styles.inputCompact : null]}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={theme.colors.text.muted}
          maxLength={6}
          selectionColor={theme.colors.accent.coral}
          accessibilityLabel={label}
        />
        <Text style={styles.suffix}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    ...theme.typography.micro,
    color: theme.colors.text.secondary,
  },
  field: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingLeft: 14,
    paddingRight: 14,
  },
  fieldCompact: { height: 44, paddingLeft: 10, paddingRight: 10 },
  focused: { borderWidth: 1.5, borderColor: theme.colors.accent.slate },
  input: {
    flex: 1,
    padding: 0,
    ...theme.typography.field,
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  inputCompact: { fontSize: 16, fontWeight: '700' },
  suffix: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginLeft: 8,
  },
});

export const NumericField = memo(NumericFieldBase);
export default NumericField;
