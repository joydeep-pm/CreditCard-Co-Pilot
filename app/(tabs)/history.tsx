import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GlassCard from '@/components/GlassCard';
import { colors, TAB_BAR_HEIGHT } from '@/theme/tokens';

export default function HistoryScreen() {
  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.flex} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>ACTIVITY</Text>
          <Text style={styles.title}>History</Text>
        </View>

        <View style={styles.center}>
          <GlassCard style={styles.card}>
            <View style={styles.iconWrap}>
              <Feather name="clock" size={36} color={colors.sage} />
            </View>
            <Text style={styles.heading}>Coming Soon</Text>
            <Text style={styles.sub}>
              Your recommendation history and{'\n'}spending insights will appear here.
            </Text>
          </GlassCard>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingTop: 16,
  },
  subtitle: {
    fontSize: 11, fontWeight: '700', color: colors.muted2,
    letterSpacing: 1.5, marginBottom: 4,
  },
  title: {
    fontSize: 26, fontWeight: '800', color: colors.text,
  },
  center: {
    flex: 1, justifyContent: 'center',
    paddingHorizontal: 20, paddingBottom: TAB_BAR_HEIGHT,
  },
  card: { alignItems: 'center' },
  iconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(45,212,191,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  heading: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  sub: {
    fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22,
  },
});
