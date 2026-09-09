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
      <div className="text-center font-mono">
        {/* Success icon badge */}
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-14 h-14 mx-auto mb-4 bg-[#1a0505] border-2 border-[#ca3a3a] flex items-center justify-center text-[#ff6b6b]"
        >
          <span className="text-2xl font-black">✓</span>
        </motion.div>

        <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">
          ¡CANJE REALIZADO CON ÉXITO!
        </h3>

        <p className="text-xs text-[#A1A1AA] mb-4">
          Has desbloqueado <span className="text-white font-bold">{rewardTitle}</span>.
        </p>

        {/* Voucher Code Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#050505] border-2 border-dashed border-[#ca3a3a] p-4 mb-4 select-none"
        >
          <p className="text-[10px] text-[#A1A1AA] mb-1.5 uppercase tracking-widest">
            CÓDIGO DE DESCUENTO SHOPIFY
          </p>

          <button
            onClick={copyCode}
            type="button"
            className="w-full cursor-pointer group py-2 px-3 bg-[#111] hover:bg-[#1a0505] border border-[#333] hover:border-[#ca3a3a] transition-colors"
          >
            <p className="text-xl font-black tracking-widest text-[#ff6b6b] group-hover:text-white transition-colors">
              {discountCode}
            </p>
            <p className="text-[10px] text-[#A1A1AA] mt-1 flex items-center justify-center gap-1">
              {copied ? (
                <span className="text-emerald-400 font-bold">¡CÓDIGO COPIADO AL PORTAPAPELES!</span>
              ) : (
                <span>[ TOCAR PARA COPIAR ]</span>
              )}
            </p>
          </button>
        </motion.div>

        <p className="text-[11px] text-[#A1A1AA] mb-5 leading-relaxed">
          Introduce este código en la pantalla de pago de Shopify. Válido para un único pedido.
        </p>

        <Button variant="primary" size="md" className="w-full" onClick={onClose}>
          ENTENDIDO
        </Button>
      </div>
    </Modal>
 );
}
