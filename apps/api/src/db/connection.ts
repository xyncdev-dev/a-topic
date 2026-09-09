import knex from 'knex';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

function createConnection() {
  // PostgreSQL (production / Vercel) when DATABASE_URL is configured.
  if (config.usePostgres && process.env.DATABASE_URL) {
    return knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
      pool: { min: 0, max: 10 },
      acquireConnectionTimeout: 30000,
    });
  }

  // Serverless environment (Vercel) without DATABASE_URL:
  // Do not attempt to load better-sqlite3 as native addons are not available
  // and serverless filesystem is ephemeral/read-only.
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    console.warn('⚠️ DATABASE_URL is not configured on Vercel. Database operations will be inactive.');
    return knex({
      client: 'pg',
      connection: 'postgres://dummy:dummy@localhost:5432/dummy',
      pool: { min: 0, max: 0 },
    });
  }

  // SQLite (local development only).
  try {
    const dataDir = path.dirname(config.db.filename);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    return knex({
      client: 'better-sqlite3',
      connection: {
        filename: config.db.filename,
      },
      useNullAsDefault: true,
    });
  } catch (err) {
    console.warn('⚠️ SQLite connection could not be established:', err);
    return knex({
      client: 'pg',
      connection: 'postgres://dummy:dummy@localhost:5432/dummy',
      pool: { min: 0, max: 0 },
    });
  }
}

const db = createConnection();

export default db;
