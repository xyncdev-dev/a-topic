'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import type { Reward } from '@a-topic/shared';

interface RewardCardProps {
 reward: Reward;
 userBalance: number;
 onRedeem: (reward: Reward) => void;
 index: number;
}

const rewardIcons: Record<string, string> = {
 'Cupón 5€': '🏷️',
 'Cupón 10€': '🎫',
 'Cupón 20€': '💰',
 'Cupón 50€': '💎',
 'Envío Gratis': '📦',
};

export function RewardCard({ reward, userBalance, onRedeem, index }: RewardCardProps) {
 const canAfford = userBalance >= reward.coinsCost;
 const icon = rewardIcons[reward.title] || '';

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: index * 0.08 }}
 whileHover={{ scale: 1.02, y: -2 }}
 className={` p-5 relative overflow-hidden transition-all duration-300 ${
 canAfford ? 'hover:border-[#E50914]/30' : 'opacity-60'
 }`}
 >
 {/* Background accent */}
 {canAfford && (
 <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#E50914]/10 blur-2xl" />
 )}

 <div className="relative z-10">
 {/* Icon + Title */}
 <div className="flex items-start justify-between mb-3">
 <div className="flex items-center gap-3">
 <div className="text-3xl">{icon}</div>
 <div>
 <h3 className="font-bold text-white font-[family-name:var(--font-display)]">{reward.title}</h3>
 <p className="text-xs text-[#A1A1AA] mt-0.5 line-clamp-2">{reward.description}</p>
 </div>
 </div>
 </div>

 {/* Cost + CTA */}
 <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
 <div className="flex items-center gap-1.5">
 <span className="text-lg"></span>
 <span className="text-lg font-bold text-white font-[family-name:var(--font-display)]">
 {reward.coinsCost.toLocaleString('es-ES')}
 </span>
 </div>

 <Button
 variant={canAfford ? 'primary' : 'secondary'}
 size="sm"
 disabled={!canAfford}
 onClick={() => onRedeem(reward)}
 >
 {canAfford ? 'Canjear' : 'Insuficiente'}
 </Button>
 </div>
 </div>
 </motion.div>
 );
}
