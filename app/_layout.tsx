import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack, useSegments, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { fontAssets } from '@/theme/fonts';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AuthGate() {
  const { isLoggedIn } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const inTabs = segments[0] === '(tabs)';
    if (isLoggedIn && !inTabs) {
      router.replace('/(tabs)/home');
    } else if (!isLoggedIn && inTabs) {
      router.replace('/login');
    }
  }, [isLoggedIn, segments]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);

  useEffect(() => {
    // fontAssets may be empty → fontsLoaded is true immediately
    if (fontsLoaded || Object.keys(fontAssets).length === 0) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return (
    <AuthProvider>
      <AuthGate />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
