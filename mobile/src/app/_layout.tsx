import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_800ExtraBold,
} from '@expo-google-fonts/cairo';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { LanguageProvider, useLang } from '@/i18n/LanguageContext';
import { AuthProvider, useAuth } from '@/lib/auth';
import { colors } from '@/theme';
import { RouteError } from '@/features/common/RouteError';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Rendered by Expo Router when any screen throws.
export { RouteError as ErrorBoundary };

function RootNavigator({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { ready: authReady, user, token } = useAuth();
  const { ready: langReady, isRTL } = useLang();
  const ready = fontsLoaded && authReady && langReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  const signedIn = !!(user && token);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: isRTL ? 'slide_from_left' : 'slide_from_right',
        }}
      >
        {/* Signed out: the way in. The first available screen is where a user
            lands after signing out, so `welcome` leads this group. */}
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="forgot-password" />
        </Stack.Protected>

        {/* Signed in: the student app. */}
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="launcher" />
          <Stack.Screen name="quiz" options={{ gestureEnabled: false, animation: 'fade' }} />
          <Stack.Screen name="summaries/[slug]" />
          <Stack.Screen name="subscribe" />
          <Stack.Screen name="payment/callback" />
          <Stack.Screen name="account" />
          <Stack.Screen name="notifications" />
        </Stack.Protected>

        {/* Reachable either way: invite links, price pages, information. */}
        <Stack.Screen name="signup/index" />
        <Stack.Screen name="signup/[token]" />
        <Stack.Screen name="join/[token]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          {/* A font that fails to load must not leave the app on the splash. */}
          <RootNavigator fontsLoaded={fontsLoaded || !!fontError} />
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
