import type { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';

// Load local .env for CLI usage. When DATABASE_URL is present, PostgreSQL is
// used (Vercel/production); otherwise SQLite (local development).
dotenv.config();

const isPostgres = Boolean(process.env.DATABASE_URL);

const baseConfig: Knex.Config = {
  migrations: {
    directory: path.resolve(process.cwd(), './src/db/migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.resolve(process.cwd(), './src/db/seeds'),
    extension: 'ts',
  },
};

const connection: Knex.Config['connection'] = isPostgres
  ? process.env.DATABASE_URL
  : {
      filename: path.resolve(process.cwd(), './data/rewards.db'),
    };

const config: { [key: string]: Knex.Config } = {
  development: {
    client: isPostgres ? 'pg' : 'sqlite3',
    connection,
    useNullAsDefault: true,
    pool: isPostgres ? { min: 0, max: 10 } : undefined,
    ...baseConfig,
  },
  production: {
    client: isPostgres ? 'pg' : 'sqlite3',
    connection,
    useNullAsDefault: true,
    pool: isPostgres ? { min: 0, max: 10 } : undefined,
    ...baseConfig,
  },
};

export default config;
