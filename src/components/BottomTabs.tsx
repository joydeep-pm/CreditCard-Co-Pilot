import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, radii, shadows } from '@/theme/tokens';

const ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  home: 'home',
  vault: 'lock',
  history: 'clock',
  settings: 'settings',
};

export default function BottomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={[styles.pillOuter, shadows.lg]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        ) : null}
        <View style={[styles.pill, Platform.OS !== 'ios' && styles.androidPill]}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const label = descriptors[route.key].options.title ?? route.name;
            const icon = ICONS[route.name] ?? 'circle';

            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  if (!focused) navigation.navigate(route.name);
                }}
                style={[styles.tab, focused && styles.activeTab]}
              >
                <Feather
                  name={icon}
                  size={20}
                  color={focused ? colors.sage : colors.muted2}
                />
                {focused && (
                  <Text style={styles.activeLabel}>{label}</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pillOuter: {
    borderRadius: radii.pill,
    overflow: 'hidden',
    width: '100%',
  },
  pill: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  androidPill: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: radii.pill,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: 6,
  },
  activeTab: {
    backgroundColor: 'rgba(45,212,191,0.12)',
    paddingHorizontal: 20,
  },
  activeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.sage,
  },
});
