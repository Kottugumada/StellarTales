/**
 * AR Sky Finder — points the user toward a sky object using camera + sensors.
 *
 * Sensors used:
 *   Accelerometer  → device tilt → altitude above horizon (degrees)
 *   Magnetometer   → compass heading → azimuth from North (degrees)
 *
 * The reticle shows how far off the target is and animates gold within 5°.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Accelerometer, Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { ANCHOR_OBJECTS } from '../../data/anchorObjects';
import { getObjectPosition } from '../../services/skyEngine';
import { Space } from '../../constants/Colors';

// ── Constants ──────────────────────────────────────────────────────────────

const { width: W, height: H } = Dimensions.get('window');
const RAD       = Math.PI / 180;
const LOCK_DEG  = 5;    // degrees — "locked on" zone
const CLOSE_DEG = 20;   // degrees — show approximate hint

// ── Math helpers ───────────────────────────────────────────────────────────

function wrapAngle(a: number): number {
  return ((a + 540) % 360) - 180; // [-180, 180]
}

/** Compass heading from raw magnetometer (degrees, 0 = North) */
function magHeading(x: number, y: number): number {
  let h = Math.atan2(y, x) / RAD;
  return (h + 360) % 360;
}

/**
 * Altitude above horizon from accelerometer (degrees).
 * Phone in portrait tilted back toward sky:
 *   upright = 0°, 45° back = 45°, pointing straight up = 90°
 */
function accAltitude(x: number, y: number, z: number): number {
  return Math.atan2(-z, Math.sqrt(x * x + y * y)) / RAD;
}

// ── Screen ─────────────────────────────────────────────────────────────────

export default function ARScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const object = ANCHOR_OBJECTS.find((o) => o.id === id);

  // Sky position of target
  const [skyPos, setSkyPos] = useState<{ altitude: number; azimuth: number } | null>(null);
  const [belowHorizon, setBelowHorizon] = useState(false);

  // Live sensor readings
  const [deviceAlt, setDeviceAlt] = useState(0);
  const [deviceAz,  setDeviceAz]  = useState(0);

  // Glow animation
  const glowAnim   = useRef(new Animated.Value(0)).current;
  const prevLocked = useRef(false);

  // Derived
  const deltaAlt  = skyPos ? skyPos.altitude - deviceAlt : 0;
  const deltaAz   = skyPos ? wrapAngle(skyPos.azimuth - deviceAz) : 0;
  const totalDeg  = Math.sqrt(deltaAlt * deltaAlt + deltaAz * deltaAz);
  const locked    = totalDeg < LOCK_DEG;

  // Arrow direction on screen (screen Y is flipped vs altitude)
  const arrowAngleDeg = Math.atan2(-deltaAlt, deltaAz) / RAD;

  // Animate glow on lock/unlock
  useEffect(() => {
    if (locked !== prevLocked.current) {
      prevLocked.current = locked;
      Animated.timing(glowAnim, {
        toValue: locked ? 1 : 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [locked]);

  // ── Compute sky position ──────────────────────────────────────────────────

  useEffect(() => {
    if (!object) return;
    (async () => {
      let lat = 40.7128, lon = -74.006;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;
        }
      } catch { /* use default */ }

      const pos = getObjectPosition(object.id, lat, lon, new Date());
      if (pos) {
        setSkyPos(pos);
        if (pos.altitude < 5) setBelowHorizon(true);
      }
    })();
  }, [object?.id]);

  // ── Sensors ───────────────────────────────────────────────────────────────

  useEffect(() => {
    Accelerometer.setUpdateInterval(80);
    Magnetometer.setUpdateInterval(80);

    const accSub = Accelerometer.addListener(({ x, y, z }) => {
      setDeviceAlt(accAltitude(x, y, z));
    });
    const magSub = Magnetometer.addListener(({ x, y }) => {
      setDeviceAz(magHeading(x, y));
    });
    return () => { accSub.remove(); magSub.remove(); };
  }, []);

  // ── Permission gate ───────────────────────────────────────────────────────

  if (!object) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Object not found</Text>
      </View>
    );
  }

  if (!cameraPermission) return <View style={styles.centered} />;

  if (!cameraPermission.granted) {
    return (
      <View style={styles.centered}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonSmall}>
          <Text style={styles.backIcon}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.permTitle}>Camera Access</Text>
        <Text style={styles.permBody}>
          StellarTales overlays a sky guide on your live camera feed to help you find{' '}
          <Text style={{ color: Space.accentBright }}>{object.name}</Text>.
        </Text>
        <TouchableOpacity style={styles.permButton} onPress={requestCameraPermission}>
          <Text style={styles.permButtonLabel}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Animated values ───────────────────────────────────────────────────────

  const reticleColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Space.textSecondary, Space.accentBright],
  });
  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] });
  const glowScale   = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.6] });

  const distLabel = locked
    ? '✦  Locked on'
    : !skyPos
    ? 'Locating…'
    : totalDeg < CLOSE_DEG
    ? `${totalDeg.toFixed(1)}° away`
    : `${totalDeg.toFixed(0)}° away`;

  const hint = locked || !skyPos ? '' :
    Math.abs(deltaAz) >= Math.abs(deltaAlt)
      ? deltaAz > 0 ? 'Rotate right →' : '← Rotate left'
      : deltaAlt > 0 ? '↑ Tilt up' : 'Tilt down ↓';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Camera */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      {/* Dark top/bottom overlays */}
      <View style={styles.topGradient} pointerEvents="none" />
      <View style={styles.bottomGradient} pointerEvents="none" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backCircle} activeOpacity={0.8}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.objectName}>{object.name}</Text>
          <Text style={styles.objectSubtitle}>{object.subtitle}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Below-horizon warning */}
      {belowHorizon && (
        <View style={styles.warningBanner} pointerEvents="none">
          <Text style={styles.warningText}>
            Below the horizon right now · Showing direction anyway
          </Text>
        </View>
      )}

      {/* ── Reticle ── */}
      <View style={styles.reticleWrap} pointerEvents="none">
        {/* Glow pulse */}
        <Animated.View style={[styles.glowRing, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />

        {/* Circle + dot + ticks */}
        <Animated.View style={[styles.ring, { borderColor: reticleColor }]}>
          <Animated.View style={[styles.dot, { backgroundColor: reticleColor }]} />
          <Animated.View style={[styles.tick, styles.tTop,    { backgroundColor: reticleColor }]} />
          <Animated.View style={[styles.tick, styles.tBottom, { backgroundColor: reticleColor }]} />
          <Animated.View style={[styles.tick, styles.tLeft,   { backgroundColor: reticleColor }]} />
          <Animated.View style={[styles.tick, styles.tRight,  { backgroundColor: reticleColor }]} />
        </Animated.View>
      </View>

      {/* ── Arrow ── (hidden when locked or no position yet) */}
      {!locked && skyPos && (
        <View style={styles.arrowWrap} pointerEvents="none">
          <Text style={[styles.arrow, { transform: [{ rotate: `${arrowAngleDeg}deg` }] }]}>➤</Text>
          {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        </View>
      )}

      {/* ── HUD ── */}
      <View style={styles.hud}>
        <View style={[styles.badge, locked && styles.badgeLocked]}>
          <Text style={[styles.badgeText, locked && styles.badgeTextLocked]}>{distLabel}</Text>
        </View>

        {skyPos && (
          <View style={styles.pills}>
            <Pill label="TARGET" value={`${skyPos.altitude.toFixed(1)}° alt · ${skyPos.azimuth.toFixed(1)}° az`} />
            <Pill label="DEVICE" value={`${deviceAlt.toFixed(1)}° alt · ${deviceAz.toFixed(1)}° az`} />
          </View>
        )}
      </View>
    </View>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillLabel}>{label}</Text>
      <Text style={styles.pillValue}>{value}</Text>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const RETICLE_SIZE = 90;
const RETICLE_TOP  = H / 2 - RETICLE_SIZE / 2;
const RETICLE_LEFT = W / 2 - RETICLE_SIZE / 2;

const styles = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, backgroundColor: Space.background, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorText: { color: Space.textSecondary, fontSize: 16 },

  // Permission
  backButtonSmall: { position: 'absolute', top: Platform.OS === 'ios' ? 56 : 36, left: 20 },
  permTitle:  { color: Space.text, fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  permBody:   { color: Space.textSecondary, fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 28 },
  permButton: {
    backgroundColor: Space.chipActive,
    borderWidth: 1,
    borderColor: Space.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  permButtonLabel: { color: Space.accent, fontSize: 15, fontWeight: '700' },

  // Overlays
  topGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 180,
    backgroundColor: 'rgba(8,11,26,0.72)',
  },
  bottomGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 220,
    backgroundColor: 'rgba(8,11,26,0.72)',
  },

  // Header
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center',
  },
  backCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon:     { color: Space.accent, fontSize: 20 },
  headerTitle:  { flex: 1, alignItems: 'center' },
  objectName:   { color: Space.text, fontSize: 19, fontWeight: '700', letterSpacing: 0.4 },
  objectSubtitle: { color: Space.textSecondary, fontSize: 12, marginTop: 2 },

  // Warning
  warningBanner: {
    position: 'absolute', top: 130, left: 24, right: 24,
    backgroundColor: 'rgba(201,168,76,0.18)',
    borderWidth: 1, borderColor: Space.accent,
    borderRadius: 10, padding: 9,
  },
  warningText: { color: Space.accentBright, fontSize: 12, textAlign: 'center' },

  // Reticle
  reticleWrap: {
    position: 'absolute',
    top: RETICLE_TOP, left: RETICLE_LEFT,
    width: RETICLE_SIZE, height: RETICLE_SIZE,
    alignItems: 'center', justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: RETICLE_SIZE, height: RETICLE_SIZE,
    borderRadius: RETICLE_SIZE / 2,
    backgroundColor: Space.accentBright,
  },
  ring: {
    width: RETICLE_SIZE - 10, height: RETICLE_SIZE - 10,
    borderRadius: (RETICLE_SIZE - 10) / 2,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  tick:    { position: 'absolute' },
  tTop:    { top: 2,  left: '50%', width: 2, height: 10, marginLeft: -1 },
  tBottom: { bottom: 2, left: '50%', width: 2, height: 10, marginLeft: -1 },
  tLeft:   { left: 2,  top: '50%', width: 10, height: 2, marginTop: -1 },
  tRight:  { right: 2, top: '50%', width: 10, height: 2, marginTop: -1 },

  // Arrow
  arrowWrap: {
    position: 'absolute',
    top: H / 2 - 120, left: 0, right: 0,
    alignItems: 'center', gap: 4,
  },
  arrow: { color: Space.accent, fontSize: 28 },
  hint:  { color: Space.textSecondary, fontSize: 13, fontWeight: '500' },

  // HUD
  hud: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 52 : 28,
    left: 20, right: 20,
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 22, paddingVertical: 9,
    borderRadius: 24,
    backgroundColor: 'rgba(30,42,74,0.85)',
    borderWidth: 1, borderColor: Space.cardBorder,
  },
  badgeLocked: { backgroundColor: 'rgba(201,168,76,0.22)', borderColor: Space.accentBright },
  badgeText:       { color: Space.textSecondary, fontSize: 14, fontWeight: '600' },
  badgeTextLocked: { color: Space.accentBright,  fontSize: 15, fontWeight: '700' },

  pills: { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1,
    backgroundColor: 'rgba(8,11,26,0.78)',
    borderRadius: 8, padding: 8, alignItems: 'center',
  },
  pillLabel: { color: Space.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  pillValue: { color: Space.text, fontSize: 12, fontWeight: '600', marginTop: 2 },
});
