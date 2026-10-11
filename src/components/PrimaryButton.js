import React, { useContext } from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

// One consistent button for the app. variant: 'solid' | 'outline'.
const PrimaryButton = ({ title, onPress, disabled, loading, variant = 'solid', style, accessibilityLabel }) => {
  const { colors } = useContext(ThemeContext);
  const solid = variant === 'solid';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        solid
          ? { backgroundColor: colors.primary }
          : { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={solid ? colors.onPrimary : colors.primary} />
      ) : (
        <Text style={[styles.text, { color: solid ? colors.onPrimary : colors.primary }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
});

export default PrimaryButton;
