import dotenv from 'dotenv';
import path from 'path';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.API_PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'change-this-in-production',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn'],
  shopify: {
    storeUrl: process.env.SHOPIFY_STORE_URL || '',
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || '',
  },
  coinsMultiplier: parseInt(process.env.COINS_MULTIPLIER || '10', 10),
  // PostgreSQL is used in production (Vercel) when DATABASE_URL is present.
  // Otherwise SQLite is used for local development.
  usePostgres: Boolean(process.env.DATABASE_URL),
  db: {
    filename: process.env.SQLITE_FILENAME
      ? path.resolve(process.env.SQLITE_FILENAME)
      : path.resolve(__dirname, '../../data/rewards.db'),
  },
};
