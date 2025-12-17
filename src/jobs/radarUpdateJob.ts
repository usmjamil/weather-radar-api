import * as cron from 'node-cron';
import { Logger } from '../utils/logger';
import { MrmsService } from '../services/mrmsService';
import { CacheService } from '../services/cacheService';
import { config } from '../config';

export class RadarUpdateJob {
  private static instance: RadarUpdateJob;
  private task: cron.ScheduledTask | null = null;

  private constructor() { }

  public static getInstance(): RadarUpdateJob {
    if (!RadarUpdateJob.instance) {
      RadarUpdateJob.instance = new RadarUpdateJob();
    }
    return RadarUpdateJob.instance;
  }

  public start(): void {
    if (this.task) {
      Logger.warn('Radar update job is already running');
      return;
    }

    const refreshMinutes = Math.floor(config.mrms.refreshInterval / 60000);
    Logger.info(`Starting radar data update job (every ${refreshMinutes} minutes)`);

    this.task = cron.schedule(`*/${refreshMinutes} * * * *`, async () => {
      Logger.info('Scheduled radar data update');
      try {
        const radarData = await MrmsService.downloadAndProcessRadar();
        CacheService.saveRadarData(radarData);
        Logger.info('Radar data updated successfully');
      } catch (error) {
        Logger.error('Scheduled update failed:', error);
      }
    });

    this.task.start();
  }

  public stop(): void {
    if (this.task) {
      Logger.info('Stopping radar data update job');
      this.task.stop();
      this.task = null;
    }
  }

  public destroy(): void {
    this.stop();
  }
}
