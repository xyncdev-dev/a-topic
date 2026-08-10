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
 <div className={` p-8 text-center ${className}`}>
 <div className="text-4xl mb-3"></div>
 <p className="text-[#A1A1AA] text-sm">No hay transacciones aún</p>
 <p className="text-[#71717A] text-xs mt-1">Las compras en A-Topic generarán coins automáticamente</p>
 </div>
 );
 }

 return (
 <div className={`space-y-2 ${className}`}>
 {items.map((tx, index) => {
 const isEarn = tx.type === 'earn';
 return (
 <motion.div
 key={tx.id}
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.3, delay: index * 0.04 }}
 className="px-4 py-3 flex items-center justify-between"
 >
 <div className="flex items-center gap-3 min-w-0">
 <div
 className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
 isEarn ? 'bg-emerald-500/10' : 'bg-red-500/10'
 }`}
 >
 <span className="text-sm">{isEarn ? '↗' : '↙'}</span>
 </div>
 <div className="min-w-0">
 <p className="text-sm text-white font-medium truncate">{tx.description}</p>
 <p className="text-xs text-[#71717A]">
 {new Date(tx.createdAt).toLocaleDateString('es-ES', {
 day: 'numeric',
 month: 'short',
 year: 'numeric',
 hour: '2-digit',
 minute: '2-digit',
 })}
 </p>
 </div>
 </div>

 <span
 className={`text-sm font-bold font-[family-name:var(--font-display)] flex-shrink-0 ml-3 ${
 isEarn ? 'text-emerald-400' : 'text-red-400'
 }`}
 >
 {isEarn ? '+' : ''}{tx.amount.toLocaleString('es-ES')}
 </span>
 </motion.div>
 );
 })}
 </div>
 );
}
