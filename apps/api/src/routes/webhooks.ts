import { Router, Request, Response } from 'express';
import db from '../db/connection';
import { addCoins } from '../services/coinService';
import { config } from '../config';

const router = Router();

// POST /webhooks/orders-paid
router.post('/orders-paid', async (req: Request, res: Response) => {
  // NOTE: On Vercel Functions the process is frozen once the response is sent,
  // so we process the order BEFORE responding. A non-2xx response makes
  // Shopify retry the webhook, which guarantees the coins are eventually
  // credited. The work here is a handful of queries, well within Shopify's
  // response timeout.
  try {
    const order = req.body;
    const webhookId = req.get('X-Shopify-Webhook-Id') || null;

    const email = order.email || order.contact_email;
    const totalPrice = parseFloat(order.total_price || '0');

    if (!email || totalPrice <= 0) {
      console.warn('Webhook: Missing email or invalid total_price', { email, totalPrice });
      res.status(200).send('OK');
      return;
    }

    const normalizedEmail = email.toLowerCase();

    // Get multiplier from settings
    const setting = await db('settings').where({ key: 'coins_multiplier' }).first();
    const multiplier = setting ? parseInt(setting.value, 10) : config.coinsMultiplier;

    // Calculate coins
    const coinsEarned = Math.floor(totalPrice * multiplier);

    // Find or create user
    let user = await db('users').where({ email: normalizedEmail }).first();

    if (!user) {
      // Create a "pending" user (no password) — they can register later
      const [userId] = await db('users').insert({
        email: normalizedEmail,
        name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || null,
      });
      user = await db('users').where({ id: userId }).first();
    }

    // Add coins
    await addCoins({
      userId: user.id,
      amount: coinsEarned,
      description: `Compra #${order.order_number || order.id} — ${totalPrice.toFixed(2)}€`,
      orderId: String(order.id),
      webhookId: webhookId || undefined,
    });

    console.log(`✅ ${coinsEarned} coins added to ${normalizedEmail} for order #${order.order_number}`);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Error');
  }
});

export default router;
