import type { Knex } from 'knex';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, './data/rewards.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, './src/db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, './src/db/seeds'),
      extension: 'ts',
    },
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, './data/rewards.db'),
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, './src/db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: path.resolve(__dirname, './src/db/seeds'),
      extension: 'ts',
    },
  },
};

export default config;
