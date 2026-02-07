import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/theme/tokens';

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function YieldRing({ percentage, size = 90, strokeWidth = 7 }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.sage}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={styles.label}>
        <Text style={styles.pct}>{percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1)}%</Text>
        <Text style={styles.yieldText}>YIELD</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  label: {
    position: 'absolute',
    alignItems: 'center',
  },
  pct: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  yieldText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.muted2,
    letterSpacing: 1,
  },
});
