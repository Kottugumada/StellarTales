import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { initDatabase } from '../services/database';
import { getVisibleObjects, VisibleSkyObject } from '../services/skyEngine';

// Default location (New York) used when GPS is unavailable
const DEFAULT_LAT = 40.7128;
const DEFAULT_LON = -74.006;

interface SkyState {
  objects: VisibleSkyObject[];
  loading: boolean;
  locationDenied: boolean;
  location: { lat: number; lon: number } | null;
}

export function useSkyObjects(): SkyState {
  const [state, setState] = useState<SkyState>({
    objects: [],
    loading: true,
    locationDenied: false,
    location: null,
  });

  useEffect(() => {
    async function load() {
      // Initialize DB (idempotent — safe to call every launch)
      initDatabase();

      let lat = DEFAULT_LAT;
      let lon = DEFAULT_LON;
      let locationDenied = false;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
          lat = loc.coords.latitude;
          lon = loc.coords.longitude;
        } else {
          locationDenied = true;
        }
      } catch {
        locationDenied = true;
      }

      const objects = getVisibleObjects(lat, lon, new Date());

      setState({
        objects,
        loading: false,
        locationDenied,
        location: { lat, lon },
      });
    }

    load();
  }, []);

  return state;
}
