import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'gap-analysis:',
  ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // 1 hour
  maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
  retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY || '100', 10),
  enableReadyCheck: process.env.REDIS_READY_CHECK !== 'false',
  lazyConnect: process.env.REDIS_LAZY_CONNECT === 'true',
}));
