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
import { clerkMiddleware } from '@clerk/express';

export const app = express();

// ─── Health check (always available, no DB or Clerk requirement) ──
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    postgresConfigured: Boolean(process.env.DATABASE_URL),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));

// ─── Clerk Authentication Middleware ───────────────────────────
if (config.clerkPublishableKey && config.clerkSecretKey) {
  try {
    app.use(clerkMiddleware({
      publishableKey: config.clerkPublishableKey,
      secretKey: config.clerkSecretKey,
    }));
  } catch (err) {
    console.warn('⚠️ Could not initialize Clerk middleware on Express:', err);
  }
} else {
  console.warn('⚠️ Clerk keys not configured in API. Clerk middleware skipped.');
}

// ─── Database readiness ──────────────────────────────────────────
let dbInitialized = false;

app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();

  if (!dbInitialized) {
    if (process.env.VERCEL && !process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL not configured on Vercel.');
      res.status(503).json({
        error: 'Database not configured. Please configure DATABASE_URL in your Vercel Project Settings.',
      });
      return;
    }

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

// ─── Global Error Handler ───────────────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('API Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
