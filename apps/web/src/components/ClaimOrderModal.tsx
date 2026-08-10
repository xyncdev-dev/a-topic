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
 className="fixed inset-0 bg-black/60 z-50"
 />
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="w-full max-w-sm p-6 relative pointer-events-auto border border-[#E50914]/20 bg-[#0A0A0A]"
 >
 <button
 onClick={onClose}
 className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white transition-colors"
 >
 <X className="w-5 h-5" />
 </button>

 <div className="mb-6 mt-2">
 <div className="w-12 h-12 bg-[#E50914]/10 flex items-center justify-center mb-4 border border-[#E50914]/20">
 <Search className="w-6 h-6 text-[#E50914]" />
 </div>
 <h2 className="text-xl font-bold text-white mb-1">Reclamar Compra</h2>
 <p className="text-sm text-[#A1A1AA]">
 Introduce el código de tu pedido de Shopify (ej. #1024) para obtener tus coins correspondientes.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <input
 type="text"
 value={orderName}
 onChange={(e) => setOrderName(e.target.value)}
 placeholder="#1024"
 className="w-full px-4 py-3 bg-[#111] text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 transition-all text-center text-lg tracking-widest font-mono uppercase"
 />
 </div>

 <AnimatePresence>
 {error && (
 <motion.p
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="text-sm text-red-400 text-center bg-red-500/10 py-2 px-3"
 >
 {error}
 </motion.p>
 )}
 </AnimatePresence>

 <Button
 type="submit"
 className="w-full bg-[#E50914] hover:bg-[#B91C1C] text-white"
 isLoading={isLoading}
 disabled={!orderName.trim()}
 >
 Verificar y Reclamar
 </Button>
 </form>
 </motion.div>
 </div>
 </>
 )}
 </AnimatePresence>
 );
}
