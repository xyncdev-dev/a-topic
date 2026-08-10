'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await api.get('/admin/transactions') as any;
        setTransactions(res.transactions || []);
      } catch (err) {
        console.error('Failed to load transactions', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-[coin-spin_1s_ease-out_infinite] text-2xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-[family-name:var(--font-display)] text-white uppercase tracking-wider">
          Registro Global de Actividad
        </h2>
        <span className="text-sm text-[#A1A1AA]">Últimas 50 transacciones</span>
      </div>

      <div className="bg-[#0A0A0A] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-white/[0.03] text-[#A1A1AA] uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold text-right">Monto</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#A1A1AA]">
                    No hay actividad reciente.
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-[#A1A1AA] whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <a href={`/admin/users/${tx.user_id}`} className="font-medium hover:text-[#E50914] transition-colors">
                            {tx.user_name || tx.user_email.split('@')[0]}
                          </a>
                          <span className="text-xs text-[#777]">{tx.user_email}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold font-[family-name:var(--font-display)] ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPositive ? '+' : ''}{tx.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${isPositive ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#A1A1AA]">
                        {tx.description}
                        {tx.reference_id && <span className="block text-xs text-[#555] mt-0.5">Ref: {tx.reference_id}</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
