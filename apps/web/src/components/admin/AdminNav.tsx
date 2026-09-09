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
    <div className="flex gap-2 border-b-2 border-[#ca3a3a] mb-6 pb-2 overflow-x-auto select-none font-mono">
      {tabs.map((tab, idx) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#ca3a3a] text-white border-2 border-t-[#ff6b6b] border-l-[#ff6b6b] border-b-[#1a0505] border-r-[#1a0505] shadow-inner translate-y-px'
                : 'bg-[#0a0a0a] text-[#A1A1AA] hover:text-white hover:bg-[#150505] border-2 border-t-[#ca3a3a] border-l-[#ca3a3a] border-b-[#1a0505] border-r-[#1a0505]'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-[#ca3a3a]'}>
              {tab.icon}
            </span>
            <span>[{idx + 1}] {tab.name.toUpperCase()}</span>
          </Link>
        );
      })}
    </div>
  );
}
