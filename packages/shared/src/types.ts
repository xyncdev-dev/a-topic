// ─── User ──────────────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  name: string | null;
  currentBalance: number;
  totalEarned: number;
  tier: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  tierInfo: TierInfo;
}

// ─── Authentication ────────────────────────────────────────────
export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

// ─── Transactions ──────────────────────────────────────────────
export type TransactionType = 'earn' | 'redeem';

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: number;
  description: string;
  orderId: string | null;
  rewardId: number | null;
  discountCode: string | null;
  createdAt: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

// ─── Rewards ───────────────────────────────────────────────────
export type DiscountType = 'fixed_amount' | 'percentage';

export interface Reward {
  id: number;
  title: string;
  description: string;
  coinsCost: number;
  discountValue: number;
  discountType: DiscountType;
  imageUrl: string | null;
  isActive: boolean;
}

export interface RedeemRequest {
  rewardId: number;
}

export interface RedeemResponse {
  success: boolean;
  discountCode: string;
  reward: Reward;
  newBalance: number;
}

// ─── VIP Tiers ─────────────────────────────────────────────────
export interface VipTier {
  name: string;
  slug: string;
  minCoins: number;
  color: string;
  gradient: string;
  icon: string;
  benefits: string[];
}

export interface TierInfo {
  current: VipTier;
  next: VipTier | null;
  progress: number;       // 0-100 percentage
  coinsToNext: number;     // coins needed for next tier
  totalEarned: number;
}

// ─── Earn Rules ────────────────────────────────────────────────
export interface EarnRule {
  id: string;
  icon: string;
  title: string;
  description: string;
  coinsAmount: string;
  isAutomatic: boolean;
}

// ─── API ───────────────────────────────────────────────────────
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface BalanceResponse {
  currentBalance: number;
  totalEarned: number;
  tierInfo: TierInfo;
}
