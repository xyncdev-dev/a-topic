import express from 'express';
import cors from 'cors';
import { config } from './config';
import db from './db/connection';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import rewardsRoutes from './routes/rewards';
import transactionsRoutes from './routes/transactions';
import webhookRoutes from './routes/webhooks';
import adminRoutes from './routes/admin';

// Middleware
import { webhookVerify } from './middleware/webhookVerify';

const app = express();

// ─── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// ─── Webhook routes (must use raw body for HMAC verification) ──
app.use('/webhooks', express.raw({ type: 'application/json' }), webhookVerify, webhookRoutes);

// ─── JSON body parser for all other routes ─────────────────────
app.use(express.json());

// ─── API Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Run migrations and start server ───────────────────────────
async function start() {
  try {
    // Run migrations automatically
    await db.migrate.latest({
      directory: __dirname + '/db/migrations',
      extension: 'ts',
    });
    console.log('✅ Database migrations complete');

    // Run seeds if no rewards exist
    const rewardsCount = await db('rewards').count('* as count').first();
    if (rewardsCount && Number(rewardsCount.count) === 0) {
      await db.seed.run({
        directory: __dirname + '/db/seeds',
        extension: 'ts',
      });
      console.log('✅ Initial seeds applied');
    }

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

start();
