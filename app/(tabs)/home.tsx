import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GlassCard from '@/components/GlassCard';
import Pill from '@/components/Pill';
import PrimaryButton from '@/components/PrimaryButton';
import MerchantRow from '@/components/MerchantRow';
import ParallaxCard from '@/components/ParallaxCard';
import YieldRing from '@/components/YieldRing';
import { recommend, Channel, RecommendationOutput } from '@/engine/recommend';
import { MERCHANTS } from '@/data/merchants';
import { colors, radii, fonts, TAB_BAR_HEIGHT } from '@/theme/tokens';

const CHANNELS: Channel[] = ['online', 'offline', 'upi', 'portal'];

export default function HomeScreen() {
  const [channel, setChannel] = useState<Channel>('online');
  const [query, setQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const amount = 10000;

  const filtered = useMemo(
    () =>
      query
        ? MERCHANTS.filter((m) =>
            m.name.toLowerCase().includes(query.toLowerCase()),
          ).slice(0, 4)
        : MERCHANTS.slice(0, 4),
    [query],
  );

  const DEFAULT_VERDICT: RecommendationOutput = {
    bestForLabel: 'Online Shopping',
    issuer: 'HDFC',
    cardName: 'Infinia',
    yieldPct: 0,
    rewardType: 'Cashback',
    route: 'Direct Purchase',
    estSavings: 720,
    ringUsed: 0,
    logicChips: ['5X Rewards', 'No Cap', 'Instant Credit'],
    terms:
      'Reward points credited within 30 days of statement generation. Minimum transaction value ₹150. Subject to merchant category code validation.',
  };

  const verdict = useMemo(
    () =>
      selectedMerchant
        ? recommend({ channel, merchantQuery: selectedMerchant, amount })
        : DEFAULT_VERDICT,
    [channel, selectedMerchant, amount],
  );

  return (
    <View style={styles.bg}>
      <View style={styles.sageGlow} />
      <View style={styles.goldGlow} />

      <SafeAreaView style={styles.flex} edges={['top']}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: TAB_BAR_HEIGHT + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Command Center ──────────────────────────── */}
          <GlassCard style={styles.section}>
            {/* search */}
            <View style={styles.searchRow}>
              <View style={styles.searchIcon}>
                <Feather name="search" size={16} color={colors.gold} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Where are you spending?"
                placeholderTextColor={colors.muted2}
                value={query}
                onChangeText={(t) => {
                  setQuery(t);
                  if (!t) setSelectedMerchant('');
                }}
              />
            </View>

            {/* hint */}
            <View style={styles.hintRow}>
              <Text style={styles.hintText}>Type to search merchants</Text>
              <Text style={styles.channelReadout}>{channel.toUpperCase()}</Text>
            </View>

            {/* channel chips */}
            <View style={styles.chipRow}>
              {CHANNELS.map((ch) => (
                <Pill
                  key={ch}
                  label={ch.charAt(0).toUpperCase() + ch.slice(1)}
                  active={channel === ch}
                  onPress={() => setChannel(ch)}
                />
              ))}
            </View>

            {/* merchants */}
            <View style={styles.merchantList}>
              {filtered.map((m) => (
                <MerchantRow
                  key={m.id}
                  name={m.name}
                  tag={m.tag}
                  initials={m.initials}
                  color={m.color}
                  onPress={() => {
                    setSelectedMerchant(m.name);
                    setQuery(m.name);
                  }}
                />
              ))}
            </View>
          </GlassCard>

          {/* ── Verdict ─────────────────────────────────── */}
          <View style={styles.verdictSection}>
              {/* header */}
              <View style={styles.verdictHeader}>
                <View>
                  <Text style={styles.recLabel}>RECOMMENDATION</Text>
                  <Text style={styles.verdictTitle}>The Verdict</Text>
                </View>
                <Pill label={`Best for ${verdict.bestForLabel}`} small active />
              </View>

              {/* hero card */}
              <GlassCard style={styles.heroCard}>
                <View style={styles.heroRow}>
                  <ParallaxCard
                    issuer={verdict.issuer}
                    cardName={verdict.cardName}
                  />
                  <YieldRing percentage={verdict.yieldPct} />
                </View>

                {/* logic chips */}
                <View style={styles.logicChips}>
                  {verdict.logicChips.map((chip, i) => (
                    <Pill key={i} label={chip} small />
                  ))}
                </View>

                {/* cta */}
                <View style={styles.ctaRow}>
                  <PrimaryButton
                    title="Direct Purchase"
                    onPress={() => {}}
                    style={styles.ctaBtn}
                  />
                  <PrimaryButton
                    title="Show terms"
                    variant="secondary"
                    onPress={() => setShowTerms(true)}
                    style={styles.ctaBtn}
                  />
                </View>

                {/* meta */}
                <View style={styles.metaRow}>
                  <View>
                    <Text style={styles.metaLabel}>Est. Savings</Text>
                    <Text style={styles.metaValue}>
                      ₹{verdict.estSavings} on ₹{(amount / 1000).toFixed(0)}k
                    </Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View>
                    <Text style={styles.metaLabel}>Reward Type</Text>
                    <View style={styles.metaRight}>
                      <View style={styles.goldDot} />
                      <Text style={styles.metaValue}>{verdict.rewardType}</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </View>
        </ScrollView>
      </SafeAreaView>

      {/* ── Terms modal ──────────────────────────────── */}
      <Modal visible={showTerms} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Terms & Conditions</Text>
            <Text style={styles.modalBody}>{verdict.terms}</Text>
            <PrimaryButton title="Got it" onPress={() => setShowTerms(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: { paddingTop: 8 },
  sageGlow: {
    position: 'absolute', top: -100, left: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(45,212,191,0.06)',
  },
  goldGlow: {
    position: 'absolute', top: -50, right: -100,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(212,175,55,0.04)',
  },
  section: { marginHorizontal: 16, marginTop: 8 },

  /* search */
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bg, borderRadius: radii.md,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 12,
  },
  searchIcon: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 10 },

  /* hint */
  hintRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  hintText: { fontSize: 12, color: colors.muted2 },
  channelReadout: {
    fontSize: 11, fontFamily: fonts.mono, fontWeight: '700',
    color: colors.text, letterSpacing: 1,
  },

  /* chips */
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 8 },

  /* merchants */
  merchantList: { marginTop: 4 },

  /* verdict */
  verdictSection: { marginHorizontal: 16, marginTop: 24 },
  verdictHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 14,
  },
  recLabel: {
    fontSize: 11, fontWeight: '700', color: colors.muted2,
    letterSpacing: 1.5, marginBottom: 4,
  },
  verdictTitle: { fontSize: 24, fontWeight: '800', color: colors.text },

  /* hero */
  heroCard: {},
  heroRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  logicChips: {
    flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16,
  },
  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  ctaBtn: { flex: 1 },

  /* meta */
  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 14, borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  metaLabel: { fontSize: 12, color: colors.muted, marginBottom: 2 },
  metaValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  metaDivider: {
    width: 1, height: 30, backgroundColor: 'rgba(0,0,0,0.06)',
    marginHorizontal: 20,
  },
  metaRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  goldDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold,
  },

  /* modal */
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl, padding: 24, paddingBottom: 40,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.muted2, alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 12,
  },
  modalBody: {
    fontSize: 14, color: colors.muted, lineHeight: 22, marginBottom: 24,
  },
});
