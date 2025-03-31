import { Constellation } from '../ar/types';
import { NASAApiClient, IStarDatabaseClient, APODResponse } from './types';

class AstronomyService {
  private nasaClient: NASAApiClient;
  private starDB: IStarDatabaseClient;

  async getVisibleConstellations(
    location: GeolocationCoordinates,
    time: Date
  ): Promise<Constellation[]> {
    const skyPosition = await this.calculateSkyPosition(location, time);
    return this.starDB.queryVisibleConstellations(skyPosition);
  }

  async getDailyAstronomyImage(): Promise<APODResponse> {
    return this.nasaClient.getAPOD();
  }

  private async calculateSkyPosition(location: GeolocationCoordinates, time: Date) {
    // Calculate sky position based on location and time
    return {
      azimuth: 0,
      altitude: 0,
      timestamp: time
    };
  }
} 