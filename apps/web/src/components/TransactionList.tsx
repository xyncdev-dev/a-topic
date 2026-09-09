'use client';

import { motion } from 'framer-motion';
import type { Transaction } from '@a-topic/shared';

interface TransactionListProps {
 transactions: Transaction[];
 showAll?: boolean;
 className?: string;
}

export function TransactionList({ transactions, showAll = false, className = '' }: TransactionListProps) {
 const items = showAll ? transactions : transactions.slice(0, 5);

 if (items.length === 0) {
 return (
 <div className={`retro-inset p-8 text-center font-mono ${className}`}>
 <div className="text-2xl mb-2 text-[#ca3a3a]">∅</div>
 <p className="text-white text-sm font-bold">NO SE ENCONTRARON REGISTROS</p>
 <p className="text-[#A1A1AA] text-xs mt-1">
 Las compras en el Shopify de A-Topic generarán coins automáticamente.
 </p>
 </div>
 );
 }

 return (
 <div className={`space-y-2 font-mono ${className}`}>
 {items.map((tx, index) => {
 const isEarn = tx.type === 'earn';
 return (
 <motion.div
 key={tx.id}
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.2, delay: index * 0.03 }}
 className="p-3 bg-[#0d0d0d] border border-[#1a0505] hover:border-[#ca3a3a] flex items-center justify-between transition-colors select-none"
 >
 <div className="flex items-center gap-3 min-w-0">
 <div
 className={`w-7 h-7 flex items-center justify-center text-xs font-bold border ${
 isEarn
 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
 : 'bg-[#ca3a3a]/10 text-[#ff6b6b] border-[#ca3a3a]/40'
 }`}
 >
 {isEarn ? '↗' : '↙'}
 </div>
 <div className="min-w-0">
 <p className="text-xs text-white font-bold truncate">
 {tx.description}
 </p>
 <p className="text-[10px] text-[#A1A1AA]">
 {new Date(tx.createdAt).toLocaleDateString('es-ES', {
 day: '2-digit',
 month: 'short',
 year: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 })}
 </p>
 </div>
 </div>

 <span
 className={`text-sm font-bold flex-shrink-0 ml-3 tracking-wider ${
 isEarn ? 'text-emerald-400' : 'text-[#ff6b6b]'
 }`}
 >
 {isEarn ? '+' : ''}
 {tx.amount.toLocaleString('es-ES')} <span className="text-[10px]">COINS</span>
 </span>
 </motion.div>
 );
 })}
 </div>
 );
}
