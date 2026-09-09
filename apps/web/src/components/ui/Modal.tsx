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
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal Content - Retro Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto win-frame font-mono selection:bg-[#ca3a3a]"
          >
            {/* Retro Titlebar */}
            <div className="win-titlebar">
              <span className="flex items-center gap-1.5">
                <span>⚠</span>
                <span>SYSTEM_DIALOG // A-TYPIC</span>
              </span>
              <button
                onClick={onClose}
                className="win-btn"
                aria-label="Cerrar ventana"
              >
                ✕
              </button>
            </div>

            {/* Window Interior */}
            <div className="p-5 bg-[#0a0a0a] text-white">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
