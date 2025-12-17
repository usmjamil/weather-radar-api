import { Request, Response } from 'express';
import { CacheService } from '../services/cacheService';
import { HealthStatus, ApiResponse } from '../types';

export class HealthController {
  static async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const cacheAge = CacheService.getCacheAge();
      const status: HealthStatus = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        cacheAge
      };

      res.json(this.createSuccessResponse(status));
    } catch (error) {
      console.error('Health check error:', error);
      const status: HealthStatus = {
        status: 'error',
        timestamp: new Date().toISOString(),
        cacheAge: -1
      };

      res.status(500).json(this.createErrorResponse(status));
    }
  }

  private static createSuccessResponse(data: HealthStatus): ApiResponse<HealthStatus> {
    return {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
  }

  private static createErrorResponse(data: HealthStatus): ApiResponse<HealthStatus> {
    return {
      success: false,
      data,
      timestamp: new Date().toISOString()
    };
  }
}
