import db from '../db/connection';
import { calculateTier } from './tierService';

interface AddCoinsParams {
  userId: number;
  amount: number;
  description: string;
  orderId?: string;
  webhookId?: string;
}

interface DeductCoinsParams {
  userId: number;
  amount: number;
  description: string;
  rewardId?: number | null;
  discountCode?: string | null;
}

export async function addCoins({ userId, amount, description, orderId, webhookId }: AddCoinsParams): Promise<void> {
  // Use a transaction to ensure atomicity
  await db.transaction(async (trx) => {
    // Check for webhook deduplication
    if (webhookId) {
      const existing = await trx('transactions').where({ webhook_id: webhookId }).first();
      if (existing) {
        console.log(`Webhook ${webhookId} already processed, skipping.`);
        return;
      }
    }

    // Insert earn transaction
    await trx('transactions').insert({
      user_id: userId,
      type: 'earn',
      amount,
      description,
      order_id: orderId || null,
      webhook_id: webhookId || null,
    });

    // Update user balance and total earned
    const user = await trx('users').where({ id: userId }).first();
    const newBalance = (user.current_balance || 0) + amount;
    const newTotal = (user.total_earned || 0) + amount;
    const newTier = calculateTier(newTotal);

    await trx('users').where({ id: userId }).update({
      current_balance: newBalance,
      total_earned: newTotal,
      tier: newTier.slug,
      updated_at: new Date().toISOString(),
    });
  });
}

export async function deductCoins({ userId, amount, description, rewardId, discountCode }: DeductCoinsParams): Promise<number> {
  let newBalance = 0;

  await db.transaction(async (trx) => {
    const user = await trx('users').where({ id: userId }).first();

    if (!user) {
      throw new Error('User not found');
    }

    if (user.current_balance < amount) {
      throw new Error('Insufficient coins');
    }

    newBalance = user.current_balance - amount;

    // Insert redeem transaction
    await trx('transactions').insert({
      user_id: userId,
      type: 'redeem',
      amount: -amount,
      description,
      reward_id: rewardId,
      discount_code: discountCode,
    });

    // Update user balance
    await trx('users').where({ id: userId }).update({
      current_balance: newBalance,
      updated_at: new Date().toISOString(),
    });
  });

  return newBalance;
}

export async function getBalance(userId: number): Promise<{ currentBalance: number; totalEarned: number }> {
  const user = await db('users').where({ id: userId }).first();
  if (!user) {
    throw new Error('User not found');
  }
  return {
    currentBalance: user.current_balance,
    totalEarned: user.total_earned,
  };
}

export async function getTransactions(userId: number, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const transactions = await db('transactions')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db('transactions')
    .where({ user_id: userId })
    .count('* as count');

  return {
    transactions: transactions.map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      orderId: t.order_id,
      rewardId: t.reward_id,
      discountCode: t.discount_code,
      createdAt: t.created_at,
    })),
    total: Number(count),
    page,
    limit,
  };
}
