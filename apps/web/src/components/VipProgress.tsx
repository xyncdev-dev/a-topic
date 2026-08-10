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
 platinum: '#FCA5A5',
};

const tierGradients: Record<string, string> = {
 bronze: 'bg-gradient-to-r from-[#CD7F32] to-[#A0522D]',
 silver: 'bg-gradient-to-r from-[#C0C0C0] to-[#808080]',
 gold: 'bg-gradient-to-r from-[#FFD700] to-[#B8860B]',
 platinum: 'bg-gradient-to-r from-[#FCA5A5] to-[#E50914]',
};

export function VipProgress({ tierInfo, className = '' }: VipProgressProps) {
 const { current, next, progress, coinsToNext } = tierInfo;
 const currentColor = tierColors[current.slug] || '#E50914';
 const currentGradient = tierGradients[current.slug] || ' ';

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.1 }}
 className={` p-5 ${className}`}
 >
 {/* Tier Badge + Name */}
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center gap-3">
 <div
 className="w-10 h-10 flex items-center justify-center text-xl"
 style={{ backgroundColor: `${currentColor}20` }}
 >
 {current.icon}
 </div>
 <div>
 <p className="text-xs text-[#A1A1AA] uppercase tracking-wider font-medium">Nivel VIP</p>
 <p className="text-lg font-bold font-[family-name:var(--font-display)]" style={{ color: currentColor }}>
 {current.name}
 </p>
 </div>
 </div>

 {next && (
 <div className="text-right">
 <p className="text-xs text-[#A1A1AA]">Siguiente</p>
 <p className="text-sm font-semibold text-white/80">
 {next.icon} {next.name}
 </p>
 </div>
 )}
 </div>

 {/* Progress Bar */}
 <div className="relative h-3 bg-white/[0.06] overflow-hidden">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${progress}%` }}
 transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
 className={`absolute inset-y-0 left-0 ${currentGradient}`}
 />
 {/* Shimmer on progress bar */}
 <motion.div
 initial={{ x: '-100%' }}
 animate={{ x: '200%' }}
 transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
 className="absolute inset-y-0 w-1/3 via-white/20"
 />
 </div>

 {/* Progress Label */}
 <div className="flex items-center justify-between mt-2">
 <span className="text-xs text-[#A1A1AA]">
 {Math.round(progress)}%
 </span>
 {next ? (
 <span className="text-xs text-[#A1A1AA]">
 <span className="text-white/70 font-medium">{coinsToNext.toLocaleString('es-ES')}</span> coins para {next.name}
 </span>
 ) : (
 <span className="text-xs text-[#A1A1AA]">¡Nivel máximo alcanzado! 🎉</span>
 )}
 </div>
 </motion.div>
 );
}
