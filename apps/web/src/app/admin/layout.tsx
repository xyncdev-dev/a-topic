'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { AdminNav } from '../../components/admin/AdminNav';
import { UserButton } from '@clerk/nextjs';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const { user, isAuthenticated, isLoading } = useAuth();
 const router = useRouter();

 useEffect(() => {
 if (!isLoading) {
 if (!isAuthenticated) {
 router.replace('/login');
 } else if (user?.role !== 'admin') {
 router.replace('/dashboard');
 }
 }
 }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-4xl animate-[coin-spin_0.6s_ease-out]">⏳</div>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-[#0a0a0a] min-h-screen font-mono selection:bg-[#ca3a3a]">
      {/* Top Retro SysAdmin OS Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a] border-b-2 border-[#ca3a3a] shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bg-[#ca3a3a] text-white text-xs font-bold px-2 py-0.5 tracking-wider">
              ROOT // ADMIN
            </span>
            <span className="text-xs font-bold text-white tracking-wider hidden sm:inline">
              C:\ADMIN\ROOT_CONSOLE.EXE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="btn-retro py-1 px-2.5 text-[11px] text-white"
            >
              ← SALIR DE ADMIN
            </a>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-7 h-7 rounded-none border-2 border-[#ca3a3a]',
                },
              }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-3 sm:p-5">
        <AdminNav />
        {children}
      </div>
    </div>
  );
}
