'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { EARN_RULES } from '@a-topic/shared';
import { ClaimOrderModal } from '../../components/ClaimOrderModal';
import { useAuth } from '../../context/AuthContext';
import { SITE_DATA } from '../../data';

import { ShoppingBag, Camera, UserPlus, Cake, Star, Lightbulb, Search } from 'lucide-react';

const ruleIcons: Record<string, React.ReactNode> = {
  purchase: <ShoppingBag className="w-6 h-6" />,
  instagram: <Camera className="w-6 h-6" />,
  referral: <UserPlus className="w-6 h-6" />,
  birthday: <Cake className="w-6 h-6" />,
  review: <Star className="w-6 h-6" />,
};

export default function EarnPage() {
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState('');
  const { isAuthenticated, refreshUser } = useAuth();
  const router = useRouter();

  const handleClaimSuccess = async (coinsEarned: number) => {
    setClaimSuccess(`¡Has reclamado con éxito ${coinsEarned} coins!`);
    await refreshUser();
    setTimeout(() => setClaimSuccess(''), 5000);
  };

  const handleOpenClaimModal = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setClaimModalOpen(true);
  };

  const { earn } = SITE_DATA;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 safe-bottom font-mono selection:bg-[#ca3a3a]">
      {/* Main OS Window */}
      <div className="win-frame">
        {/* Titlebar */}
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>💎</span>
            <span>{earn.windowTitle}</span>
          </span>
          <div className="win-controls flex items-center gap-1">
            <span className="win-btn" aria-hidden="true">_</span>
            <span className="win-btn" aria-hidden="true">□</span>
            <span className="win-btn" aria-hidden="true">✕</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#0a0a0a]">
          {/* Claim Success Banner */}
          <AnimatePresence>
            {claimSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/90 text-white p-2.5 text-center font-bold text-xs mb-4 border border-emerald-600"
              >
                {claimSuccess}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Retro Inset Info Banner */}
          <div className="retro-inset p-4 sm:p-5 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#ca3a3a] mb-1">
                  <span className="font-black text-base">⚠</span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    {earn.bannerTitle}
                  </h2>
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xl">
                  {earn.bannerDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenClaimModal}
                className="btn-retro text-xs py-2 px-4 whitespace-nowrap self-start sm:self-center !bg-[#ca3a3a] !text-white hover:!bg-[#e04848]"
              >
                {isAuthenticated ? earn.claimButtonAuth : earn.claimButtonGuest}
              </button>
            </div>
          </div>

          {/* Section Header */}
          <div className="mb-4 pb-2 border-b border-[#1a0505] flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {earn.sectionTitle}
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold">
              SYS_ACTIVE [OK]
            </span>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EARN_RULES.map((rule, index) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className="p-3.5 bg-[#0d0d0d] border border-[#1a0505] hover:border-[#ca3a3a] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#111] border border-[#ca3a3a] flex items-center justify-center text-[#ca3a3a]">
                      {ruleIcons[rule.id] || <Star className="w-4 h-4" />}
                    </div>
                    {rule.isAutomatic ? (
                      <span className="retro-badge text-emerald-400 border-emerald-500/40 bg-emerald-500/10">
                        AUTOMÁTICO
                      </span>
                    ) : (
                      <span className="retro-badge">MANUAL</span>
                    )}
                  </div>

                  <h4 className="font-bold text-white text-xs tracking-wider uppercase mb-1">
                    {rule.title}
                  </h4>
                  <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                    {rule.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1a0505] flex items-center justify-between">
                  <span className="text-[10px] text-[#A1A1AA] uppercase">Recompensa</span>
                  <span className="text-xs font-black text-[#ff6b6b] tracking-wider">
                    {rule.coinsAmount}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* System Footer Note */}
          <div className="mt-6 pt-3 border-t border-[#1a0505] text-center">
            <p className="text-[11px] text-[#A1A1AA]">
              {earn.footerNote}
            </p>
          </div>
        </div>
      </div>

      <ClaimOrderModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onSuccess={handleClaimSuccess}
      />
    </div>
  );
}
