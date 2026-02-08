import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, shadows } from '@/theme/tokens';

interface Props {
  issuer: string;
  cardName: string;
  lastFour?: string;
  network?: string;
  cardColor?: string;
  image?: ImageSourcePropType;
}

export default function ParallaxCard({
  issuer,
  cardName,
  lastFour = '4242',
  network = 'Visa',
  cardColor = colors.dark,
  image,
}: Props) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        pan.setValue({
          x: Math.max(-30, Math.min(30, g.dx)),
          y: Math.max(-30, Math.min(30, g.dy)),
        });
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  const rotateX = pan.y.interpolate({
    inputRange: [-30, 30],
    outputRange: ['8deg', '-8deg'],
    extrapolate: 'clamp',
  });
  const rotateY = pan.x.interpolate({
    inputRange: [-30, 30],
    outputRange: ['-8deg', '8deg'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        shadows.lg,
        {
          transform: [{ perspective: 800 }, { rotateX }, { rotateY }],
        },
      ]}
    >
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.cardImage} resizeMode="cover" />
          {/* Diagonal shine overlay */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.05)',
              'rgba(255,255,255,0.18)',
              'rgba(255,255,255,0.05)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Contrast boost - subtle dark vignette at edges */}
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'transparent', 'rgba(0,0,0,0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Top edge gleam */}
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'transparent']}
            style={styles.topGleam}
          />
          {/* Subtle border */}
          <View style={styles.imageBorder} />
        </View>
      ) : (
        <LinearGradient
          colors={[cardColor, `${cardColor}BB`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.sheen} />
          {/* Extra shine sweep */}
          <LinearGradient
            colors={[
              'transparent',
              'rgba(255,255,255,0.06)',
              'rgba(255,255,255,0.12)',
              'transparent',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.chip}>
            <View style={styles.chipLine} />
            <View style={styles.chipLine} />
          </View>
          <View>
            <Text style={styles.issuer}>{issuer}</Text>
            <Text style={styles.name}>{cardName}</Text>
          </View>
          <Text style={styles.cardNumber}>
            {'····  ····  ····  '}{lastFour}
          </Text>
        </LinearGradient>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 128,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#0F0F14',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  topGleam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  imageBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  gradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  sheen: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chip: {
    width: 28,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    paddingHorizontal: 3,
    gap: 2,
  },
  chipLine: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  issuer: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 1,
  },
  cardNumber: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.5,
  },
});
