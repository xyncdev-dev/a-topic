'use client';

import { motion } from 'framer-motion';
import type { TierInfo } from '@a-topic/shared';

interface VipProgressProps {
  tierInfo: TierInfo;
  className?: string;
}

const tierColors: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#ff6b6b',
};

export function VipProgress({ tierInfo, className = '' }: VipProgressProps) {
  const { current, next, progress, coinsToNext } = tierInfo;
  const currentColor = tierColors[current.slug] || '#ca3a3a';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className={`win-frame font-mono selection:bg-[#ca3a3a] ${className}`}
    >
      {/* Titlebar */}
      <div className="win-titlebar">
        <span className="flex items-center gap-1.5">
          <span>⚙</span>
          <span>C:\ATOPIC\VIP_TIER.DAT</span>
        </span>
        <div className="win-controls flex items-center gap-1">
          <span className="win-btn" aria-hidden="true">_</span>
          <span className="win-btn" aria-hidden="true">□</span>
          <span className="win-btn" aria-hidden="true">✕</span>
        </div>
      </div>

      <div className="p-5 bg-[#0a0a0a]">
        {/* Tier Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 border-2 border-t-[#ca3a3a] border-l-[#ca3a3a] border-b-[#1a0505] border-r-[#1a0505] bg-[#111111] flex items-center justify-center text-lg"
            >
              {current.icon}
            </div>
            <div>
              <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider">
                Nivel Actual
              </p>
              <p
                className="text-base font-bold uppercase tracking-wider"
                style={{ color: currentColor }}
              >
                {current.name}
              </p>
            </div>
          </div>

          {next && (
            <div className="text-right">
              <p className="text-[11px] text-[#A1A1AA] uppercase tracking-wider">Siguiente</p>
              <p className="text-xs font-bold text-white uppercase">
                {next.icon} {next.name}
              </p>
            </div>
          )}
        </div>

        {/* Retro Segmented Progress Bar */}
        <div className="retro-inset p-1">
          <div className="relative h-4 bg-[#050505] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-[#ca3a3a] border-r border-[#ff6b6b]"
            />
          </div>
        </div>

        {/* Progress Information */}
        <div className="flex items-center justify-between mt-3 text-xs">
          <span className="text-white font-bold bg-[#111] border border-[#1a0505] px-2 py-0.5">
            {Math.round(progress)}%
          </span>
          {next ? (
            <span className="text-[#A1A1AA]">
              Faltan <span className="text-white font-bold">{coinsToNext.toLocaleString('es-ES')}</span> coins para {next.name}
            </span>
          ) : (
            <span className="text-emerald-400 font-bold">¡NIVEL MÁXIMO ALCANZADO!</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
