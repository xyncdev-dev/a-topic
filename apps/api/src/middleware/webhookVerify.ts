import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '../config';

/**
 * Middleware to verify Shopify webhook HMAC-SHA256 signature.
 * Must be used with express.raw({ type: 'application/json' }) on the webhook routes.
 */
export function webhookVerify(req: Request, res: Response, next: NextFunction): void {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');

  if (!hmacHeader) {
    res.status(401).json({ error: 'Missing HMAC header' });
    return;
  }

  const body = req.body as Buffer;

  if (!Buffer.isBuffer(body)) {
    res.status(400).json({ error: 'Request body must be raw buffer' });
    return;
  }

  const generatedHash = crypto
    .createHmac('sha256', config.shopify.webhookSecret)
    .update(body)
    .digest('base64');

  // Use timing-safe comparison to prevent timing attacks
  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(hmacHeader, 'base64'),
      Buffer.from(generatedHash, 'base64')
    );

    if (!isValid) {
      res.status(401).json({ error: 'HMAC validation failed' });
      return;
    }
  } catch {
    res.status(401).json({ error: 'HMAC validation failed' });
    return;
  }

  // Parse the raw body to JSON now that it's verified
  try {
    req.body = JSON.parse(body.toString('utf-8'));
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  next();
}
