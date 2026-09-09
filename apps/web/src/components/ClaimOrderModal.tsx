'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { api } from '../lib/api';

interface ClaimOrderModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSuccess: (coinsEarned: number) => void;
}

export function ClaimOrderModal({ isOpen, onClose, onSuccess }: ClaimOrderModalProps) {
 const [orderName, setOrderName] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState('');

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!orderName.trim()) return;

 setIsLoading(true);
 setError('');

 try {
 const formattedOrderName = orderName.startsWith('#') ? orderName : `#${orderName}`;
 const response = await api.post<{ success: boolean; coinsEarned: number; orderName: string }>('/rewards/claim-order', {
 orderName: formattedOrderName,
 });

 onSuccess(response.coinsEarned);
 setOrderName('');
 onClose();
 } catch (err: any) {
 setError(err.message || 'Error al reclamar el pedido. Verifica el código y vuelve a intentarlo.');
 } finally {
 setIsLoading(false);
 }
 };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm relative pointer-events-auto win-frame font-mono selection:bg-[#ca3a3a]"
            >
              {/* Window Titlebar */}
              <div className="win-titlebar">
                <span className="flex items-center gap-1.5 truncate">
                  <span>💾</span>
                  <span>C:\ORDERS\CLAIM.EXE</span>
                </span>
                <button
                  onClick={onClose}
                  className="win-btn"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 bg-[#0a0a0a]">
                <div className="mb-4">
                  <div className="w-10 h-10 bg-[#1a0505] border border-[#ca3a3a] flex items-center justify-center mb-3 text-[#ca3a3a]">
                    <Search className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider mb-1">
                    Reclamar Compra
                  </h2>
                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    Introduce el código de tu pedido de Shopify (ej. <span className="text-white font-bold">#1024</span>) para sincronizar tus coins al instante.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={orderName}
                      onChange={(e) => setOrderName(e.target.value)}
                      placeholder="#1024"
                      className="retro-input w-full text-center text-lg tracking-widest uppercase font-bold"
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-[#ff6b6b] bg-[#1a0505] border border-[#ca3a3a] py-2 px-3 text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={!orderName.trim()}
                  >
                    VERIFICAR Y RECLAMAR
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
