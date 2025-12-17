export interface RadarPoint {
  lat: number;
  lon: number;
  value: number;
}

export interface RadarData {
  timestamp: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  data: RadarPoint[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  cacheAge: number;
  lastUpdate?: string;
}
