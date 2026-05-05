/**
 * First-launch onboarding — three pages explaining the app's core idea.
 * Stores a flag in AsyncStorage so it only shows once.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Space } from '../constants/Colors';

export const ONBOARDED_KEY = '@stellartales/onboarded';

const { width: W } = Dimensions.get('window');

// ── Page content ───────────────────────────────────────────────────────────

const PAGES = [
  {
    icon: '✦',
    title: 'Your sky,\nits stories.',
    body: 'StellarTales reads the stars overhead tonight and tells you the myths, legends, and science behind each one — across six ancient cultures.',
    cta: 'Next',
  },
  {
    icon: '🌍',
    title: 'Six worlds\nof meaning.',
    body: 'Every star carries a different story depending on who was watching. Greek, Arabic, Babylonian, Chinese, Indian, and Indigenous traditions — tap any culture to hear their version.',
    cta: 'Next',
    cultures: ['Greek', 'Arabic', 'Babylonian', 'Chinese', 'Indian', 'Indigenous'],
  },
  {
    icon: '📍',
    title: 'Point. Find.\nDiscover.',
    body: 'StellarTales uses your location to know what\'s visible right now. The AR finder lets you point your phone at the sky and lock on to any object.',
    cta: 'Begin',
  },
] as const;

// ── Screen ─────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const dotAnim = useRef(PAGES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

  function goTo(next: number) {
    scrollRef.current?.scrollTo({ x: next * W, animated: true });
    // Animate dots
    Animated.parallel([
      Animated.timing(dotAnim[page], { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(dotAnim[next], { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
    setPage(next);
  }

  async function handleCta() {
    if (page < PAGES.length - 1) {
      goTo(page + 1);
    } else {
      await AsyncStorage.setItem(ONBOARDED_KEY, '1');
      router.replace('/(tabs)');
    }
  }

  const current = PAGES[page];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Space.background} />

      {/* Skip button (pages 0–1 only) */}
      {page < PAGES.length - 1 && (
        <TouchableOpacity
          style={styles.skip}
          onPress={async () => {
            await AsyncStorage.setItem(ONBOARDED_KEY, '1');
            router.replace('/(tabs)');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.skipLabel}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Scrollable pages */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {PAGES.map((p, i) => (
          <View key={i} style={[styles.page, { width: W }]}>
            <Text style={styles.pageIcon}>{p.icon}</Text>
            <Text style={styles.pageTitle}>{p.title}</Text>
            <Text style={styles.pageBody}>{p.body}</Text>

            {/* Culture chips on page 1 */}
            {'cultures' in p && (
              <View style={styles.cultureRow}>
                {p.cultures.map((c) => (
                  <View key={c} style={styles.cultureChip}>
                    <Text style={styles.cultureLabel}>{c}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.footer}>
        {/* Dot indicators */}
        <View style={styles.dots}>
          {PAGES.map((_, i) => {
            const width = dotAnim[i].interpolate({ inputRange: [0, 1], outputRange: [6, 20] });
            const bg    = dotAnim[i].interpolate({ inputRange: [0, 1], outputRange: [Space.cardBorder, Space.accent] });
            return (
              <Animated.View key={i} style={[styles.dot, { width, backgroundColor: bg }]} />
            );
          })}
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={handleCta} activeOpacity={0.85}>
          <Text style={styles.ctaLabel}>{current.cta}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Space.background,
  },
  skip: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipLabel: {
    color: Space.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  scroll: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 60,
    gap: 20,
  },
  pageIcon: {
    fontSize: 72,
    marginBottom: 8,
  },
  pageTitle: {
    color: Space.text,
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  pageBody: {
    color: Space.textSecondary,
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  cultureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  cultureChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Space.chipActive,
    borderWidth: 1,
    borderColor: Space.accent,
  },
  cultureLabel: {
    color: Space.accentBright,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 52,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Space.accent,
    alignItems: 'center',
  },
  ctaLabel: {
    color: Space.background,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
