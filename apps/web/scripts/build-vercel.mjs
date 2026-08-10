import path from 'node:path';
import { spawnSync } from 'node:child_process';

const webRoot = process.cwd();
const repoRoot = path.resolve(webRoot, '../..');
const npmCommand = process.env.npm_execpath ? process.execPath : 'npm';
const npmPrefix = process.env.npm_execpath ? [process.env.npm_execpath] : [];

function run(args, cwd) {
  const result = spawnSync(npmCommand, [...npmPrefix, ...args], {
    cwd,
    stdio: 'inherit',
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Build workspace packages before Next.js so the serverless API entrypoint can
// resolve the compiled API and shared package outputs.
run(['run', 'build', '--workspace=packages/shared'], repoRoot);
run(['run', 'build', '--workspace=apps/api'], repoRoot);
run(['run', 'build'], webRoot);
