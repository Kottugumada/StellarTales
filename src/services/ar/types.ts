export interface Constellation {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    long: number;
  };
  stars: Array<{
    id: string;
    position: [number, number];
  }>;
} 