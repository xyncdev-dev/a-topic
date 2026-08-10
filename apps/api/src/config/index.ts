import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export const config = {
  port: parseInt(process.env.API_PORT || '3001', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'change-this-in-production',
  jwtExpiresIn: '24h',
  shopify: {
    storeUrl: process.env.SHOPIFY_STORE_URL || '',
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN || '',
    webhookSecret: process.env.SHOPIFY_WEBHOOK_SECRET || '',
  },
  coinsMultiplier: parseInt(process.env.COINS_MULTIPLIER || '10', 10),
  db: {
    filename: path.resolve(__dirname, '../../data/rewards.db'),
  },
};
