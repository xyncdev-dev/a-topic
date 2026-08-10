'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { RewardCard } from '../../components/RewardCard';
import { RedeemModal } from '../../components/RedeemModal';
import type { Reward, RedeemResponse, BalanceResponse } from '@a-topic/shared';

export default function RewardsPage() {
 const { isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
 const router = useRouter();

 const [rewards, setRewards] = useState<Reward[]>([]);
 const [balance, setBalance] = useState(0);
 const [isRedeeming, setIsRedeeming] = useState(false);
 const [modalOpen, setModalOpen] = useState(false);
 const [redeemResult, setRedeemResult] = useState<{ code: string; title: string } | null>(null);

 const fetchData = useCallback(async () => {
 try {
 const [rewardsRes, balanceRes] = await Promise.all([
 api.get<Reward[]>('/rewards'),
 api.get<BalanceResponse>('/user/balance'),
 ]);
 setRewards(rewardsRes);
 setBalance(balanceRes.currentBalance);
 } catch (error) {
 console.error('Failed to fetch rewards:', error);
 }
 }, []);

 useEffect(() => {
 if (!authLoading && !isAuthenticated) {
 router.replace('/login');
 return;
 }
 if (isAuthenticated) {
 fetchData();
 }
 }, [isAuthenticated, authLoading, router, fetchData]);

 const handleRedeem = async (reward: Reward) => {
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

 return (
 <div className="px-4 pt-6 safe-bottom">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-6"
 >
 <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white">
 Recompensas
 </h1>
 <p className="text-sm text-[#A1A1AA] mt-1">
 Canjea tus coins por descuentos exclusivos
 </p>
 </motion.div>

 {/* Current balance pill */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.1 }}
 className="px-4 py-3 flex items-center justify-between mb-6"
 >
 <span className="text-sm text-[#A1A1AA]">Tu balance</span>
 <div className="flex items-center gap-1.5">
 <span className="text-lg"></span>
 <span className="text-lg font-bold font-[family-name:var(--font-display)] text-white">
 {balance.toLocaleString('es-ES')}
 </span>
 </div>
 </motion.div>

 {/* Rewards Grid */}
 <div className="space-y-3">
 {rewards.map((reward, index) => (
 <RewardCard
 key={reward.id}
 reward={reward}
 userBalance={balance}
 onRedeem={handleRedeem}
 index={index}
 />
 ))}
 </div>

 {rewards.length === 0 && (
 <div className="p-8 text-center mt-4">
 <div className="text-4xl mb-3"></div>
 <p className="text-[#A1A1AA] text-sm">Cargando recompensas...</p>
 </div>
 )}

 {/* Redeem Modal */}
 <RedeemModal
 isOpen={modalOpen}
 onClose={() => setModalOpen(false)}
 discountCode={redeemResult?.code || null}
 rewardTitle={redeemResult?.title || ''}
 />

 <div className="h-4" />
 </div>
 );
}
