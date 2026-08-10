import { app } from './app';
import { config } from './config';
import { ensureDatabase } from './db/init';

// ─── Run migrations and start server (local / standalone) ──────
async function start() {
  try {
    await ensureDatabase();
    console.log('✅ Database migrations complete');

    app.listen(config.port, () => {
      console.log(`🚀 A-Topic Rewards API running on http://localhost:${config.port}`);
      console.log(`   CORS origin: ${config.corsOrigin}`);
      console.log(`   Coins multiplier: ${config.coinsMultiplier}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Vercel serverless entry point: export the Express app as the default
// handler. When the file is executed directly (tsx src/index.ts or
// node dist/index.js), start the standalone server instead.
if (require.main === module) {
  start();
}

export { app, ensureDatabase };
export default app;
