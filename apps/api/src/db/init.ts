import db from './connection';
import { resolveDbPaths } from './paths';

let dbReady: Promise<void> | null = null;

/**
 * Ensure the database schema is up to date and the rewards catalog is seeded.
 * Runs migrations automatically (same behavior as the previous startup flow)
 * and only seeds when the rewards table is empty.
 *
 * The returned promise is cached so concurrent requests (or cold starts of a
 * Vercel Function) share a single initialization.
 */
export async function ensureDatabase(): Promise<void> {
  if (dbReady) return dbReady;

  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL is not set on Vercel. Skipping automatic migrations.');
    return;
  }

  dbReady = (async () => {
    const { migrationsDir, seedsDir, extension } = resolveDbPaths();
    const loadExtensions = [`.${extension}`];

    console.log('Running database migrations...');
    await db.migrate.latest({
      directory: migrationsDir,
      loadExtensions,
    });

    const rewardsCount = await db('rewards').count('* as count').first();
    if (rewardsCount && Number(rewardsCount.count) === 0) {
      console.log('Seeding initial rewards catalog...');
      await db.seed.run({
        directory: seedsDir,
        loadExtensions,
      });
    }

    console.log('✅ Database migrations complete');
  })().catch((error) => {
    dbReady = null;
    throw error;
  });

  return dbReady;
}
