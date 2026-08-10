'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
 // Prevent body scroll when modal is open
 useEffect(() => {
 if (isOpen) {
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = '';
 }
 return () => {
 document.body.style.overflow = '';
 };
 }, [isOpen]);

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="fixed inset-0 bg-black/70 z-50"
 onClick={onClose}
 />

 {/* Modal Content */}
 <motion.div
 initial={{ opacity: 0, scale: 0.9, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 20 }}
 transition={{ type: 'spring', stiffness: 300, damping: 25 }}
 className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
 >
 <div className="p-6 relative overflow-hidden">
 {/* Decorative glow */}
 <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#E50914]/20 blur-3xl pointer-events-none" />
 <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#7F1D1D]/20 blur-3xl pointer-events-none" />

 {/* Close button */}
 <button
 onClick={onClose}
 className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white transition-colors z-10 cursor-pointer"
 aria-label="Close modal"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>

 <div className="relative z-10">{children}</div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}
