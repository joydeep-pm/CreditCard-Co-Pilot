import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { colors, radii } from '@/theme/tokens';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  small?: boolean;
  glow?: boolean;
}

export default function Pill({ label, active, onPress, style, small, glow }: Props) {
  const isBadge = small && active && !onPress;

  const content = (
    <Text
      style={[
        styles.text,
        small && styles.smallText,
        active && !isBadge && styles.activeText,
        isBadge && styles.badgeText,
      ]}
    >
      {label}
    </Text>
  );

  const containerStyle = [
    styles.pill,
    small && styles.small,
    active && !isBadge && styles.active,
    isBadge && styles.badge,
    glow && styles.glow,
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={containerStyle}>
        {content}
      </Pressable>
    );
  }
  return <View style={containerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  active: {
    backgroundColor: colors.sage,
    borderColor: colors.sage2,
  },
  badge: {
    backgroundColor: 'rgba(45,212,191,0.12)',
    borderColor: 'rgba(45,212,191,0.2)',
  },
  glow: {
    shadowColor: colors.sage,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  activeText: {
    color: colors.white,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.sage,
  },
  small: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  smallText: {
    fontSize: 12,
  },
});
