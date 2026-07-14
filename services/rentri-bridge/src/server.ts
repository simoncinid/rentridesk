import { createApp } from './app.js';
import { loadConfig } from './config.js';
const config = loadConfig();
const app = createApp(config);
const shutdown = async () => {
  await app.close();
  process.exit(0);
};
process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
try {
  await app.listen({ port: config.PORT, host: '0.0.0.0' });
} catch (error) {
  app.log.fatal(error);
  process.exit(1);
}
