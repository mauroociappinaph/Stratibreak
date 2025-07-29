import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // App configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('0.0.0.0'),
  API_PREFIX: Joi.string().default('api'),
  GLOBAL_PREFIX: Joi.string().default('api/v1'),

  // Database configuration
  DATABASE_URL: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().default('gap_analysis'),
  DB_SSL: Joi.boolean().default(false),

  // Auth configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  BCRYPT_ROUNDS: Joi.number().default(10),

  // Redis configuration
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),
  REDIS_DB: Joi.number().default(0),

  // ML configuration
  ML_SERVICE_URL: Joi.string().default('http://localhost:8000'),
  ML_SERVICE_TIMEOUT: Joi.number().default(30000),
  PREDICTION_THRESHOLD: Joi.number().min(0).max(1).default(0.85),

  // CORS configuration
  CORS_ORIGINS: Joi.string().default('http://localhost:3001'),

  // Rate limiting
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),

  // Swagger
  SWAGGER_ENABLED: Joi.boolean().default(true),
});
