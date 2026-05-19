import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const config: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'steeltrack_new',
  user: process.env.DB_USER || 'steeltrack_user',
  password: process.env.DB_PASSWORD || 'SteelTrack2024!',
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new Pool(config);

pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err: Error) => {
  console.error('❌ Database error:', err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (duration > 1000) {
    console.warn(`⚠️ Slow query (${duration}ms): ${text}`);
  }
  
  return result;
};

export const getClient = async () => {
  return await pool.connect();
};
