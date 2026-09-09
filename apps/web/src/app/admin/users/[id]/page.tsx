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
    <div className="font-mono">
      {/* Header back navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="btn-retro py-1 px-3 text-xs flex items-center gap-1.5"
        >
          <span>←</span>
          <span>VOLVER AL DIRECTORIO</span>
        </button>
      </div>

      {/* User Info Window */}
      <div className="win-frame mb-5">
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>👤</span>
            <span>C:\ADMIN\USER_INSPECTOR.EXE // {user.email}</span>
          </span>
          <span className="text-[10px]">ID: {user.id}</span>
        </div>

        <div className="p-4 sm:p-5 bg-[#0a0a0a]">
          <div className="retro-inset p-4 mb-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-[#1a0505]">
              <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">EMAIL / CUENTA</p>
                <p className="text-base font-bold text-white">{user.email}</p>
                <p className="text-xs text-[#A1A1AA]">{user.name || 'Sin nombre registrado'}</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">ROL DE ACCESO</p>
                {user.role === 'admin' ? (
                  <span className="retro-badge bg-[#1a0505] text-[#ff6b6b] border-[#ca3a3a]">
                    ADMINISTRADOR
                  </span>
                ) : (
                  <span className="text-[11px] text-[#A1A1AA] border border-[#222] px-2 py-0.5">
                    CLIENTE REGULAR
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">BALANCE ACTUAL</p>
                <p className="text-2xl font-black text-[#ca3a3a] tracking-wider">
                  {user.currentBalance.toLocaleString('es-ES')}{' '}
                  <span className="text-xs text-white">COINS</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">NIVEL VIP</p>
                <p className="text-xl font-bold text-white uppercase">
                  {user.tier}
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={() => setIsModalOpen(true)}
          >
            [ ± ] AJUSTAR COINS MANUALMENTE
          </Button>
        </div>
      </div>

      {/* Transactions Window */}
      <div className="win-frame">
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>📜</span>
            <span>C:\LOGS\USER_TRANSACTIONS.LOG</span>
          </span>
          <span className="text-[10px]">HISTORIAL DE OPERACIONES</span>
        </div>

        <div className="p-4 bg-[#0a0a0a]">
          <TransactionList transactions={transactions} showAll />
        </div>
      </div>

      {/* Adjust Coins Modal */}
      <Modal isOpen={isModalOpen} onClose={() => !isSubmitting && setIsModalOpen(false)}>
        <div className="font-mono">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
            AJUSTAR COINS DE USUARIO
          </h3>
          <p className="text-xs text-[#A1A1AA] mb-4">
            Modificar saldo de <span className="text-[#ff6b6b]">{user.email}</span>. Usa números positivos para añadir y negativos para descontar.
          </p>

          <form onSubmit={handleAdjustCoins} className="space-y-4">
            <div>
              <label className="block text-[10px] text-[#A1A1AA] mb-1 uppercase tracking-wider">
                CANTIDAD DE COINS (+ / -)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 500 o -200"
                className="retro-input w-full text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#A1A1AA] mb-1 uppercase tracking-wider">
                MOTIVO / DESCRIPCIÓN
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Bonificación especial"
                className="retro-input w-full text-xs"
              />
            </div>

            {error && (
              <p className="text-xs text-[#ff6b6b] bg-[#1a0505] border border-[#ca3a3a] p-2 text-center">
                {error}
              </p>
            )}

            <div className="flex gap-2 pt-3 border-t border-[#1a0505]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                CANCELAR
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="flex-1"
                isLoading={isSubmitting}
              >
                CONFIRMAR
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
 );
}
