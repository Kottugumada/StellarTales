/**
 * AudioPlayer — narrates a story body using OpenAI TTS (tts-1-hd, nova voice).
 *
 * Flow:
 *   1. Check local filesystem cache (keyed on a hash of the text).
 *   2. If missing, call OpenAI /v1/audio/speech, download the MP3 to cache.
 *   3. Play with expo-audio's useAudioPlayer.
 *
 * Falls back to expo-speech when:
 *   - EXPO_PUBLIC_OPENAI_API_KEY is absent
 *   - Network fetch fails
 */

import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
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

// ── Config ─────────────────────────────────────────────────────────────────

const OPENAI_KEY  = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const TTS_MODEL   = 'tts-1-hd';
const TTS_VOICE   = 'nova';      // warm, clear female voice
const CACHE_DIR   = `${FileSystem.cacheDirectory}tts/`;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Simple djb2 hash — good enough for a cache key */
function hashText(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
}

async function fetchTTSFile(text: string): Promise<string | null> {
  if (!OPENAI_KEY) return null;

  await ensureCacheDir();
  const key  = hashText(TTS_VOICE + text);
  const path = `${CACHE_DIR}${key}.mp3`;

  const cached = await FileSystem.getInfoAsync(path);
  if (cached.exists) return path;

  try {
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: TTS_MODEL, voice: TTS_VOICE, input: text }),
    });

    if (!res.ok) {
      console.warn('[AudioPlayer] TTS API error', res.status);
      return null;
    }

    const blob   = await res.blob();
    const reader = new FileReader();
    const base64: string = await new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    await FileSystem.writeAsStringAsync(path, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return path;
  } catch (err) {
    console.warn('[AudioPlayer] TTS fetch failed', err);
    return null;
  }
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  text: string | null;
}

type UIState = 'idle' | 'loading' | 'playing' | 'paused';

export function AudioPlayer({ text }: Props) {
  const [uiState,  setUiState]  = useState<UIState>('idle');
  const [elapsed,  setElapsed]  = useState(0);
  const [usingSpeech, setUsingSpeech] = useState(false); // fallback path

  // expo-audio player (used for OpenAI TTS path)
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const elapsedRef = useRef(0);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeText = useRef<string | null>(null);

  // Reset when text changes
  useEffect(() => {
    handleStop();
    activeText.current = null;
  }, [text]);

  // Sync expo-audio playback state → uiState
  useEffect(() => {
    if (usingSpeech) return;
    if (status.playing) {
      setUiState('playing');
      if (!timerRef.current) startTimer();
    } else if (status.didJustFinish) {
      stopTimer();
      elapsedRef.current = 0;
      setElapsed(0);
      setUiState('idle');
    }
  }, [status.playing, status.didJustFinish, usingSpeech]);

  function startTimer() {
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }

  function handleStop() {
    stopTimer();
    if (usingSpeech) {
      Speech.stop();
    } else {
      player.pause();
      player.seekTo(0);
    }
    elapsedRef.current = 0;
    setElapsed(0);
    setUiState('idle');
  }

  async function handlePress() {
    if (!text) return;

    // Pause / resume (expo-audio path)
    if (!usingSpeech) {
      if (uiState === 'playing') {
        player.pause();
        stopTimer();
        setUiState('paused');
        return;
      }
      if (uiState === 'paused') {
        player.play();
        startTimer();
        setUiState('playing');
        return;
      }
    }

    // Pause (speech fallback, iOS only)
    if (usingSpeech && uiState === 'playing') {
      if (Platform.OS === 'ios') {
        await Speech.pause();
        stopTimer();
        setUiState('paused');
      } else {
        handleStop();
      }
      return;
    }
    if (usingSpeech && uiState === 'paused' && Platform.OS === 'ios') {
      await Speech.resume();
      startTimer();
      setUiState('playing');
      return;
    }

    // Fresh start
    setUiState('loading');
    elapsedRef.current = 0;
    setElapsed(0);

    // Try OpenAI TTS
    const filePath = await fetchTTSFile(text);

    if (filePath) {
      setUsingSpeech(false);
      activeText.current = text;
      player.replace({ uri: filePath });
      player.play();
      startTimer();
      setUiState('playing');
    } else {
      // Fallback: expo-speech
      setUsingSpeech(true);
      Speech.speak(text, {
        language: 'en-US',
        rate: 0.9,
        pitch: 1.0,
        onStart: () => { setUiState('playing'); startTimer(); },
        onDone:  () => { stopTimer(); elapsedRef.current = 0; setElapsed(0); setUiState('idle'); },
        onStopped: () => { stopTimer(); setUiState('idle'); },
        onError:   () => { stopTimer(); setUiState('idle'); },
      });
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const hasText  = !!text;
  const isPlaying = uiState === 'playing';
  const icon = isPlaying ? '⏸' : '▶';

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const label = !hasText
    ? 'Story loading…'
    : uiState === 'loading'
    ? 'Preparing…'
    : isPlaying
    ? `Listening  ${fmt(elapsed)}`
    : uiState === 'paused'
    ? `Paused  ${fmt(elapsed)}`
    : 'Tap to listen';

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.button, !hasText && styles.buttonDisabled]}
        onPress={handlePress}
        disabled={!hasText || uiState === 'loading'}
        activeOpacity={0.8}
      >
        {uiState === 'loading' ? (
          <ActivityIndicator size="small" color={Space.background} />
        ) : (
          <Text style={styles.icon}>{icon}</Text>
        )}
      </TouchableOpacity>

      <View style={styles.right}>
        <Text style={[styles.label, !hasText && styles.labelMuted]}>{label}</Text>
        {isPlaying && (
          <View style={styles.wave}>
            <View style={[styles.bar, styles.bar1]} />
            <View style={[styles.bar, styles.bar2]} />
            <View style={[styles.bar, styles.bar3]} />
          </View>
        )}
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  button: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Space.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: Space.chip },
  icon:   { color: Space.background, fontSize: 14 },
  right:  { flex: 1, gap: 5 },
  label:  { color: Space.textSecondary, fontSize: 12 },
  labelMuted: { color: Space.textMuted },
  wave:   { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 12 },
  bar:    { width: 3, backgroundColor: Space.accent, borderRadius: 2 },
  bar1:   { height: 6 },
  bar2:   { height: 12 },
  bar3:   { height: 8 },
});
