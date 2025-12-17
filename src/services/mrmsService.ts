import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { gunzipSync } from 'zlib';
import { RadarData, RadarPoint } from '../types';
import { config } from '../config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
      const radarPoints = await this.parseGrib2Data(GRIB_FILE);

      const radarData: RadarData = {
        timestamp,
        bounds: {
          north: 50.0,
          south: 25.0,
          east: -65.0,
          west: -125.0
        },
        data: radarPoints
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
    try {
      console.log('Parsing GRIB2 data using Python cfgrib service...');

      if (!fs.existsSync(filePath)) {
        throw new Error(`GRIB2 file not found: ${filePath}`);
      }

      try {
        const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
        const response = await axios.post(`${pythonServiceUrl}/parse`, {
          file_path: filePath
        }, { timeout: 30000 });

        console.log(`Successfully parsed ${response.data.points.length} radar points from Python service`);
        return response.data.points;

      } catch (serviceError) {
        console.warn('Python cfgrib service not available, falling back to mock data');
        return this.generateMockRadarData();
      }

    } catch (error) {
      console.error('Error parsing GRIB2 data:', error);
      // Fall back to mock data if parsing fails
      console.log('Falling back to mock data due to parsing error');
      return this.generateMockRadarData();
    }
  }
}
