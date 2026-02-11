import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { VAULT_CARDS, VaultCard } from '@/data/merchants';
import { colors, radii, shadows, TAB_BAR_HEIGHT } from '@/theme/tokens';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 48;
const CARD_H = CARD_W / 1.55;
const STACK_GAP = 18;
const CARD_COUNT = VAULT_CARDS.length;

/** Heavy spring — "weighty" premium dismiss feel */
const DISMISS_SPRING = { damping: 15, stiffness: 80, mass: 1 };
/** Snappy settle spring for rubber-banding back */
const SETTLE_SPRING = { damping: 20, stiffness: 120, mass: 0.8 };

/* ─── Per-card animated wrapper ──────────────────────── */
function AnimatedVaultCard({
  card,
  index,
  activeIndexSV,
  dismissX,
}: {
  card: VaultCard;
  index: number;
  activeIndexSV: SharedValue<number>;
  dismissX: SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => {
    const offset = index - activeIndexSV.value;

    if (offset < -1 || offset > 3) {
      return { opacity: 0 };
    }

    if (offset === -1) {
      const rightDismissProgress = interpolate(
        Math.max(dismissX.value, 0),
        [0, SCREEN_W * 0.5],
        [0, 1],
        Extrapolation.CLAMP,
      );
      const scale = 0.95 + 0.05 * rightDismissProgress;
      const translateY = STACK_GAP * (1 - rightDismissProgress);
      const opacity = 0.3 + 0.7 * rightDismissProgress;

      return {
        zIndex: 9,
        opacity,
        transform: [{ translateY }, { scale }],
      };
    }

    if (offset === 0) {
      const rotate = interpolate(
        dismissX.value,
        [-SCREEN_W, 0, SCREEN_W],
        [-12, 0, 12],
        Extrapolation.CLAMP,
      );
      return {
        zIndex: 10,
        opacity: 1,
        transform: [
          { translateX: dismissX.value },
          { rotate: `${rotate}deg` },
        ],
      };
    }

    const leftDismissProgress = interpolate(
      Math.max(-dismissX.value, 0),
      [0, SCREEN_W * 0.5],
      [0, 1],
      Extrapolation.CLAMP,
    );

    const baseScale = 1 - offset * 0.045;
    const targetScale = 1 - (offset - 1) * 0.045;
    const scale = baseScale + (targetScale - baseScale) * leftDismissProgress;

    const baseY = -offset * STACK_GAP;
    const targetY = -(offset - 1) * STACK_GAP;
    const translateY = baseY + (targetY - baseY) * leftDismissProgress;

    const baseOpacity = interpolate(
      offset,
      [1, 2, 3],
      [0.75, 0.5, 0.25],
      Extrapolation.CLAMP,
    );
    const targetOpacity = interpolate(
      Math.max(0, offset - 1),
      [0, 1, 2, 3],
      [1, 0.75, 0.5, 0.25],
      Extrapolation.CLAMP,
    );
    const opacity = baseOpacity + (targetOpacity - baseOpacity) * leftDismissProgress;

    return {
      zIndex: 10 - offset,
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <Animated.View style={[styles.stackedCard, animStyle]}>
      <View style={styles.cardInner}>
        <Image source={card.image} style={styles.cardImage} resizeMode="cover" />
        <LinearGradient
          colors={['rgba(255,255,255,0.12)', 'transparent']}
          style={styles.topHighlight}
        />
      </View>
    </Animated.View>
  );
}

/* ─── Vault screen ──────────────────────────────────── */
export default function VaultScreen() {
  const [active, setActive] = useState(0);
  const activeIndexSV = useSharedValue(0);
  const dismissX = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: 1 + glowOpacity.value * 0.25 }],
  }));

  const visibleCards = useMemo(
    () =>
      VAULT_CARDS.map((card, index) => ({ card, index })).filter(
        ({ index }) => index >= Math.max(0, active - 1) && index <= Math.min(CARD_COUNT - 1, active + 2),
      ),
    [active],
  );

  const navigateTo = useCallback(
    (idx: number) => {
      dismissX.value = 0;
      activeIndexSV.value = idx;
      setActive(idx);
      glowOpacity.value = 0.22;
      glowOpacity.value = withTiming(0, { duration: 420 });
    },
    [activeIndexSV, dismissX, glowOpacity],
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      'worklet';
      dismissX.value = e.translationX;
    })
    .onEnd((e) => {
      'worklet';
      const currentIdx = activeIndexSV.value;

      // Swipe left → advance to next card
      if (
        (e.translationX < -80 || e.velocityX < -500) &&
        currentIdx < CARD_COUNT - 1
      ) {
        dismissX.value = withSpring(
          -SCREEN_W * 1.5,
          DISMISS_SPRING,
          (finished) => {
            if (finished) {
              const newIdx = currentIdx + 1;
              activeIndexSV.value = newIdx;
              dismissX.value = 0;
              runOnJS(setActive)(newIdx);
              glowOpacity.value = 0.22;
              glowOpacity.value = withTiming(0, { duration: 420 });
            }
          },
        );
        return;
      }

      // Swipe right → go back to previous card
      if (
        (e.translationX > 80 || e.velocityX > 500) &&
        currentIdx > 0
      ) {
        dismissX.value = withSpring(
          SCREEN_W * 1.5,
          DISMISS_SPRING,
          (finished) => {
            if (finished) {
              const newIdx = currentIdx - 1;
              activeIndexSV.value = newIdx;
              dismissX.value = 0;
              runOnJS(setActive)(newIdx);
              glowOpacity.value = 0.22;
              glowOpacity.value = withTiming(0, { duration: 420 });
            }
          },
        );
        return;
      }

      // Rubber-band back
      dismissX.value = withSpring(0, SETTLE_SPRING);
      glowOpacity.value = 0.14;
      glowOpacity.value = withTiming(0, { duration: 320 });
    });

  return (
    <View style={styles.bg}>
      <View style={styles.ambientGlow} />

      <SafeAreaView style={styles.flex} edges={['top']}>
        {/* header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subtitle}>YOUR CARDS</Text>
            <Text style={styles.title}>Card Vault</Text>
          </View>
          <Pressable style={styles.addBtn}>
            <Feather name="plus" size={22} color={colors.sage} />
          </Pressable>
        </View>

        {/* card stack */}
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.stackContainer}>
            {/* One-shot emphasis after settle/index change */}
            <Animated.View style={[styles.activeGlow, glowStyle]} />

            {visibleCards.map(({ card, index }) => (
              <AnimatedVaultCard
                key={card.id}
                card={card}
                index={index}
                activeIndexSV={activeIndexSV}
                dismissX={dismissX}
              />
            ))}
          </Animated.View>
        </GestureDetector>

        {/* Card details */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardIssuer}>{VAULT_CARDS[active].issuer}</Text>
          <Text style={styles.cardName}>{VAULT_CARDS[active].name}</Text>
          <Text style={styles.cardMeta}>
            {VAULT_CARDS[active].network} •••• {VAULT_CARDS[active].lastFour}
          </Text>
        </View>

        {/* Navigation dots */}
        <View style={styles.dotsRow}>
          {VAULT_CARDS.map((_, idx) => (
            <Pressable key={idx} onPress={() => navigateTo(idx)} hitSlop={8}>
              <View style={[styles.dot, idx === active && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  ambientGlow: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(45,212,191,0.06)',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted2,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },

  stackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  activeGlow: {
    position: 'absolute',
    width: CARD_W + 40,
    height: CARD_H + 40,
    borderRadius: radii.xl + 10,
    backgroundColor: 'rgba(45,212,191,0.10)',
    shadowColor: colors.sage,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  stackedCard: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  cardInner: {
    flex: 1,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },

  cardInfo: {
    alignItems: 'center',
    paddingBottom: 14,
  },
  cardIssuer: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted2,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 1,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dotActive: {
    backgroundColor: colors.sage,
    width: 22,
    borderRadius: 3,
  },
});
