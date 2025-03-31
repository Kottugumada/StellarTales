import { Constellation } from '../ar/types';

export interface NASAApiClient {
  getAPOD(): Promise<APODResponse>;
}

export interface IStarDatabaseClient {
  queryVisibleConstellations(skyPosition: any): Promise<Constellation[]>;
}

export interface APODResponse {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: 'image' | 'video';
} 