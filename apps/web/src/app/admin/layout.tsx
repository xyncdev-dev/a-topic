'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { AdminNav } from '../../components/admin/AdminNav';

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
    <div className="pb-24 bg-[#050505] min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        main {
          max-width: 100% !important;
          width: 100% !important;
          padding: 0 !important;
        }
      `}} />
 {/* Top bar for admin */}
 <div className="sticky top-0 z-30 bg-black/80 border-b border-white/[0.06] px-4 py-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <span className="font-bold font-[family-name:var(--font-display)] text-white">
 Admin Panel
 </span>
 </div>
 </div>
 </div>
 
 <div className="p-4">
   <AdminNav />
   {children}
 </div>
 </div>
 );
}
