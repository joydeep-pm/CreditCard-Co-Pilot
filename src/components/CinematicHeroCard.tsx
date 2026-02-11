import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
  withRepeat,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadows } from '@/theme/tokens';

interface Props {
  image?: ImageSourcePropType;
  scrollY: SharedValue<number>;
  issuer?: string;
  cardName?: string;
}

export default function CinematicHeroCard({ image, scrollY, issuer, cardName }: Props) {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const entryProgress = useSharedValue(0);
  const ambientProgress = useSharedValue(0);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) {
          setReduceMotionEnabled(enabled);
        }
      })
      .catch(() => {});

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotionEnabled,
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    entryProgress.value = reduceMotionEnabled ? 1 : withTiming(1, { duration: 520 });
  }, [entryProgress, reduceMotionEnabled]);

  useEffect(() => {
    if (reduceMotionEnabled) {
      cancelAnimation(ambientProgress);
      ambientProgress.value = 0;
      return;
    }
    ambientProgress.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [ambientProgress, reduceMotionEnabled]);

  const cardStyle = useAnimatedStyle(() => {
    if (reduceMotionEnabled) {
      return { transform: [{ perspective: 800 }] };
    }

    const entryLift = interpolate(
      entryProgress.value,
      [0, 1],
      [10, 0],
      Extrapolation.CLAMP,
    );
    const entryTilt = interpolate(
      entryProgress.value,
      [0, 1],
      [7, 0],
      Extrapolation.CLAMP,
    );
    const rotateX = interpolate(
      scrollY.value,
      [0, 220],
      [0, 6],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [0, 220],
      [1, 1.02],
      Extrapolation.CLAMP,
    );
    const ambientScale = interpolate(
      ambientProgress.value,
      [0, 1],
      [1, 1.012],
      Extrapolation.CLAMP,
    );
    const ambientRotate = interpolate(
      ambientProgress.value,
      [0, 1],
      [-0.6, 0.6],
      Extrapolation.CLAMP,
    );
    return {
      transform: [
        { perspective: 800 },
        { translateY: entryLift },
        { rotateX: `${rotateX + entryTilt}deg` },
        { rotateZ: `${ambientRotate}deg` },
        { scale: scale * ambientScale },
      ],
    };
  });

  const glareStyle = useAnimatedStyle(() => {
    if (reduceMotionEnabled) {
      return {
        transform: [{ translateX: -80 }, { translateY: -40 }],
        opacity: 0,
      };
    }

    const translateX = interpolate(
      scrollY.value,
      [0, 220],
      [-50, 90],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 220],
      [-30, 40],
      Extrapolation.CLAMP,
    );
    const scrollOpacity = interpolate(
      scrollY.value,
      [0, 80, 200],
      [0, 0.18, 0],
      Extrapolation.CLAMP,
    );
    const entryOpacity = interpolate(
      entryProgress.value,
      [0, 1],
      [0.22, 0],
      Extrapolation.CLAMP,
    );
    const ambientOpacity = interpolate(
      ambientProgress.value,
      [0, 1],
      [0.03, 0.16],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ translateX }, { translateY }],
      opacity: scrollOpacity + entryOpacity + ambientOpacity,
    };
  });

  return (
    <Animated.View style={[styles.container, shadows.lg, cardStyle]}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="cover" />
      ) : (
        <LinearGradient
          colors={[colors.dark, '#1E293B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fallback}
        >
          <Text style={styles.fallbackIssuer}>{issuer ?? 'Card'}</Text>
          <Text style={styles.fallbackName}>{cardName ?? 'Recommended'}</Text>
        </LinearGradient>
      )}
      <Animated.View style={[styles.glare, glareStyle]} />
      <LinearGradient
        colors={['rgba(255,255,255,0.18)', 'transparent']}
        style={styles.topGleam}
      />
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
  fallback: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  fallbackIssuer: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  fallbackName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
