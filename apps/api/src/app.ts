import express from 'express';
import cors from 'cors';
import { config } from './config';
import { ensureDatabase } from './db/init';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import rewardsRoutes from './routes/rewards';
import transactionsRoutes from './routes/transactions';
import webhookRoutes from './routes/webhooks';
import adminRoutes from './routes/admin';

// Middleware
import { webhookVerify } from './middleware/webhookVerify';

export const app = express();

// ─── Database readiness ──────────────────────────────────────────
// Run migrations (and seeds if needed) automatically, exactly once per
// process/instance. This mirrors the previous startup behavior and also
// works when the app runs as a Vercel Function.
let dbInitialized = false;

app.use(async (_req, res, next) => {
  if (!dbInitialized) {
    try {
      await ensureDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      res.status(500).json({ error: 'Database initialization failed' });
      return;
    }
  }
  next();
});

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

export default app;
