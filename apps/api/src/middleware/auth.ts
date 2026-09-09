import { Request, Response, NextFunction } from 'express';
import { getAuth, clerkClient } from '@clerk/express';
import db from '../db/connection';
import { verifyToken } from '../services/authService';

export interface AuthRequest extends Request {
  user?: { userId: number; email: string; role?: string };
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  // 1. Check Clerk authentication first
  try {
    const auth = getAuth(req);
    if (auth && auth.userId) {
      let user = await db('users').where({ clerk_id: auth.userId }).first();

      if (!user) {
        // Fetch Clerk user details to link by email or create new row
        const clerkUser = await clerkClient.users.getUser(auth.userId);
        const email =
          clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
          clerkUser.emailAddresses[0]?.emailAddress;

        if (email) {
          const normalizedEmail = email.toLowerCase();
          user = await db('users').where({ email: normalizedEmail }).first();

          if (user) {
            await db('users').where({ id: user.id }).update({
              clerk_id: auth.userId,
              updated_at: new Date().toISOString(),
            });
            user = await db('users').where({ id: user.id }).first();
          } else {
            const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null;
            const role = (clerkUser.publicMetadata?.role as string) || 'user';
            await db('users').insert({
              email: normalizedEmail,
              name,
              clerk_id: auth.userId,
              role,
            });
            user = await db('users').where({ clerk_id: auth.userId }).first();
          }
        }
      }

      if (user) {
        // Sync admin role if granted in Clerk publicMetadata
        const clerkRole = auth.sessionClaims?.metadata?.role || (auth.sessionClaims as any)?.role;
        if (clerkRole === 'admin' && user.role !== 'admin') {
          await db('users').where({ id: user.id }).update({ role: 'admin' });
          user.role = 'admin';
        }

        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
        };
        return next();
      }
    }
  } catch (err) {
    console.warn('Clerk auth verification note:', err);
  }

  // 2. Fallback to legacy JWT token if present
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyToken(token);
      const user = await db('users').where({ id: decoded.userId }).first('role');
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: user?.role || 'user',
      };
      return next();
    } catch (error) {
      // Legacy token invalid
    }
  }

  res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid authentication credentials' });
}
