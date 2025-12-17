import app from './app';
import { config } from './config';

app.listen(config.port, () => {
  console.log(`Weather radar backend running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});