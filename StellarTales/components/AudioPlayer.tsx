import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Space } from '../constants/Colors';

interface Props {
  text: string | null; // story body to read aloud; null = no story loaded yet
}

type PlayState = 'idle' | 'loading' | 'playing' | 'paused';

export function AudioPlayer({ text }: Props) {
  const [playState, setPlayState] = useState<PlayState>('idle');
  const elapsedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Stop speech and clear timer when text changes or component unmounts
  useEffect(() => {
    return () => {
      Speech.stop();
      clearTimer();
    };
  }, [text]);

  function startTimer() {
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }

  function clearTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function handlePress() {
    if (!text) return;

    // Pause (iOS supports native pause; Android: stop and restart isn't great, so just stop)
    if (playState === 'playing') {
      if (Platform.OS === 'ios') {
        await Speech.pause();
        clearTimer();
        setPlayState('paused');
      } else {
        await Speech.stop();
        clearTimer();
        elapsedRef.current = 0;
        setElapsed(0);
        setPlayState('idle');
      }
      return;
    }

    // Resume (iOS only)
    if (playState === 'paused' && Platform.OS === 'ios') {
      await Speech.resume();
      startTimer();
      setPlayState('playing');
      return;
    }

    // Start fresh
    setPlayState('loading');
    elapsedRef.current = 0;
    setElapsed(0);

    Speech.speak(text, {
      language: 'en-US',
      rate: 0.9,   // slightly slower than default — easier to follow
      pitch: 1.0,
      onStart: () => {
        setPlayState('playing');
        startTimer();
      },
      onDone: () => {
        clearTimer();
        elapsedRef.current = 0;
        setElapsed(0);
        setPlayState('idle');
      },
      onStopped: () => {
        clearTimer();
        setPlayState('idle');
      },
      onError: () => {
        clearTimer();
        setPlayState('idle');
      },
    });
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const hasText = !!text;
  const isPlaying = playState === 'playing';
  const icon = isPlaying ? '⏸' : playState === 'paused' ? '▶' : '▶';

  const label = !hasText
    ? 'Story loading…'
    : playState === 'loading'
    ? 'Starting…'
    : isPlaying
    ? `Listening  ${formatTime(elapsed)}`
    : playState === 'paused'
    ? `Paused  ${formatTime(elapsed)}`
    : 'Tap to listen';

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.button, !hasText && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={!hasText || playState === 'loading'}
        activeOpacity={0.8}
      >
        {playState === 'loading' ? (
          <ActivityIndicator size="small" color={Space.background} />
        ) : (
          <Text style={styles.icon}>{icon}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <Text style={[styles.label, !hasText && styles.labelMuted]}>{label}</Text>
        {isPlaying && (
          <View style={styles.track}>
            <View style={[styles.waveBar, styles.waveBar1]} />
            <View style={[styles.waveBar, styles.waveBar2]} />
            <View style={[styles.waveBar, styles.waveBar3]} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Space.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Space.chip,
  },
  icon: {
    color: Space.background,
    fontSize: 14,
  },
  progressContainer: {
    flex: 1,
    gap: 6,
  },
  label: {
    color: Space.textSecondary,
    fontSize: 12,
  },
  labelMuted: {
    color: Space.textMuted,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 12,
  },
  waveBar: {
    width: 3,
    backgroundColor: Space.accent,
    borderRadius: 2,
  },
  waveBar1: { height: 6 },
  waveBar2: { height: 12 },
  waveBar3: { height: 8 },
});
