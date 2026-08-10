'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { CoinBalance } from '../../components/CoinBalance';
import { VipProgress } from '../../components/VipProgress';
import { TransactionList } from '../../components/TransactionList';
import { Button } from '../../components/ui/Button';
import type { Transaction, BalanceResponse } from '@a-topic/shared';
import Link from 'next/link';

import { Gift, TrendingUp, History, Shield } from 'lucide-react';

export default function DashboardPage() {
 const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
 const router = useRouter();
 const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);

 const fetchData = useCallback(async () => {
 try {
 const [balanceRes, txRes] = await Promise.all([
 api.get<BalanceResponse>('/user/balance'),
 api.get<{ transactions: Transaction[] }>('/transactions?limit=5'),
 ]);
 setBalanceData(balanceRes);
 setTransactions(txRes.transactions);
 } catch (error) {
 console.error('Failed to fetch dashboard data:', error);
 }
 }, []);

 useEffect(() => {
 if (!authLoading && !isAuthenticated) {
 router.replace('/login');
 return;
 }
 if (isAuthenticated) {
 fetchData();
 }
 }, [isAuthenticated, authLoading, router, fetchData]);

 if (authLoading || !user) {
 return (
 <div className="min-h-dvh flex items-center justify-center">
 <div className="text-4xl animate-[coin-spin_0.6s_ease-out]"></div>
 </div>
 );
 }

 const balance = balanceData?.currentBalance ?? user.currentBalance;
 const tierInfo = balanceData?.tierInfo ?? user.tierInfo;

 return (
 <div className="px-4 pt-6 safe-bottom">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex items-center justify-between mb-6"
 >
 <div>
 <p className="text-sm text-[#A1A1AA]">Hola,</p>
 <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-white">
 {user.name || user.email.split('@')[0]} 
 </h1>
 </div>
 <button
 onClick={logout}
 className="text-xs text-[#52525B] hover:text-[#A1A1AA] transition-colors px-3 py-1.5 hover:bg-white/[0.04] cursor-pointer"
 >
 Salir
 </button>
 </motion.div>

 {/* Coin Balance Card */}
 <CoinBalance balance={balance} />

 {/* VIP Progress */}
 <div className="mt-4">
 <VipProgress tierInfo={tierInfo} />
 </div>

 {/* Quick Actions */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="grid grid-cols-3 gap-3 mt-6"
 >
 <Link href="/rewards">
 <div className="p-4 text-center hover:bg-white/[0.06] transition-colors cursor-pointer">
 <div className="mb-1.5 flex justify-center"><Gift className="w-6 h-6 text-[#A1A1AA]" /></div>
 <p className="text-xs text-[#A1A1AA] font-medium">Canjear</p>
 </div>
 </Link>
 <Link href="/earn">
 <div className="p-4 text-center hover:bg-white/[0.06] transition-colors cursor-pointer">
 <div className="mb-1.5 flex justify-center"><TrendingUp className="w-6 h-6 text-[#A1A1AA]" /></div>
 <p className="text-xs text-[#A1A1AA] font-medium">Ganar</p>
 </div>
 </Link>
 <Link href="/history">
 <div className="p-4 text-center hover:bg-white/[0.06] transition-colors cursor-pointer">
 <div className="mb-1.5 flex justify-center"><History className="w-6 h-6 text-[#A1A1AA]" /></div>
 <p className="text-xs text-[#A1A1AA] font-medium">Historial</p>
 </div>
 </Link>
 {user.role === 'admin' && (
 <Link href="/admin/users">
 <div className="p-4 text-center hover:bg-white/[0.06] transition-colors cursor-pointer border border-[#E50914]/30">
 <div className="mb-1.5 flex justify-center"><Shield className="w-6 h-6 text-[#E50914]" /></div>
 <p className="text-xs text-[#E50914] font-medium">Admin</p>
 </div>
 </Link>
 )}
 </motion.div>

 {/* Recent Activity */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="mt-6"
 >
 <div className="flex items-center justify-between mb-3">
 <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Actividad Reciente</h2>
 {transactions.length > 0 && (
 <Link href="/history" className="text-xs text-[#E50914] hover:text-[#FCA5A5] transition-colors">
 Ver todo →
 </Link>
 )}
 </div>
 <TransactionList transactions={transactions} />
 </motion.div>

 {/* Spacer for safe bottom */}
 <div className="h-4" />
 </div>
 );
}
