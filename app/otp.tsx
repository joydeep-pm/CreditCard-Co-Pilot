import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import GlassCard from '@/components/GlassCard';
import PrimaryButton from '@/components/PrimaryButton';
import { useAuth } from '@/context/AuthContext';
import { colors, radii, shadows } from '@/theme/tokens';

/* ── digit slot ─────────────────────────────────────────── */
function Slot({ value }: { value: string }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (value) {
      scale.value = withSequence(
        withTiming(1.15, { duration: 80 }),
        withTiming(1, { duration: 80 }),
      );
    }
  }, [value]);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.slot, value ? styles.slotFilled : null, anim]}>
      <Text style={styles.slotText}>{value ? '•' : ''}</Text>
    </Animated.View>
  );
}

/* ── keypad button ──────────────────────────────────────── */
function Key({
  label,
  onPress,
}: {
  label: string | React.ReactNode;
  onPress: () => void;
}) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <Pressable
      onPressIn={() => { s.value = withTiming(0.88, { duration: 50 }); }}
      onPressOut={() => { s.value = withTiming(1, { duration: 100 }); }}
      onPress={onPress}
      android_ripple={{ color: 'rgba(45,212,191,0.15)', borderless: true, radius: 32 }}
    >
      <Animated.View style={[styles.key, anim]}>
        {typeof label === 'string' ? (
          <Text style={styles.keyText}>{label}</Text>
        ) : (
          label
        )}
      </Animated.View>
    </Pressable>
  );
}

/* ── screen ─────────────────────────────────────────────── */
export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { login, setPhone: setAuthPhone } = useAuth();
  const [otp, setOtp] = useState('');

  const masked = phone
    ? `+91 ••••••${phone.slice(-4)}`
    : '+91 ••••••7039';

  const addDigit = useCallback(
    (d: string) => setOtp((p) => (p.length < 4 ? p + d : p)),
    [],
  );
  const backspace = useCallback(() => setOtp((p) => p.slice(0, -1)), []);

  const verify = useCallback(() => {
    if (phone) setAuthPhone(phone);
    login();
    router.replace('/(tabs)/home');
  }, [phone, login, setAuthPhone]);

  const valid = otp.length === 4;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.sageGlow} />
      <View style={styles.goldGlow} />

      <View style={styles.center}>
        <GlassCard>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>Sent to {masked}</Text>

          {/* slots */}
          <View style={styles.slotsRow}>
            {[0, 1, 2, 3].map((i) => (
              <Slot key={i} value={otp[i] ?? ''} />
            ))}
          </View>

          {/* keypad */}
          <View style={styles.keypad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
              <Key key={d} label={d} onPress={() => addDigit(d)} />
            ))}
            <Key
              label={<Feather name="delete" size={20} color={colors.text} />}
              onPress={backspace}
            />
            <Key label="0" onPress={() => addDigit('0')} />
            <Key
              label={
                <Feather
                  name="check"
                  size={20}
                  color={valid ? colors.sage : colors.muted2}
                />
              }
              onPress={() => { if (valid) verify(); }}
            />
          </View>

          <PrimaryButton
            title="Verify & Continue"
            onPress={verify}
            disabled={!valid}
          />

          <Pressable style={styles.resend}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </Pressable>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  sageGlow: {
    position: 'absolute', top: -100, left: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(45,212,191,0.08)',
  },
  goldGlow: {
    position: 'absolute', top: -50, right: -100,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: {
    fontSize: 28, fontWeight: '800', color: colors.text,
    textAlign: 'center', marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, color: colors.muted,
    textAlign: 'center', marginBottom: 28,
  },
  slotsRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 16, marginBottom: 28,
  },
  slot: {
    width: 50, height: 54, borderRadius: radii.md,
    backgroundColor: colors.bg, borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  slotFilled: {
    borderColor: colors.sage,
    backgroundColor: 'rgba(45,212,191,0.06)',
  },
  slotText: { fontSize: 24, fontWeight: '700', color: colors.text },
  keypad: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 10,
    alignSelf: 'center', maxWidth: 230, marginBottom: 24,
  },
  key: {
    width: 66, height: 50, borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.sm,
  },
  keyText: { fontSize: 22, fontWeight: '600', color: colors.text },
  resend: { alignItems: 'center', paddingVertical: 12 },
  resendText: { color: colors.sage, fontSize: 14, fontWeight: '600' },
});
