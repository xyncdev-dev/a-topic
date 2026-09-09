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
import { VIP_TIERS, type Transaction, type BalanceResponse, type TierInfo } from '@a-topic/shared';
import Link from 'next/link';
import { SITE_DATA } from '../../data';

import { Gift, TrendingUp, History, Shield } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const GUEST_TIER_INFO: TierInfo = {
  current: VIP_TIERS[0],
  next: VIP_TIERS[1] ?? null,
  progress: 0,
  coinsToNext: VIP_TIERS[1]?.minCoins ?? 1000,
  totalEarned: 0,
};

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  if (authLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center font-mono">
        <div className="text-4xl animate-[coin-spin_0.6s_ease-out]">⚙</div>
      </div>
    );
  }

  const balance = isAuthenticated && user ? (balanceData?.currentBalance ?? user.currentBalance) : 0;
  const tierInfo = isAuthenticated && user ? (balanceData?.tierInfo ?? user.tierInfo) : GUEST_TIER_INFO;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 safe-bottom font-mono selection:bg-[#ca3a3a]">
      {/* Top Retro OS Header Window */}
      <div className="win-frame mb-4 sm:mb-6">
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>⚡</span>
            <span>
              {isAuthenticated
                ? SITE_DATA.dashboard.windowTitleAuth
                : SITE_DATA.dashboard.windowTitleGuest}
            </span>
          </span>
          <div className="win-controls flex items-center gap-1">
            <span className="win-btn" aria-hidden="true">_</span>
            <span className="win-btn" aria-hidden="true">□</span>
            <span className="win-btn" aria-hidden="true">✕</span>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-[#0a0a0a] flex flex-wrap items-center justify-between gap-3 border-t border-[#1a0505]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border-2 border-[#ca3a3a] bg-[#111] flex items-center justify-center text-xs font-bold text-[#ca3a3a]">
              {isAuthenticated ? 'USR' : 'GST'}
            </div>
            <div>
              <p className="text-[10px] text-[#A1A1AA] uppercase tracking-wider">
                {isAuthenticated ? SITE_DATA.dashboard.userLabelAuth : SITE_DATA.dashboard.userLabelGuest}
              </p>
              <h1 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                {isAuthenticated && user ? user.name || user.email.split('@')[0] : SITE_DATA.dashboard.guestName}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {isAuthenticated ? (
              <>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'w-7 h-7 rounded-none border-2 border-[#ca3a3a]',
                    },
                  }}
                />
                <button
                  onClick={logout}
                  className="btn-retro py-1 px-3 text-[11px]"
                >
                  {SITE_DATA.dashboard.logoutBtn}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-retro !bg-[#ca3a3a] !text-white hover:!bg-[#e04848] py-1 px-3.5 text-[11px]"
              >
                {SITE_DATA.dashboard.loginBtn}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Grid for Balance & VIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coin Balance Card */}
        <CoinBalance balance={balance} />

        {/* VIP Progress */}
        <VipProgress tierInfo={tierInfo} />
      </div>

      {/* Quick Actions / Desktop Launchers */}
      <div className="win-frame mt-4">
        <div className="win-titlebar">
          <span className="flex items-center gap-1.5">
            <span>📁</span>
            <span>{SITE_DATA.dashboard.shortcutsTitle}</span>
          </span>
          <span className="text-[10px] text-white/80">{SITE_DATA.dashboard.shortcutsBadge}</span>
        </div>

        <div className="p-3 sm:p-4 bg-[#0a0a0a] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/rewards" className="group">
            <div className="p-3 text-center bg-[#0d0d0d] border border-[#1a0505] group-hover:border-[#ca3a3a] group-hover:bg-[#150505] transition-all">
              <div className="mb-1.5 flex justify-center text-[#ca3a3a] group-hover:scale-110 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
              <p className="text-xs text-white font-bold tracking-wider">CANJEAR</p>
              <p className="text-[10px] text-[#A1A1AA] mt-0.5">Cupones</p>
            </div>
          </Link>

          <Link href="/earn" className="group">
            <div className="p-3 text-center bg-[#0d0d0d] border border-[#1a0505] group-hover:border-[#ca3a3a] group-hover:bg-[#150505] transition-all">
              <div className="mb-1.5 flex justify-center text-[#ca3a3a] group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-xs text-white font-bold tracking-wider">GANAR</p>
              <p className="text-[10px] text-[#A1A1AA] mt-0.5">Reglas</p>
            </div>
          </Link>

          <Link href="/history" className="group">
            <div className="p-3 text-center bg-[#0d0d0d] border border-[#1a0505] group-hover:border-[#ca3a3a] group-hover:bg-[#150505] transition-all">
              <div className="mb-1.5 flex justify-center text-[#ca3a3a] group-hover:scale-110 transition-transform">
                <History className="w-5 h-5" />
              </div>
              <p className="text-xs text-white font-bold tracking-wider">HISTORIAL</p>
              <p className="text-[10px] text-[#A1A1AA] mt-0.5">Registro</p>
            </div>
          </Link>

          {isAuthenticated && user?.role === 'admin' ? (
            <Link href="/admin/dashboard" className="group">
              <div className="p-3 text-center bg-[#1a0505] border border-[#ca3a3a] group-hover:bg-[#ca3a3a] transition-all">
                <div className="mb-1.5 flex justify-center text-[#ff6b6b] group-hover:text-white transition-colors">
                  <Shield className="w-5 h-5" />
                </div>
                <p className="text-xs text-white font-bold tracking-wider">ADMIN</p>
                <p className="text-[10px] text-[#ff6b6b] group-hover:text-white mt-0.5">SysConsole</p>
              </div>
            </Link>
          ) : (
            <a
              href={SITE_DATA.shopify.catalogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="p-3 text-center bg-[#0d0d0d] border border-[#1a0505] group-hover:border-[#ca3a3a] group-hover:bg-[#150505] transition-all">
                <div className="mb-1.5 flex justify-center text-[#ca3a3a] group-hover:scale-110 transition-transform">
                  <span className="text-base font-black">↗</span>
                </div>
                <p className="text-xs text-white font-bold tracking-wider">TIENDA</p>
                <p className="text-[10px] text-[#A1A1AA] mt-0.5">Shopify</p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Recent Activity Window */}
      <div className="win-frame mt-4">
        <div className="win-titlebar">
          <span className="flex items-center gap-1.5">
            <span>📜</span>
            <span>{SITE_DATA.dashboard.activityTitle}</span>
          </span>
          {transactions.length > 0 && (
            <Link
              href="/history"
              className="text-[11px] text-white hover:underline font-bold"
            >
              {SITE_DATA.dashboard.viewAllActivity}
            </Link>
          )}
        </div>

        <div className="p-4 bg-[#0a0a0a]">
          {isAuthenticated ? (
            <TransactionList transactions={transactions} />
          ) : (
            <div className="p-6 text-center">
              <p className="text-xs text-[#A1A1AA] mb-3">
                {SITE_DATA.dashboard.guestEmptyActivity}
              </p>
              <Link
                href="/login"
                className="btn-retro text-xs py-1.5 px-4"
              >
                {SITE_DATA.dashboard.loginBtn}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
