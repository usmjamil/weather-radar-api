import { Router } from 'express';
import { RadarController } from '../controllers/radarController';
import { HealthController } from '../controllers/healthController';

const router = Router();

router.get('/radar/latest', RadarController.getLatestRadar.bind(RadarController));
router.post('/radar/refresh', RadarController.refreshRadar.bind(RadarController));

router.get('/health', HealthController.getHealth.bind(HealthController));

export default router;
