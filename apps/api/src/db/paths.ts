import path from 'path';
import fs from 'fs';

/**
 * Resolve the migrations/seeds directories and file extension for the current
 * execution context.
 *
 * - Development (tsx, running from `src`): `__dirname` points to
 *   `<pkgRoot>/src/db`, so the files live at `<pkgRoot>/src/db/migrations`.
 * - Production (compiled `dist`, used by `npm start` and Vercel Functions):
 *   `__dirname` points to `<pkgRoot>/dist/db`, so the compiled JS files live
 *   at `<pkgRoot>/dist/db/migrations`.
 *
 * The extension is derived from what actually exists on disk, which keeps the
 * exact same migrations/seeds running in both environments.
 */
export function resolveDbPaths(): { migrationsDir: string; seedsDir: string; extension: string } {
  const packageDbDir = path.resolve(__dirname, '..');

  const migrationsDir = path.join(packageDbDir, 'db', 'migrations');
  const seedsDir = path.join(packageDbDir, 'db', 'seeds');

  const extension = fs.existsSync(path.join(migrationsDir, '001_initial.js')) ? 'js' : 'ts';

  return { migrationsDir, seedsDir, extension };
}
