import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import db from '../db/connection';
import * as coinService from '../services/coinService';

const router = Router();

// GET /api/admin/settings
router.get('/settings', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const settings = await db('settings').select('*');
    const settingsMap: Record<string, string> = {};
    settings.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    console.error('Admin settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/settings
router.put('/settings', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      res.status(400).json({ error: 'key and value are required' });
      return;
    }

    await db('settings')
      .insert({ key, value: String(value) })
      .onConflict('key')
      .merge();

    res.json({ success: true, key, value: String(value) });
  } catch (error) {
    console.error('Admin settings update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users
router.get('/users', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;

    const offset = (page - 1) * limit;

    let query = db('users').select('id', 'email', 'name', 'current_balance', 'total_earned', 'tier', 'role', 'created_at');
    let countQuery = db('users').count('* as count');

    if (search) {
      query = query.where('email', 'like', `%${search}%`).orWhere('name', 'like', `%${search}%`);
      countQuery = countQuery.where('email', 'like', `%${search}%`).orWhere('name', 'like', `%${search}%`);
    }

    const [users, [{ count }]] = await Promise.all([
      query.orderBy('created_at', 'desc').limit(limit).offset(offset),
      countQuery,
    ]);

    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        currentBalance: u.current_balance,
        totalEarned: u.total_earned,
        tier: u.tier,
        role: u.role,
        createdAt: u.created_at,
      })),
      total: Number(count),
      page,
      limit,
    });
  } catch (error) {
    console.error('Admin list users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await db('users').where({ id: userId }).first();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const transactions = await db('transactions')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(50);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currentBalance: user.current_balance,
        totalEarned: user.total_earned,
        tier: user.tier,
        role: user.role,
        createdAt: user.created_at,
      },
      transactions: transactions.map(t => ({
        id: t.id,
        userId: t.user_id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        createdAt: t.created_at,
      })),
    });
  } catch (error) {
    console.error('Admin get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/users/:id/coins
router.post('/users/:id/coins', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const { amount, description } = req.body;

    if (!amount || typeof amount !== 'number') {
      res.status(400).json({ error: 'Valid amount is required' });
      return;
    }

    if (amount > 0) {
      await coinService.addCoins({ userId, amount, description: description || 'Ajuste manual de administrador' });
    } else {
      await coinService.deductCoins({ userId, amount: Math.abs(amount), description: description || 'Ajuste manual de administrador', rewardId: null, discountCode: null });
    }

    const updatedUser = await db('users').where({ id: userId }).first();
    res.json({ success: true, currentBalance: updatedUser.current_balance });
  } catch (error: any) {
    console.error('Admin adjust coins error:', error);
    res.status(400).json({ error: error.message || 'Internal server error' });
  }
});

// GET /api/admin/stats/kpis
router.get('/stats/kpis', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const [[{ totalUsers }], [{ totalEarned }], [{ totalRedeemed }]] = await Promise.all([
      db('users').count('* as totalUsers'),
      db('transactions').where('type', 'earn').sum('amount as totalEarned'),
      db('transactions').where('type', 'redeem').sum('amount as totalRedeemed'),
    ]);

    const activeCoins = (Number(totalEarned) || 0) - (Number(totalRedeemed) || 0);

    res.json({
      totalUsers: Number(totalUsers) || 0,
      totalEarned: Number(totalEarned) || 0,
      totalRedeemed: Number(totalRedeemed) || 0,
      activeCoins,
    });
  } catch (error) {
    console.error('Admin KPIs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats/top-users
router.get('/stats/top-users', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const users = await db('users')
      .select('id', 'email', 'name', 'total_earned', 'current_balance', 'tier')
      .orderBy('total_earned', 'desc')
      .limit(10);
      
    res.json(users);
  } catch (error) {
    console.error('Admin top users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats/chart
router.get('/stats/chart', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response) => {
  try {
    const days = 30;
    const now = new Date();
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(now.getDate() - days);
    
    const transactions = await db('transactions')
      .select('type', 'amount', 'created_at')
      .where('created_at', '>=', date30DaysAgo);

    const grouped: Record<string, { earn: number, redeem: number }> = {};
    
    for(let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      grouped[dateStr] = { earn: 0, redeem: 0 };
    }

    transactions.forEach(t => {
      const dateObj = typeof t.created_at === 'string' ? new Date(t.created_at) : t.created_at;
      if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
        const dateStr = dateObj.toISOString().split('T')[0];
        if (grouped[dateStr]) {
          if (t.type === 'earn') grouped[dateStr].earn += t.amount;
          if (t.type === 'redeem') grouped[dateStr].redeem += t.amount;
        }
      }
    });

    const chartData = Object.keys(grouped).sort().map(date => ({
      date: date.substring(5), // Keep MM-DD for compactness
      earn: grouped[date].earn,
      redeem: grouped[date].redeem
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Admin chart stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/transactions
router.get('/transactions', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const [transactions, [{ count }]] = await Promise.all([
      db('transactions')
        .join('users', 'transactions.user_id', 'users.id')
        .select(
          'transactions.*',
          'users.email as user_email',
          'users.name as user_name'
        )
        .orderBy('transactions.created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db('transactions').count('* as count'),
    ]);

    res.json({
      transactions,
      total: Number(count),
      page,
      limit,
    });
  } catch (error) {
    console.error('Admin transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
