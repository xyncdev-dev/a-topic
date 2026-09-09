'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { RewardCard } from '../../components/RewardCard';
import { RedeemModal } from '../../components/RedeemModal';
import { SITE_DATA } from '../../data';
import type { Reward, RedeemResponse, BalanceResponse } from '@a-topic/shared';

export default function RewardsPage() {
  const { isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [balance, setBalance] = useState(0);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{ code: string; title: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Rewards catalog is public
      const rewardsRes = await api.get<Reward[]>('/rewards');
      setRewards(rewardsRes);

      // Fetch balance only if authenticated
      if (isAuthenticated) {
        try {
          const balanceRes = await api.get<BalanceResponse>('/user/balance');
          setBalance(balanceRes.currentBalance);
        } catch (err) {
          console.error('Failed to fetch user balance:', err);
        }
      }
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRedeem = async (reward: Reward) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isRedeeming) return;
    setIsRedeeming(true);

    try {
      const result = await api.post<RedeemResponse>('/rewards/redeem', { rewardId: reward.id });
      setBalance(result.newBalance);
      setRedeemResult({ code: result.discountCode, title: reward.title });
      setModalOpen(true);
      await refreshUser();
    } catch (error: any) {
      alert(error.message || 'Error al canjear');
    } finally {
      setIsRedeeming(false);
    }
  };

  const { rewards: rewardsData, shopify } = SITE_DATA;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 safe-bottom font-mono selection:bg-[#ca3a3a]">
      {/* Rewards OS Window */}
      <div className="win-frame">
        {/* Titlebar */}
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>🏷</span>
            <span>{rewardsData.windowTitle}</span>
          </span>
          <div className="win-controls flex items-center gap-1">
            <span className="win-btn" aria-hidden="true">_</span>
            <span className="win-btn" aria-hidden="true">□</span>
            <span className="win-btn" aria-hidden="true">✕</span>
          </div>
        </div>

        {/* Interior */}
        <div className="p-4 sm:p-5 bg-[#0a0a0a]">
          {/* Balance LCD Bar */}
          <div className="retro-inset p-3 sm:p-4 mb-5 flex flex-wrap items-center justify-between gap-3">
            {isAuthenticated ? (
              <>
                <div>
                  <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                    {rewardsData.balanceLabel}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-[#ca3a3a] tracking-wider">
                    {balance.toLocaleString('es-ES')} <span className="text-xs text-white">COINS</span>
                  </p>
                </div>
                <a
                  href={shopify.storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-retro text-xs py-1.5 px-3"
                >
                  {rewardsData.btnShopify}
                </a>
              </>
            ) : (
              <>
                <div>
                  <p className="text-[10px] text-[#ca3a3a] font-bold uppercase tracking-wider">
                    {rewardsData.guestTitle}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-white tracking-wide mt-0.5">
                    {rewardsData.guestDescription}
                  </p>
                </div>
                <Link
                  href="/login"
                  className="btn-retro text-xs py-1.5 px-3 !bg-[#ca3a3a] !text-white hover:!bg-[#e04848]"
                >
                  {rewardsData.guestCta}
                </Link>
              </>
            )}
          </div>

          {/* Description */}
          <div className="mb-4 pb-3 border-b border-[#1a0505] flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              {rewardsData.sectionTitle}
            </h2>
            <span className="text-[11px] text-[#A1A1AA]">
              {rewards.length} DISPONIBLES
            </span>
          </div>

          {/* Rewards Grid */}
          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userBalance={balance}
                onRedeem={handleRedeem}
                index={index}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>

          {rewards.length === 0 && (
            <div className="retro-inset p-8 text-center mt-4">
              <span className="text-2xl animate-[coin-spin_0.6s_ease-out] inline-block mb-2 text-[#ca3a3a]">
                ⚙
              </span>
              <p className="text-white text-sm font-bold">{rewardsData.loadingText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Redeem Modal */}
      <RedeemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        discountCode={redeemResult?.code || null}
        rewardTitle={redeemResult?.title || ''}
      />
    </div>
  );
}
