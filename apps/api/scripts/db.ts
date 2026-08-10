/**
 * Database CLI runner (executed via `tsx`).
 *
 * Usage:
 *   tsx scripts/db.ts migrate   -> knex migrate:latest
 *   tsx scripts/db.ts seed      -> knex seed:run
 *   tsx scripts/db.ts rollback  -> knex migrate:rollback
 *
 * This replaces the `knex --knexfile` CLI invocation, which could not load the
 * TypeScript config/migrations without an extra loader.
 */
import db from '../src/db/connection';
import { resolveDbPaths } from '../src/db/paths';

const command = process.argv[2];

async function run(): Promise<void> {
  const { migrationsDir, seedsDir, extension } = resolveDbPaths();
  const loadExtensions = [`.${extension}`];

  switch (command) {
    case 'migrate':
      await db.migrate.latest({ directory: migrationsDir, loadExtensions });
      console.log('✅ Migrations applied');
      break;
    case 'seed':
      await db.seed.run({ directory: seedsDir, loadExtensions });
      console.log('✅ Seeds applied');
      break;
    case 'rollback':
      await db.migrate.rollback({ directory: migrationsDir, loadExtensions });
      console.log('✅ Migrations rolled back');
      break;
    default:
      console.error('Usage: tsx scripts/db.ts <migrate|seed|rollback>');
      process.exitCode = 1;
      return;
  }

  await db.destroy();
}

run().catch((error) => {
  console.error('Database command failed:', error);
  process.exit(1);
});
