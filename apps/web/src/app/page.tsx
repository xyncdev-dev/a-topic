'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Loading state
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-[coin-spin_0.6s_ease-out]"></div>
        <p className="text-[#A1A1AA] text-sm">Cargando...</p>
      </div>
    </div>
  );
}
