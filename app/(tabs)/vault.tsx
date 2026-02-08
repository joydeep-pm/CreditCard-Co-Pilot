import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { VAULT_CARDS } from '@/data/merchants';
import { colors, radii, shadows, TAB_BAR_HEIGHT } from '@/theme/tokens';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 48;
const CARD_H = CARD_W / 1.55;
const STACK_GAP = 24;

export default function VaultScreen() {
  const [active, setActive] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 15,
      onPanResponderRelease: (_, g) => {
        if (g.dx < -50) {
          setActive((p) => Math.min(p + 1, VAULT_CARDS.length - 1));
        } else if (g.dx > 50) {
          setActive((p) => Math.max(p - 1, 0));
        }
      },
    }),
  ).current;

  return (
    <View style={styles.bg}>
      {/* Subtle ambient glow */}
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
        <View style={styles.stackContainer} {...panResponder.panHandlers}>
          {VAULT_CARDS.map((card, idx) => {
            const abs = Math.abs(idx - active);
            if (abs > 3) return null;

            return (
              <Pressable
                key={card.id}
                onPress={() => setActive(idx)}
                style={[
                  styles.stackedCard,
                  {
                    zIndex: VAULT_CARDS.length - abs,
                    transform: [
                      { translateY: -abs * STACK_GAP },
                      { scale: 1 - abs * 0.045 },
                    ],
                    opacity: abs === 0 ? 1 : Math.max(0.35, 1 - abs * 0.25),
                  },
                ]}
              >
                <View style={styles.cardInner}>
                  <Image
                    source={card.image}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  {/* Diagonal shine sweep */}
                  <LinearGradient
                    colors={[
                      'transparent',
                      'rgba(255,255,255,0.03)',
                      'rgba(255,255,255,0.14)',
                      'rgba(255,255,255,0.03)',
                      'transparent',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  {/* Top edge highlight for depth */}
                  <LinearGradient
                    colors={['rgba(255,255,255,0.12)', 'transparent']}
                    style={styles.topHighlight}
                  />
                  {/* Subtle border overlay */}
                  <View style={styles.cardBorder} />
                </View>
              </Pressable>
            );
          })}
        </View>

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
            <Pressable key={idx} onPress={() => setActive(idx)} hitSlop={8}>
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
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
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
