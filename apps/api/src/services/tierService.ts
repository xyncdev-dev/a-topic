import { VIP_TIERS } from '@a-topic/shared';
import type { VipTier, TierInfo } from '@a-topic/shared';

export function calculateTier(totalCoinsEarned: number): VipTier {
  // Tiers are sorted ascending by minCoins, return the highest that qualifies
  let currentTier = VIP_TIERS[0];
  for (const tier of VIP_TIERS) {
    if (totalCoinsEarned >= tier.minCoins) {
      currentTier = tier;
    }
  }
  return currentTier;
}

export function getNextTier(currentTier: VipTier): VipTier | null {
  const currentIndex = VIP_TIERS.findIndex((t) => t.slug === currentTier.slug);
  if (currentIndex < VIP_TIERS.length - 1) {
    return VIP_TIERS[currentIndex + 1];
  }
  return null; // Already at max tier
}

export function getTierProgress(totalCoinsEarned: number): number {
  const current = calculateTier(totalCoinsEarned);
  const next = getNextTier(current);

  if (!next) return 100; // Max tier reached

  const rangeStart = current.minCoins;
  const rangeEnd = next.minCoins;
  const progress = ((totalCoinsEarned - rangeStart) / (rangeEnd - rangeStart)) * 100;

  return Math.min(Math.max(progress, 0), 100);
}

export function getTierInfo(totalCoinsEarned: number): TierInfo {
  const current = calculateTier(totalCoinsEarned);
  const next = getNextTier(current);
  const progress = getTierProgress(totalCoinsEarned);
  const coinsToNext = next ? next.minCoins - totalCoinsEarned : 0;

  return {
    current,
    next,
    progress,
    coinsToNext,
    totalEarned: totalCoinsEarned,
  };
}
