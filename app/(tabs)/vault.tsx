import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { VAULT_CARDS } from '@/data/merchants';
import { colors, radii, shadows, TAB_BAR_HEIGHT } from '@/theme/tokens';

export default function VaultScreen() {
  const [active, setActive] = useState(0);

  return (
    <View style={styles.bg}>
      <View style={styles.sageGlow} />

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

        {/* stacked cards */}
        <View style={styles.stackContainer}>
          {VAULT_CARDS.map((card, idx) => {
            const offset = idx - active;
            const abs = Math.abs(offset);

            return (
              <Pressable
                key={card.id}
                onPress={() => setActive(idx)}
                style={[
                  styles.stackedCard,
                  shadows.md,
                  {
                    zIndex: VAULT_CARDS.length - abs,
                    transform: [
                      { translateY: offset * 14 },
                      { scale: 1 - abs * 0.035 },
                    ],
                    opacity: abs > 4 ? 0 : 1 - abs * 0.12,
                  },
                ]}
              >
                <LinearGradient
                  colors={[card.color, `${card.color}CC`]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardSheen} />
                  {/* Gold chip */}
                  <View style={styles.chip}>
                    <View style={styles.chipLine} />
                    <View style={styles.chipLine} />
                  </View>
                  <View>
                    <Text style={styles.cardIssuer}>{card.issuer}</Text>
                    <Text style={styles.cardName}>{card.name}</Text>
                  </View>
                  <Text style={styles.cardNumber}>
                    {'····  ····  ····  '}{card.lastFour}
                  </Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.indexLabel}>
          {active + 1} / {VAULT_CARDS.length}
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  sageGlow: {
    position: 'absolute', top: -80, left: -80,
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(45,212,191,0.06)',
  },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingHorizontal: 20, paddingVertical: 16,
  },
  subtitle: {
    fontSize: 11, fontWeight: '700', color: colors.muted2,
    letterSpacing: 1.5, marginBottom: 4,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text },
  addBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },

  stackContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingBottom: TAB_BAR_HEIGHT,
  },
  stackedCard: {
    position: 'absolute',
    width: 300,
    height: 190,
    borderRadius: radii.xl,
    overflow: 'hidden',
  },
  cardGradient: {
    flex: 1, padding: 24, justifyContent: 'space-between',
  },
  cardSheen: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  chip: {
    width: 36, height: 26, borderRadius: 5,
    backgroundColor: '#D4AF37',
    justifyContent: 'center', paddingHorizontal: 4, gap: 3,
  },
  chipLine: {
    height: 1, backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cardIssuer: {
    fontSize: 12, fontWeight: '600',
    color: 'rgba(255,255,255,0.55)', letterSpacing: 1.5,
  },
  cardName: { fontSize: 22, fontWeight: '800', color: '#FFF', marginTop: 2 },
  cardNumber: {
    fontSize: 14, color: 'rgba(255,255,255,0.65)', letterSpacing: 2,
  },
  indexLabel: {
    textAlign: 'center', fontSize: 14, fontWeight: '600',
    color: colors.muted, paddingBottom: TAB_BAR_HEIGHT + 16,
  },
});
