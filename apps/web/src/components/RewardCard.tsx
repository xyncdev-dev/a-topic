'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import type { Reward } from '@a-topic/shared';

interface RewardCardProps {
  reward: Reward;
  userBalance: number;
  onRedeem: (reward: Reward) => void;
  index: number;
  isAuthenticated?: boolean;
}

const rewardIcons: Record<string, string> = {
  'Cupón 5€': '🏷️',
  'Cupón 10€': '🎫',
  'Cupón 20€': '💰',
  'Cupón 50€': '💎',
  'Envío Gratis': '📦',
};

export function RewardCard({
  reward,
  userBalance,
  onRedeem,
  index,
  isAuthenticated = true,
}: RewardCardProps) {
  const canAfford = isAuthenticated ? userBalance >= reward.coinsCost : true;
  const isAvailable = isAuthenticated && userBalance >= reward.coinsCost;
  const icon = rewardIcons[reward.title] || '🏷️';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`p-4 font-mono select-none transition-all ${
        !isAuthenticated
          ? 'bg-[#0d0d0d] border-2 border-[#330000] hover:border-[#ca3a3a] shadow-[2px_2px_0px_#000]'
          : canAfford
          ? 'bg-[#0d0d0d] border-2 border-[#ca3a3a_#1a0505_#1a0505_#ca3a3a] shadow-[2px_2px_0px_#000]'
          : 'bg-[#0a0a0a] border-2 border-[#1a0505] opacity-50'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left info */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 bg-[#111] border-2 border-t-[#ca3a3a] border-l-[#ca3a3a] border-b-[#1a0505] border-r-[#1a0505] flex items-center justify-center text-xl flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm tracking-wider uppercase truncate">
                {reward.title}
              </h3>
              {isAvailable && (
                <span className="retro-badge">DISPONIBLE</span>
              )}
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              {reward.description}
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1a0505]">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#A1A1AA] block uppercase">Coste</span>
            <span className="text-base font-bold text-[#ff6b6b] tracking-wider">
              {reward.coinsCost.toLocaleString('es-ES')}{' '}
              <span className="text-xs text-white">COINS</span>
            </span>
          </div>

          <Button
            variant={!isAuthenticated || canAfford ? 'primary' : 'secondary'}
            size="sm"
            disabled={isAuthenticated && !canAfford}
            onClick={() => onRedeem(reward)}
          >
            {!isAuthenticated ? 'ACCEDER' : canAfford ? 'CANJEAR' : 'BLOQUEADO'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
