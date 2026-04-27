import { Body, Equator, Horizon, Observer } from 'astronomy-engine';
import { ANCHOR_OBJECTS, PLANET_IDS, SkyObject } from '../data/anchorObjects';

export interface VisibleSkyObject extends SkyObject {
  altitude: number;
  azimuth: number;
  directionLabel: string;
  prominenceStars: number; // 1–5
}

const PLANET_BODIES: Partial<Record<string, Body>> = {
  saturn: Body.Saturn,
  jupiter: Body.Jupiter,
  mars: Body.Mars,
  venus: Body.Venus,
  mercury: Body.Mercury,
};

// ── Math helpers ───────────────────────────────────────────────────────────

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function dateToJD(date: Date): number {
  return date.getTime() / 86400000.0 + 2440587.5;
}

// Returns Greenwich Mean Sidereal Time in degrees
function gmstDeg(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  return ((gmst % 360) + 360) % 360;
}

// Compute altitude (degrees above horizon) and azimuth (degrees from N through E)
// for a fixed star/DSO given its RA (hours) and Dec (degrees).
function fixedObjectAltAz(
  ra: number,
  dec: number,
  lat: number,
  lon: number,
  date: Date,
): { altitude: number; azimuth: number } {
  const jd = dateToJD(date);
  const lst = ((gmstDeg(jd) + lon + 360) % 360); // Local Sidereal Time in degrees
  const H = toRad(lst - ra * 15); // hour angle in radians

  const decRad = toRad(dec);
  const latRad = toRad(lat);

  const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(H);
  const altitude = toDeg(Math.asin(Math.max(-1, Math.min(1, sinAlt))));

  const cosAlt = Math.cos(toRad(altitude));
  const cosAz =
    cosAlt < 1e-10
      ? 0
      : (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * cosAlt);
  let azimuth = toDeg(Math.acos(Math.max(-1, Math.min(1, cosAz))));
  if (Math.sin(H) > 0) azimuth = 360 - azimuth;

  return { altitude, azimuth };
}

// Use astronomy-engine for planets (positions change daily)
function planetAltAz(
  planetId: string,
  lat: number,
  lon: number,
  date: Date,
): { altitude: number; azimuth: number } | null {
  const body = PLANET_BODIES[planetId];
  if (!body) return null;
  const observer = new Observer(lat, lon, 0);
  const eq = Equator(body, date, observer, true, true);
  const hz = Horizon(date, observer, eq.ra, eq.dec, 'normal');
  return { altitude: hz.altitude, azimuth: hz.azimuth };
}

// ── Public API ─────────────────────────────────────────────────────────────

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function directionLabel(altitude: number, azimuth: number): string {
  const direction = COMPASS[Math.round(azimuth / 45) % 8];
  if (altitude < 15) return `Rising ${direction}`;
  if (altitude > 75) return 'Overhead';
  if (altitude > 45) return `High in the ${direction}`;
  return `In the ${direction}`;
}

function prominenceStars(obj: SkyObject): number {
  if (obj.category === 'planet') return 5;
  if (obj.magnitude === null) {
    // Constellations — rank by cultural prominence
    const prominent = new Set(['orion', 'ursa_major', 'crux', 'scorpius', 'leo', 'cassiopeia']);
    return prominent.has(obj.id) ? 5 : 4;
  }
  if (obj.magnitude < 0.5) return 5;
  if (obj.magnitude < 1.5) return 4;
  if (obj.magnitude < 2.5) return 3;
  if (obj.magnitude < 4.0) return 2;
  return 1;
}

const ALTITUDE_THRESHOLD = 10; // degrees above horizon

export function getVisibleObjects(lat: number, lon: number, date: Date): VisibleSkyObject[] {
  const results: VisibleSkyObject[] = [];

  for (const obj of ANCHOR_OBJECTS) {
    let pos: { altitude: number; azimuth: number } | null = null;

    if (PLANET_IDS.has(obj.id)) {
      pos = planetAltAz(obj.id, lat, lon, date);
    } else if (obj.ra !== null && obj.dec !== null) {
      pos = fixedObjectAltAz(obj.ra, obj.dec, lat, lon, date);
    }

    if (!pos || pos.altitude < ALTITUDE_THRESHOLD) continue;

    results.push({
      ...obj,
      altitude: pos.altitude,
      azimuth: pos.azimuth,
      directionLabel: directionLabel(pos.altitude, pos.azimuth),
      prominenceStars: prominenceStars(obj),
    });
  }

  // Sort: planets first (high interest), then by prominence, then by altitude
  return results.sort((a, b) => {
    const aP = PLANET_IDS.has(a.id) ? 1 : 0;
    const bP = PLANET_IDS.has(b.id) ? 1 : 0;
    if (aP !== bP) return bP - aP;
    if (b.prominenceStars !== a.prominenceStars) return b.prominenceStars - a.prominenceStars;
    return b.altitude - a.altitude;
  });
}
