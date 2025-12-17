import fs from 'fs';
import path from 'path';
import { RadarData } from '../types';
import { config } from '../config';

const CACHE_DIR = config.cache.directory;
const CACHE_FILE = path.join(CACHE_DIR, 'latest_radar.json');

export class CacheService {
  private static ensureCacheDir(): void {
    if (!fs.existsSync(config.cache.directory)) {
      fs.mkdirSync(config.cache.directory, { recursive: true });
    }
  }

  static saveRadarData(data: RadarData): void {
    this.ensureCacheDir();
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
      console.log('Radar data cached successfully');
    } catch (error) {
      console.error('Error saving radar data to cache:', error);
    }
  }

  static loadRadarData(): RadarData | null {
    try {
      if (!fs.existsSync(CACHE_FILE)) {
        return null;
      }

      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      const fileTime = fs.statSync(CACHE_FILE).mtime.getTime();
      const now = Date.now();

      if (now - fileTime < config.cache.fileTtl) {
        console.log('Loaded radar data from file cache');
        return cached;
      }

      console.log('File cache expired');
      return null;
    } catch (error) {
      console.error('Error loading radar data from cache:', error);
      return null;
    }
  }

  static getCacheAge(): number {
    try {
      if (!fs.existsSync(CACHE_FILE)) {
        return -1;
      }
      const fileTime = fs.statSync(CACHE_FILE).mtime.getTime();
      return Date.now() - fileTime;
    } catch {
      return -1;
    }
  }

  static clearCache(): void {
    try {
      if (fs.existsSync(CACHE_FILE)) {
        fs.unlinkSync(CACHE_FILE);
        console.log('Cache cleared');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}
