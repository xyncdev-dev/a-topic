'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Activity, Settings } from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Estadísticas', href: '/admin/dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Actividad', href: '/admin/transactions', icon: <Activity className="w-4 h-4" /> },
    { name: 'Usuarios', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { name: 'Configuración', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex space-x-1 border-b border-[#E50914]/20 mb-6 pb-2 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'text-[#E50914] bg-[#E50914]/10 border-b-2 border-[#E50914]'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {tab.icon}
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
