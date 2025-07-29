import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'gap_analysis',
  ssl: process.env.DB_SSL === 'true',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
  acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000', 10),
  timeout: parseInt(process.env.DB_TIMEOUT || '60000', 10),
}));
