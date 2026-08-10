import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import db from '../db/connection';
import { getTierInfo } from '../services/tierService';

const router = Router();

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db('users').where({ id: req.user!.userId }).first();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const tierInfo = getTierInfo(user.total_earned);

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      currentBalance: user.current_balance,
      totalEarned: user.total_earned,
      tier: user.tier,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      tierInfo,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/balance
router.get('/balance', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db('users').where({ id: req.user!.userId }).first();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const tierInfo = getTierInfo(user.total_earned);

    res.json({
      currentBalance: user.current_balance,
      totalEarned: user.total_earned,
      tierInfo,
    });
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
