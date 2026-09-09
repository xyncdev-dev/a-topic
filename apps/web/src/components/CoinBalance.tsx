'use client';

import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const { isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();

  const handleClaimSuccess = async (coinsEarned: number) => {
    setSuccessMessage(`¡Has ganado ${coinsEarned} coins!`);
    await refreshUser();
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleOpenClaim = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsClaimModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`win-frame font-mono selection:bg-[#ca3a3a] ${className}`}
    >
      {/* Window Titlebar */}
      <div className="win-titlebar">
        <span className="flex items-center gap-1.5">
          <span>📁</span>
          <span>C:\ATOPIC\WALLET.SYS</span>
        </span>
        <div className="win-controls flex items-center gap-1">
          <span className="win-btn" aria-hidden="true">_</span>
          <span className="win-btn" aria-hidden="true">□</span>
          <span className="win-btn" aria-hidden="true">✕</span>
        </div>
      </div>

      {/* Success message popup */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-500/90 text-white p-2.5 text-center font-bold text-xs border-b border-emerald-600"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5 bg-[#0a0a0a]">
        {/* Retro Inset LCD-like Balance Screen */}
        <div className="retro-inset p-4 mb-4">
          <div className="flex items-center justify-between text-[11px] text-[#A1A1AA] uppercase tracking-wider mb-1">
            <span>BALANCE DISPONIBLE</span>
            <span className={isAuthenticated ? "text-emerald-400 font-bold" : "text-[#A1A1AA]"}>
              {isAuthenticated ? "● ACTIVE" : "○ GUEST"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#ca3a3a] font-[family-name:var(--font-mono)]">
              <AnimatedNumber value={balance} />
            </span>
            <span className="text-sm uppercase font-bold text-[#A1A1AA]">
              COINS
            </span>
          </div>
        </div>

        {/* Action strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1a0505]">
          <p className="text-xs text-[#A1A1AA]">
            1€ gastado en Shopify = 10 VIP Coins
          </p>
          <button
            type="button"
            onClick={handleOpenClaim}
            className="btn-retro text-xs py-1.5 px-3 self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>+</span>
            <span>{isAuthenticated ? 'Reclamar Pedido' : 'Acceder y Reclamar'}</span>
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
