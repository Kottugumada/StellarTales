import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Space } from '../constants/Colors';

interface Props {
  filePath: string | null; // local file URI or null if not cached
}

type PlayState = 'idle' | 'loading' | 'playing' | 'paused';

export function AudioPlayer({ filePath }: Props) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playState, setPlayState] = useState<PlayState>('idle');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Unload sound when filePath changes or component unmounts
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      soundRef.current = null;
      setPlayState('idle');
      setPosition(0);
      setDuration(0);
    };
  }, [filePath]);

  async function handlePress() {
    if (!filePath) return;

    if (playState === 'playing') {
      await soundRef.current?.pauseAsync();
      setPlayState('paused');
      return;
    }

    if (playState === 'paused') {
      await soundRef.current?.playAsync();
      setPlayState('playing');
      return;
    }

    // Load fresh
    setPlayState('loading');
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(
        { uri: filePath },
        { shouldPlay: true },
        (status) => {
          if (!status.isLoaded) return;
          setPosition(status.positionMillis);
          setDuration(status.durationMillis ?? 0);
          if (status.didJustFinish) {
            setPlayState('idle');
            setPosition(0);
          }
        },
      );
      soundRef.current = sound;
      setPlayState('playing');
    } catch {
      setPlayState('idle');
    }
  }

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const hasAudio = !!filePath;
  const icon = playState === 'playing' ? '⏸' : '▶';
  const timeLabel =
    duration > 0
      ? `${formatTime(position)} / ${formatTime(duration)}`
      : hasAudio
      ? 'Tap to listen'
      : 'Audio coming soon';

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.button, !hasAudio && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={!hasAudio || playState === 'loading'}
        activeOpacity={0.8}
      >
        {playState === 'loading' ? (
          <ActivityIndicator size="small" color={Space.background} />
        ) : (
          <Text style={styles.icon}>{icon}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <Text style={[styles.timeLabel, !hasAudio && styles.timeLabelMuted]}>
          {timeLabel}
        </Text>
        {duration > 0 && (
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(position / duration) * 100}%` }]} />
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
    gap: 4,
  },
  timeLabel: {
    color: Space.textSecondary,
    fontSize: 12,
  },
  timeLabelMuted: {
    color: Space.textMuted,
  },
  track: {
    height: 2,
    backgroundColor: Space.cardBorder,
    borderRadius: 1,
  },
  fill: {
    height: 2,
    backgroundColor: Space.accent,
    borderRadius: 1,
  },
});
