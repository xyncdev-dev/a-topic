'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { TransactionList } from '../../components/TransactionList';
import type { Transaction, TransactionListResponse, BalanceResponse } from '@a-topic/shared';

export default function HistoryPage() {
 const { isAuthenticated, isLoading: authLoading } = useAuth();
 const router = useRouter();

 const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [balance, setBalance] = useState(0);
 const [totalEarned, setTotalEarned] = useState(0);
 const [page, setPage] = useState(1);
 const [total, setTotal] = useState(0);
 const [loading, setLoading] = useState(true);

 const limit = 20;

 const fetchTransactions = useCallback(async (p: number) => {
 try {
 setLoading(true);
 const [txRes, balanceRes] = await Promise.all([
 api.get<TransactionListResponse>(`/transactions?page=${p}&limit=${limit}`),
 api.get<BalanceResponse>('/user/balance'),
 ]);
 setTransactions((prev) => (p === 1 ? txRes.transactions : [...prev, ...txRes.transactions]));
 setTotal(txRes.total);
 setBalance(balanceRes.currentBalance);
 setTotalEarned(balanceRes.totalEarned);
 } catch (error) {
 console.error('Failed to fetch transactions:', error);
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => {
 if (!authLoading && !isAuthenticated) {
 router.replace('/login');
 return;
 }
 if (isAuthenticated) {
 fetchTransactions(1);
 }
 }, [isAuthenticated, authLoading, router, fetchTransactions]);

 const loadMore = () => {
 const nextPage = page + 1;
 setPage(nextPage);
 fetchTransactions(nextPage);
 };

 const hasMore = transactions.length < total;

 // Calculate stats
 const totalRedeemed = transactions
 .filter((t) => t.type === 'redeem')
 .reduce((sum, t) => sum + Math.abs(t.amount), 0);

 return (
 <div className="px-4 pt-6 safe-bottom">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-6"
 >
 <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white">
 Historial
 </h1>
 <p className="text-sm text-[#A1A1AA] mt-1">
 Registro completo de tus coins
 </p>
 </motion.div>

 {/* Stats */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="grid grid-cols-3 gap-3 mb-6"
 >
 <div className="p-3 text-center">
 <p className="text-xs text-[#A1A1AA] mb-1">Balance</p>
 <p className="text-lg font-bold font-[family-name:var(--font-display)] text-white">
 {balance.toLocaleString('es-ES')}
 </p>
 </div>
 <div className="p-3 text-center">
 <p className="text-xs text-emerald-400/70 mb-1">Ganados</p>
 <p className="text-lg font-bold font-[family-name:var(--font-display)] text-emerald-400">
 {totalEarned.toLocaleString('es-ES')}
 </p>
 </div>
 <div className="p-3 text-center">
 <p className="text-xs text-red-400/70 mb-1">Canjeados</p>
 <p className="text-lg font-bold font-[family-name:var(--font-display)] text-red-400">
 {totalRedeemed.toLocaleString('es-ES')}
 </p>
 </div>
 </motion.div>

 {/* Transaction List */}
 {loading && transactions.length === 0 ? (
 <div className="p-8 text-center">
 <div className="text-4xl mb-3 animate-[coin-spin_0.6s_ease-out]"></div>
 <p className="text-[#A1A1AA] text-sm">Cargando historial...</p>
 </div>
 ) : (
 <>
 <TransactionList transactions={transactions} showAll />

 {hasMore && (
 <motion.button
 whileTap={{ scale: 0.98 }}
 onClick={loadMore}
 disabled={loading}
 className="w-full mt-4 py-3 text-sm text-[#E50914] hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50"
 >
 {loading ? 'Cargando...' : 'Cargar más'}
 </motion.button>
 )}
 </>
 )}

 <div className="h-4" />
 </div>
 );
}
