import { Request, Response } from 'express';
import { MrmsService } from '../services/mrmsService';
import { CacheService } from '../services/cacheService';
import { RadarData, ApiResponse } from '../types';
import { config } from '../config';

let cachedRadarData: RadarData | null = null;
let lastUpdateTime = 0;

export class RadarController {
  static async getLatestRadar(req: Request, res: Response): Promise<void> {
    const now = Date.now();
    const cacheAge = now - lastUpdateTime;

    try {
      if (cachedRadarData && cacheAge < config.cache.memoryTtl) {
        console.log('Serving cached radar data');
        res.json(this.createSuccessResponse(cachedRadarData));
        return;
      }

      const fileData = CacheService.loadRadarData();
      if (fileData) {
        if (this.validateRadarData(fileData)) {
          console.log('Serving file cached radar data');
          cachedRadarData = fileData;
          lastUpdateTime = now;
          res.json(this.createSuccessResponse(fileData));
          return;
        } else {
          console.warn('Invalid cached data found, clearing cache');
          CacheService.clearCache();
        }
      }
      console.log('Fetching fresh radar data');
      const radarData = await MrmsService.downloadAndProcessRadar();

      if (!this.validateRadarData(radarData)) {
        throw new Error('Invalid radar data received from MRMS service');
      }

      cachedRadarData = radarData;
      lastUpdateTime = now;
      CacheService.saveRadarData(radarData);

      res.json(this.createSuccessResponse(radarData));
    } catch (error) {
      console.error('Error serving radar data:', error);

      const fallbackData = CacheService.loadRadarData();
      if (fallbackData && this.validateRadarData(fallbackData)) {
        console.log('Serving fallback cached data');
        res.json(this.createSuccessResponse(fallbackData));
        return;
      }

      res.status(500).json(this.createErrorResponse('Failed to fetch radar data'));
    }
  }

  static async refreshRadar(req: Request, res: Response): Promise<void> {
    try {
      console.log('Force refreshing radar data');
      const radarData = await MrmsService.downloadAndProcessRadar();

      if (!this.validateRadarData(radarData)) {
        throw new Error('Invalid radar data received from MRMS service');
      }

      cachedRadarData = radarData;
      lastUpdateTime = Date.now();
      CacheService.saveRadarData(radarData);

      res.json(this.createSuccessResponse(radarData));
    } catch (error) {
      console.error('Error refreshing radar data:', error);
      res.status(500).json(this.createErrorResponse('Failed to refresh radar data'));
    }
  }

  private static validateRadarData(data: any): data is RadarData {
    if (!data || typeof data !== 'object') {
      return false;
    }

    if (!data.timestamp || typeof data.timestamp !== 'string') {
      return false;
    }

    if (!data.bounds || typeof data.bounds !== 'object') {
      return false;
    }

    const { bounds } = data;
    if (typeof bounds.north !== 'number' || typeof bounds.south !== 'number' ||
      typeof bounds.east !== 'number' || typeof bounds.west !== 'number') {
      return false;
    }

    if (!Array.isArray(data.data)) {
      return false;
    }

    if (data.data.length === 0) {
      return false;
    }

    const firstPoint = data.data[0];
    if (!firstPoint || typeof firstPoint.lat !== 'number' ||
      typeof firstPoint.lon !== 'number' || typeof firstPoint.value !== 'number') {
      return false;
    }

    return true;
  }

  private static createSuccessResponse(data: RadarData): ApiResponse<RadarData> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
  }

  private static createErrorResponse(message: string): ApiResponse<never> {
    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString()
    };
  }
}
