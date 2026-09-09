'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { TransactionList } from '../../components/TransactionList';
import { SITE_DATA } from '../../data';
import type { Transaction, TransactionListResponse, BalanceResponse } from '@a-topic/shared';

export default function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
    if (isAuthenticated) {
      fetchTransactions(1);
    }
  }, [isAuthenticated, fetchTransactions]);

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
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 safe-bottom font-mono selection:bg-[#ca3a3a]">
      {/* History OS Window */}
      <div className="win-frame">
        {/* Titlebar */}
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>📜</span>
            <span>{SITE_DATA.history.windowTitle}</span>
          </span>
          <div className="win-controls flex items-center gap-1">
            <span className="win-btn" aria-hidden="true">_</span>
            <span className="win-btn" aria-hidden="true">□</span>
            <span className="win-btn" aria-hidden="true">✕</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#0a0a0a]">
          {!isAuthenticated ? (
            /* Unauthenticated / Guest View */
            <div className="p-6 sm:p-10 text-center bg-[#0a0a0a]">
              <div className="w-14 h-14 mx-auto mb-4 border-2 border-[#ca3a3a] bg-[#111] flex items-center justify-center text-2xl text-[#ca3a3a] shadow-[2px_2px_0px_#000]">
                📜
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                {SITE_DATA.history.guestTitle}
              </h3>
              <p className="text-xs text-[#A1A1AA] max-w-md mx-auto mb-6 leading-relaxed">
                {SITE_DATA.history.guestDescription}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="btn-retro !bg-[#ca3a3a] !text-white text-xs py-2 px-6 hover:!bg-[#e04848]"
                >
                  {SITE_DATA.history.guestLoginBtn}
                </Link>
                <Link
                  href="/rewards"
                  className="btn-retro text-xs py-2 px-4"
                >
                  {SITE_DATA.history.guestRewardsBtn}
                </Link>
              </div>
            </div>
          ) : (
            /* Authenticated Ledger */
            <>
              {/* Stats Inset Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="retro-inset p-3 text-center">
                  <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">
                    {SITE_DATA.history.statBalance}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-white">
                    {balance.toLocaleString('es-ES')} <span className="text-[10px]">COINS</span>
                  </p>
                </div>

                <div className="retro-inset p-3 text-center">
                  <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">
                    {SITE_DATA.history.statEarned}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-emerald-400">
                    +{totalEarned.toLocaleString('es-ES')} <span className="text-[10px]">COINS</span>
                  </p>
                </div>

                <div className="retro-inset p-3 text-center">
                  <p className="text-[10px] text-[#ff6b6b] uppercase tracking-wider mb-1">
                    {SITE_DATA.history.statRedeemed}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-[#ff6b6b]">
                    -{totalRedeemed.toLocaleString('es-ES')} <span className="text-[10px]">COINS</span>
                  </p>
                </div>
              </div>

              {/* Section Header */}
              <div className="mb-4 pb-2 border-b border-[#1a0505] flex items-center justify-between">
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  {SITE_DATA.history.sectionTitle} ({total})
                </h2>
                <span className="text-[10px] text-[#A1A1AA]">
                  PÁGINA {page}
                </span>
              </div>

              {/* Transaction List */}
              {loading && transactions.length === 0 ? (
                <div className="retro-inset p-8 text-center">
                  <span className="text-2xl animate-[coin-spin_0.6s_ease-out] inline-block mb-2 text-[#ca3a3a]">
                    ⚙
                  </span>
                  <p className="text-white text-sm font-bold">{SITE_DATA.history.loadingText}</p>
                </div>
              ) : (
                <>
                  <TransactionList transactions={transactions} showAll />

                  {hasMore && (
                    <button
                      type="button"
                      onClick={loadMore}
                      disabled={loading}
                      className="btn-retro w-full mt-4 py-2 text-xs"
                    >
                      {loading ? SITE_DATA.history.loadingMoreText : SITE_DATA.history.loadMoreText}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
