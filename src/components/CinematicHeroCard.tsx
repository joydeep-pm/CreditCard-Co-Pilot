import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { radii, shadows } from '@/theme/tokens';

interface Props {
  image: ImageSourcePropType;
  scrollY: SharedValue<number>;
}

export default function CinematicHeroCard({ image, scrollY }: Props) {
  /* 3-D tilt + subtle scale as user scrolls down */
  const cardStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(
      scrollY.value,
      [0, 200],
      [0, 15],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, 200],
      [1, 1.05],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { perspective: 800 },
        { rotateX: `${rotateX}deg` },
        { scale },
      ],
    };
  });

  /* Diagonal glare that sweeps across the card with scroll */
  const glareStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, 200],
      [-80, 120],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 200],
      [-40, 80],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 60, 140, 200],
      [0, 0.3, 0.3, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX }, { translateY }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, shadows.lg, cardStyle]}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      {/* Diagonal glare sweep */}
      <Animated.View style={[styles.glare, glareStyle]} />
      {/* Top edge gleam */}
      <LinearGradient
        colors={['rgba(255,255,255,0.18)', 'transparent']}
        style={styles.topGleam}
      />
      {/* Border overlay */}
      <View style={styles.border} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 128,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: '#0F0F14',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  glare: {
    position: 'absolute',
    width: 100,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  topGleam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
});
