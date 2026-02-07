import React, { ReactNode } from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { radii, shadows } from '@/theme/tokens';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassCard({ children, style, intensity = 40 }: Props) {
  return (
    <View style={[styles.outer, shadows.md, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={[styles.inner, Platform.OS !== 'ios' && styles.androidBg]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  inner: {
    padding: 20,
  },
  androidBg: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: radii.xl,
  },
});
