'use client';

import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ClaimOrderModal } from './ClaimOrderModal';
import { useAuth } from '../context/AuthContext';

interface CoinBalanceProps {
 balance: number;
 className?: string;
}

function AnimatedNumber({ value }: { value: number }) {
 const motionVal = useMotionValue(0);
 const rounded = useTransform(motionVal, (v) => Math.floor(v).toLocaleString('es-ES'));
 const displayRef = useRef<HTMLSpanElement>(null);

 useEffect(() => {
 const controls = animate(motionVal, value, {
 duration: 1.5,
 ease: [0.25, 0.46, 0.45, 0.94],
 });
 return controls.stop;
 }, [value, motionVal]);

 useEffect(() => {
 return rounded.on('change', (v) => {
 if (displayRef.current) {
 displayRef.current.textContent = v;
 }
 });
 }, []);

 return <span ref={displayRef}>0</span>;
}

export function CoinBalance({ balance, className = '' }: CoinBalanceProps) {
 const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
 const [successMessage, setSuccessMessage] = useState('');
 const { refreshUser } = useAuth();

 const handleClaimSuccess = async (coinsEarned: number) => {
 setSuccessMessage(`¡Has ganado ${coinsEarned} coins!`);
 await refreshUser();
 setTimeout(() => setSuccessMessage(''), 5000);
 };

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className={`relative overflow-hidden p-6 ${className}`}
 >
 {/* Success message popup */}
 <AnimatePresence>
 {successMessage && (
 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -20 }}
 className="absolute top-4 left-4 right-4 bg-emerald-500/90 text-white p-3 z-50 text-center font-bold text-sm"
 >
 {successMessage}
 </motion.div>
 )}
 </AnimatePresence>

 {/* Background gradient */}
 <div className="absolute inset-0 E50914]/30 via-[#991B1B]/20 7F1D1D]/30" />
 <div className="absolute inset-0" />

 {/* Decorative elements */}
 <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#E50914]/20 blur-2xl" />
 <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#7F1D1D]/20 blur-2xl" />

 <div className="relative z-10">
 <div className="flex items-center justify-between mb-1">
 <span className="text-sm text-white/60 font-medium uppercase tracking-wider">Tu Balance</span>
 <motion.div
 animate={{ rotateY: [0, 360] }}
 transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 5 }}
 className="text-2xl"
 >
 
 </motion.div>
 </div>

 <div className="flex items-baseline gap-2">
 <span className="text-5xl font-bold font-[family-name:var(--font-display)] tracking-tight text-white">
 <AnimatedNumber value={balance} />
 </span>
 <span className="text-lg text-white/50 font-medium">coins</span>
 </div>

 {/* Shimmer line */}
 <div className="mt-4 h-px w-full via-white/20" />

 <div className="mt-4 flex flex-col gap-2">
 <p className="text-xs text-white/40">
 Canjea tus coins por descuentos exclusivos
 </p>
 <button 
 onClick={() => setIsClaimModalOpen(true)}
 className="text-xs text-[#E50914] font-medium hover:text-white transition-colors self-start underline underline-offset-2"
 >
 Reclamar código de compra
 </button>
 </div>
 </div>

 <ClaimOrderModal
 isOpen={isClaimModalOpen}
 onClose={() => setIsClaimModalOpen(false)}
 onSuccess={handleClaimSuccess}
 />
 </motion.div>
 );
}
