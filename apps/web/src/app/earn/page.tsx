'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EARN_RULES } from '@a-topic/shared';
import { ClaimOrderModal } from '../../components/ClaimOrderModal';
import { useAuth } from '../../context/AuthContext';

import { ShoppingBag, Camera, UserPlus, Cake, Star, Lightbulb, Search } from 'lucide-react';

const ruleIcons: Record<string, React.ReactNode> = {
 purchase: <ShoppingBag className="w-6 h-6" />,
 instagram: <Camera className="w-6 h-6" />,
 referral: <UserPlus className="w-6 h-6" />,
 birthday: <Cake className="w-6 h-6" />,
 review: <Star className="w-6 h-6" />,
};

export default function EarnPage() {


 return (
 <div className="px-4 pt-6 safe-bottom">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-6"
 >
 <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white">
 Ganar Coins
 </h1>
 <p className="text-sm text-[#A1A1AA] mt-1">
 Descubre todas las formas de acumular coins
 </p>
 </motion.div>

 {/* Highlight Card */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="relative overflow-hidden p-6 mb-6"
 >
 <div className="absolute inset-0 E50914]/20 7F1D1D]/20" />
 <div className="absolute inset-0" />
 <div className="relative z-10">
 <div className="mb-3 text-white"><Lightbulb className="w-8 h-8" /></div>
 <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-white mb-2">
 ¿Cómo funciona?
 </h2>
 <p className="text-sm text-white/70 leading-relaxed">
 Cada euro que gastas en A-Topic se convierte automáticamente en coins.
 Acumula coins para subir de nivel VIP y desbloquea recompensas exclusivas.
 </p>
 </div>
 </motion.div>

 {/* Earn Rules */}
 <div className="space-y-3">
 {EARN_RULES.map((rule, index) => (
 <motion.div
 key={rule.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
 className="p-4 flex items-start gap-4"
 >
 <div className="w-12 h-12 bg-white/[0.04] flex items-center justify-center flex-shrink-0 text-[#E50914]">
 {ruleIcons[rule.id]}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-start justify-between gap-2">
 <h3 className="font-semibold text-white text-sm">{rule.title}</h3>
 {rule.isAutomatic && (
 <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
 Auto
 </span>
 )}
 </div>
 <p className="text-xs text-[#71717A] mt-1 leading-relaxed">{rule.description}</p>
 <div className="mt-2 flex items-center gap-1.5">
 <span className="text-sm font-bold">{rule.coinsAmount}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Bottom note */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.8 }}
 className="mt-6 text-center"
 >
 <p className="text-xs text-[#52525B]">
 Las coins de compras se acreditan automáticamente al procesar el pago.
 <br />
 Las coins manuales serán revisadas por nuestro equipo.
 </p>
 </motion.div>

 <div className="h-4" />
 </div>
 );
}
