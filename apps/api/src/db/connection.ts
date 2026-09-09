import knex from 'knex';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

function createConnection() {
  // PostgreSQL (production / Vercel) when DATABASE_URL is configured.
  if (config.usePostgres) {
    return knex({
      client: 'pg',
      connection: process.env.DATABASE_URL,
      pool: { min: 0, max: 10 },
      acquireConnectionTimeout: 30000,
    });
  }

  // SQLite (local development only).
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
}

const db = createConnection();

export default db;
