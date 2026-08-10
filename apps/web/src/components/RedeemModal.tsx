'use client';

import { motion } from 'framer-motion';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useState } from 'react';

interface RedeemModalProps {
 isOpen: boolean;
 onClose: () => void;
 discountCode: string | null;
 rewardTitle: string;
}

export function RedeemModal({ isOpen, onClose, discountCode, rewardTitle }: RedeemModalProps) {
 const [copied, setCopied] = useState(false);

 const copyCode = async () => {
 if (!discountCode) return;
 try {
 await navigator.clipboard.writeText(discountCode);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 } catch {
 // Fallback
 const textarea = document.createElement('textarea');
 textarea.value = discountCode;
 document.body.appendChild(textarea);
 textarea.select();
 document.execCommand('copy');
 document.body.removeChild(textarea);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 }
 };

 return (
 <Modal isOpen={isOpen} onClose={onClose}>
 <div className="text-center">
 {/* Success animation */}
 <motion.div
 initial={{ scale: 0, rotate: -180 }}
 animate={{ scale: 1, rotate: 0 }}
 transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
 className="w-20 h-20 mx-auto mb-5 E50914] 7F1D1D] flex items-center justify-center"
 >
 <motion.svg
 initial={{ pathLength: 0 }}
 animate={{ pathLength: 1 }}
 transition={{ duration: 0.5, delay: 0.4 }}
 className="w-10 h-10 text-white"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <motion.path
 initial={{ pathLength: 0 }}
 animate={{ pathLength: 1 }}
 transition={{ duration: 0.5, delay: 0.4 }}
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={3}
 d="M5 13l4 4L19 7"
 />
 </motion.svg>
 </motion.div>

 {/* Confetti emojis */}
 {['🎉', '✨', '🎊', '⭐'].map((emoji, i) => (
 <motion.span
 key={i}
 initial={{ opacity: 0, y: 0, x: 0 }}
 animate={{
 opacity: [0, 1, 0],
 y: [0, -60 - i * 20],
 x: [(i % 2 === 0 ? -1 : 1) * (30 + i * 15)],
 }}
 transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
 className="absolute text-2xl pointer-events-none"
 style={{ left: '50%', top: '30%' }}
 >
 {emoji}
 </motion.span>
 ))}

 <motion.h3
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="text-xl font-bold font-[family-name:var(--font-display)] text-white mb-2"
 >
 ¡Canje exitoso!
 </motion.h3>

 <motion.p
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.4 }}
 className="text-sm text-[#A1A1AA] mb-6"
 >
 {rewardTitle} canjeado correctamente
 </motion.p>

 {/* Discount code display */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.5 }}
 className="bg-white/[0.06] p-4 mb-4"
 >
 <p className="text-xs text-[#A1A1AA] mb-2 uppercase tracking-wider">Tu código de descuento</p>
 <button
 onClick={copyCode}
 className="w-full cursor-pointer group"
 >
 <p className="text-2xl font-bold font-mono tracking-wider group-hover:opacity-80 transition-opacity">
 {discountCode}
 </p>
 <p className="text-xs text-[#A1A1AA] mt-2 flex items-center justify-center gap-1">
 {copied ? (
 <>
 <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
 </svg>
 <span className="text-green-400">¡Copiado!</span>
 </>
 ) : (
 <>
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
 </svg>
 Toca para copiar
 </>
 )}
 </p>
 </button>
 </motion.div>

 <p className="text-xs text-[#A1A1AA] mb-5">
 Usa este código en el checkout de la tienda A-Topic. Válido para un solo uso.
 </p>

 <Button variant="primary" size="lg" className="w-full" onClick={onClose}>
 Entendido
 </Button>
 </div>
 </Modal>
 );
}
