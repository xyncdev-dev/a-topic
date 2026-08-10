import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import db from '../db/connection';
import { deductCoins } from '../services/coinService';
import { findCustomerByEmail, createDiscountCode } from '../services/shopifyService';

const router = Router();

// GET /api/rewards — List all active rewards
router.get('/', async (_req, res: Response) => {
  try {
    const rewards = await db('rewards').where({ is_active: true }).orderBy('coins_cost', 'asc');

    res.json(
      rewards.map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        coinsCost: r.coins_cost,
        discountValue: r.discount_value,
        discountType: r.discount_type,
        imageUrl: r.image_url,
        isActive: r.is_active,
      }))
    );
  } catch (error) {
    console.error('Rewards list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rewards/redeem — Redeem a reward
router.post('/redeem', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { rewardId } = req.body;
    const userId = req.user!.userId;
    const userEmail = req.user!.email;

    if (!rewardId) {
      res.status(400).json({ error: 'rewardId is required' });
      return;
    }

    // Get reward details
    const reward = await db('rewards').where({ id: rewardId, is_active: true }).first();
    if (!reward) {
      res.status(404).json({ error: 'Reward not found or inactive' });
      return;
    }

    // Check user balance
    const user = await db('users').where({ id: userId }).first();
    if (!user || user.current_balance < reward.coins_cost) {
      res.status(400).json({ error: 'Insufficient coins' });
      return;
    }

    // Find Shopify customer
    const customerGid = await findCustomerByEmail(userEmail);

    // Create discount code on Shopify
    const discountCode = await createDiscountCode(
      customerGid,
      reward.discount_value,
      reward.discount_type,
      reward.title
    );

    // Deduct coins from user
    const newBalance = await deductCoins({
      userId,
      amount: reward.coins_cost,
      description: `Canje: ${reward.title}`,
      rewardId: reward.id,
      discountCode,
    });

    res.json({
      success: true,
      discountCode,
      reward: {
        id: reward.id,
        title: reward.title,
        description: reward.description,
        coinsCost: reward.coins_cost,
        discountValue: reward.discount_value,
        discountType: reward.discount_type,
        imageUrl: reward.image_url,
        isActive: reward.is_active,
      },
      newBalance,
    });
  } catch (error: any) {
    console.error('Redeem error:', error);

    if (error.message === 'Insufficient coins') {
      res.status(400).json({ error: 'Insufficient coins' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/rewards/claim-order — Manual order claim
router.post('/claim-order', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderName } = req.body;
    const userId = req.user!.userId;
    const userEmail = req.user!.email;

    if (!orderName) {
      res.status(400).json({ error: 'El código de pedido es requerido' });
      return;
    }

    const { getOrderByName } = await import('../services/shopifyService');
    const order = await getOrderByName(orderName);
    
    if (!order) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    if (!order.email || order.email.toLowerCase() !== userEmail.toLowerCase()) {
      res.status(403).json({ error: 'Este pedido no está asociado a tu cuenta de email' });
      return;
    }

    if (order.financial_status !== 'paid') {
      res.status(400).json({ error: 'El pedido no figura como pagado' });
      return;
    }

    const orderIdStr = order.id.toString();
    const existingTx = await db('transactions').where({ order_id: orderIdStr }).first();
    if (existingTx) {
      res.status(400).json({ error: 'Este pedido ya ha sido reclamado previamente' });
      return;
    }

    const { config } = await import('../config');
    const { addCoins } = await import('../services/coinService');
    
    const amount = Math.floor(parseFloat(order.total_price) * config.coinsMultiplier);
    await addCoins({
      userId,
      amount,
      description: `Compra en tienda ${order.name}`,
      orderId: orderIdStr,
    });

    res.json({ success: true, coinsEarned: amount, orderName: order.name });
  } catch (error) {
    console.error('Claim order error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
