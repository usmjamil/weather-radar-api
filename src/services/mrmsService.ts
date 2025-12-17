import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { gunzipSync } from 'zlib';
import { RadarData, RadarPoint } from '../types';
import { config } from '../config';

const CACHE_DIR = config.cache.directory;
const GRIB_FILE = path.join(CACHE_DIR, 'latest.grib2');

export class MrmsService {
  private static ensureCacheDir(): void {
    if (!fs.existsSync(config.cache.directory)) {
      fs.mkdirSync(config.cache.directory, { recursive: true });
    }
  }

  static async downloadAndProcessRadar(): Promise<RadarData> {
    this.ensureCacheDir();

    try {
      console.log('Downloading MRMS data...');
      const response = await axios.get(config.mrms.url, {
        responseType: 'arraybuffer',
        timeout: config.mrms.timeout
      });

      const gribData = gunzipSync(response.data);
      fs.writeFileSync(GRIB_FILE, gribData);

      const timestamp = new Date().toISOString();

      const radarData: RadarData = {
        timestamp,
        bounds: {
          north: 50.0,
          south: 25.0,
          east: -65.0,
          west: -125.0
        },
        data: this.generateMockRadarData()
      };

      return radarData;
    } catch (error) {
      console.error('Error downloading radar data:', error);
      throw new Error('Failed to download MRMS data');
    }
  }

  private static generateMockRadarData(): RadarPoint[] {
    const data: RadarPoint[] = [];
    const latStep = 0.5;
    const lonStep = 0.5;

    // Use bounds from config if available, otherwise use defaults
    const bounds = {
      north: 50.0,
      south: 25.0,
      east: -65.0,
      west: -125.0
    };

    for (let lat = bounds.south; lat <= bounds.north; lat += latStep) {
      for (let lon = bounds.west; lon <= bounds.east; lon += lonStep) {
        const value = Math.random() * 70;
        if (value > 5) {
          data.push({ lat, lon, value: Math.round(value * 10) / 10 });
        }
      }
    }

    return data;
  }

  static async parseGrib2Data(filePath: string): Promise<RadarPoint[]> {
    console.log('GRIB2 parsing not implemented - using mock data');
    return this.generateMockRadarData();
  }
}
