'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '../../../../lib/api';
import { Button } from '../../../../components/ui/Button';
import { Modal } from '../../../../components/ui/Modal';
import { TransactionList } from '../../../../components/TransactionList';
import type { User, Transaction } from '@a-topic/shared';

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
 const router = useRouter();
 const resolvedParams = use(params);
 const userId = resolvedParams.id;

 const [user, setUser] = useState<User | null>(null);
 const [transactions, setTransactions] = useState<Transaction[]>([]);
 const [loading, setLoading] = useState(true);

 // Modal state
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [amount, setAmount] = useState('');
 const [description, setDescription] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [error, setError] = useState('');

 const fetchUserData = useCallback(async () => {
 try {
 setLoading(true);
 const res = await api.get<{ user: User; transactions: Transaction[] }>(`/admin/users/${userId}`);
 setUser(res.user);
 setTransactions(res.transactions);
 } catch (error) {
 console.error('Failed to fetch user:', error);
 router.replace('/admin/users');
 } finally {
 setLoading(false);
 }
 }, [userId, router]);

 useEffect(() => {
 fetchUserData();
 }, [fetchUserData]);

 const handleAdjustCoins = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 const parsedAmount = parseInt(amount);

 if (isNaN(parsedAmount) || parsedAmount === 0) {
 setError('Introduce un valor numérico válido (positivo o negativo)');
 return;
 }

 setIsSubmitting(true);
 try {
 const res = await api.post<{ currentBalance: number }>(`/admin/users/${userId}/coins`, {
 amount: parsedAmount,
 description: description || 'Ajuste manual de administrador'
 });
 
 setUser(prev => prev ? { ...prev, currentBalance: res.currentBalance } : null);
 setAmount('');
 setDescription('');
 setIsModalOpen(false);
 // Refresh transactions
 fetchUserData();
 } catch (err: any) {
 setError(err.message || 'Error al ajustar coins');
 } finally {
 setIsSubmitting(false);
 }
 };

 if (loading) {
 return (
 <div className="flex justify-center py-20">
 <span className="text-4xl animate-[coin-spin_0.6s_ease-out]"></span>
 </div>
 );
 }

 if (!user) return null;

 return (
 <div className="px-4 pt-6">
 {/* Header with back button */}
 <div className="flex items-center gap-3 mb-6">
 <button
 onClick={() => router.back()}
 className="w-10 h-10 flex items-center justify-center text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
 >
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 </button>
 <div>
 <h1 className="text-xl font-bold font-[family-name:var(--font-display)] text-white">
 Perfil de Usuario
 </h1>
 <p className="text-xs text-[#A1A1AA]">{user.email}</p>
 </div>
 </div>

 {/* User Info Card */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="p-5 mb-6"
 >
 <div className="flex justify-between items-start mb-4">
 <div>
 <p className="text-sm text-[#A1A1AA] uppercase tracking-wider">Nombre</p>
 <p className="text-lg font-semibold text-white">{user.name || 'N/A'}</p>
 </div>
 <div className="text-right">
 <p className="text-sm text-[#A1A1AA] uppercase tracking-wider">Rol</p>
 <span className={`text-xs px-2 py-0.5 border ${user.role === 'admin' ? 'bg-[#E50914]/20 text-[#FCA5A5] border-[#E50914]/30' : 'bg-white/[0.04] text-[#A1A1AA] border-white/10'}`}>
 {user.role}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/[0.06]">
 <div>
 <p className="text-xs text-[#A1A1AA] uppercase tracking-wider">Balance</p>
 <p className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">
 {user.currentBalance.toLocaleString('es-ES')} <span className="text-sm"></span>
 </p>
 </div>
 <div>
 <p className="text-xs text-[#A1A1AA] uppercase tracking-wider">Nivel VIP</p>
 <p className="text-lg font-bold text-white capitalize">{user.tier}</p>
 </div>
 </div>

 <Button
 variant="primary"
 className="w-full mt-5"
 onClick={() => setIsModalOpen(true)}
 >
 Ajustar Coins Manualmente
 </Button>
 </motion.div>

 {/* Transactions */}
 <div>
 <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Historial Reciente</h2>
 <TransactionList transactions={transactions} showAll />
 </div>

 {/* Adjust Coins Modal */}
 <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)}>
 <div>
 <h3 className="text-xl font-bold text-white mb-2">Ajustar Coins</h3>
 <p className="text-sm text-[#A1A1AA] mb-6">
 Añade o quita coins a {user.email}. Usa números negativos para restar.
 </p>

 <form onSubmit={handleAdjustCoins} className="space-y-4">
 <div>
 <label className="block text-xs text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
 Cantidad (+/-)
 </label>
 <input
 type="number"
 required
 value={amount}
 onChange={(e) => setAmount(e.target.value)}
 placeholder="Ej: 500 o -200"
 className="w-full px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 transition-all"
 />
 </div>

 <div>
 <label className="block text-xs text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
 Motivo / Descripción
 </label>
 <input
 type="text"
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Ej: Premio por sorteo"
 className="w-full px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 transition-all"
 />
 </div>

 {error && <p className="text-sm text-red-400 bg-red-500/10 p-2">{error}</p>}

 <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
 <Button
 type="button"
 variant="secondary"
 className="flex-1"
 onClick={() => setIsModalOpen(false)}
 disabled={isSubmitting}
 >
 Cancelar
 </Button>
 <Button
 type="submit"
 variant="primary"
 className="flex-1"
 isLoading={isSubmitting}
 >
 Guardar
 </Button>
 </div>
 </form>
 </div>
 </Modal>
 </div>
 );
}
