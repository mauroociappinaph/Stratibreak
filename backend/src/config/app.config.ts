import { registerAs } from '@nestjs/config';

interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  apiPrefix: string;
  corsOrigins: string[];
  rateLimitTtl: number;
  rateLimitMax: number;
  globalPrefix: string;
  swaggerEnabled: boolean;
  logLevel: string;
}

const getNodeEnv = (): string => process.env.NODE_ENV || 'development';
const getSwaggerEnabled = (): boolean => {
  const nodeEnv = getNodeEnv();
  return process.env.SWAGGER_ENABLED === 'true' || nodeEnv === 'development';
};

const createAppConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: getNodeEnv(),
  apiPrefix: process.env.API_PREFIX || 'api',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3001',
  ],
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api/v1',
  swaggerEnabled: getSwaggerEnabled(),
  logLevel: process.env.LOG_LEVEL || 'info',
});

export default registerAs('app', createAppConfig);
