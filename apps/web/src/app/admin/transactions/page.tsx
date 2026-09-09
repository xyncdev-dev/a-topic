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
    <div className="font-mono">
      {/* Global Activity Window */}
      <div className="win-frame">
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>📜</span>
            <span>C:\LOGS\GLOBAL_AUDIT.LOG // LEDGER_VIEW</span>
          </span>
          <span className="text-[10px]">ÚLTIMAS 50 TRANSACCIONES</span>
        </div>

        <div className="p-4 bg-[#0a0a0a]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-[#111] border-b-2 border-[#ca3a3a] text-[#A1A1AA] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3 font-bold">FECHA</th>
                  <th className="px-4 py-3 font-bold">USUARIO</th>
                  <th className="px-4 py-3 font-bold text-right">MONTO</th>
                  <th className="px-4 py-3 font-bold">TIPO</th>
                  <th className="px-4 py-3 font-bold">DETALLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a0505]">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#A1A1AA]">
                      No hay actividad registrada en el sistema.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx: any) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-[#120505] transition-colors">
                        <td className="px-4 py-3 text-[#A1A1AA] whitespace-nowrap text-[11px]">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <a
                              href={`/admin/users/${tx.user_id}`}
                              className="font-bold text-white hover:text-[#ff6b6b] hover:underline transition-colors"
                            >
                              {tx.user_name || tx.user_email.split('@')[0]}
                            </a>
                            <span className="text-[10px] text-[#777]">{tx.user_email}</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-right font-bold text-sm tracking-wider ${isPositive ? 'text-emerald-400' : 'text-[#ff6b6b]'}`}>
                          {isPositive ? '+' : ''}{tx.amount} <span className="text-[10px]">COINS</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`retro-badge ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40' : 'bg-[#1a0505] text-[#ff6b6b] border-[#ca3a3a]'}`}>
                            {tx.type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#A1A1AA]">
                          {tx.description}
                          {tx.reference_id && (
                            <span className="block text-[10px] text-[#666] mt-0.5">
                              REF: {tx.reference_id}
                            </span>
                          )}
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
    </div>
  );
}
