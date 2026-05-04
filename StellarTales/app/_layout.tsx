import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ONBOARDED_KEY } from './onboarding';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({});
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!fontsLoaded) return;

    // Check onboarding flag while splash is still visible.
    // Stack is already mounted (we don't gate on ready), so router.replace is safe.
    AsyncStorage.getItem(ONBOARDED_KEY).then((flag) => {
      setReady(true);
      SplashScreen.hideAsync();
      if (!flag) {
        router.replace('/onboarding');
      }
    });
  }, [fontsLoaded]);

  // Keep splash up until fonts are done (AsyncStorage check runs in parallel)
  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)"      options={{ headerShown: false }} />
        <Stack.Screen name="onboarding"  options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="object/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="ar/[id]"     options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
