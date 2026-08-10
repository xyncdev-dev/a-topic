import { Router, Request, Response } from 'express';
import db from '../db/connection';
import { hashPassword, comparePassword, generateToken } from '../services/authService';
import { getTierInfo } from '../services/tierService';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await db('users').where({ email: email.toLowerCase() }).first();

    if (existingUser && existingUser.password_hash) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);

    let userId: number;

    if (existingUser) {
      // User was pre-created by webhook — set their password
      await db('users').where({ id: existingUser.id }).update({
        password_hash: passwordHash,
        name: name || existingUser.name,
        updated_at: new Date().toISOString(),
      });
      userId = existingUser.id;
    } else {
      // Create new user
      const [id] = await db('users').insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name: name || null,
      });
      userId = id;
    }

    const user = await db('users').where({ id: userId }).first();
    const tierInfo = getTierInfo(user.total_earned);
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      token,
      user: {
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
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await db('users').where({ email: email.toLowerCase() }).first();

    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const tierInfo = getTierInfo(user.total_earned);
    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      token,
      user: {
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
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
