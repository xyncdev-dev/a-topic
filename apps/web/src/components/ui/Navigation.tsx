'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navItems = [
 {
 href: '/dashboard',
 label: 'Home',
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
 </svg>
 ),
 },
 {
 href: '/rewards',
 label: 'Rewards',
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
 </svg>
 ),
 },
 {
 href: '/earn',
 label: 'Earn',
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 ),
 },
 {
 href: '/history',
 label: 'History',
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 ),
 },
];

export function Navigation() {
  const pathname = usePathname();

  // Don't show nav on login page, root redirect, home page, or admin pages
  if (pathname === '/login' || pathname === '/' || pathname === '/home' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a] border-t-2 border-[#ca3a3a] shadow-[0_-2px_10px_rgba(0,0,0,0.8)] font-mono selection:bg-[#ca3a3a]">
      <div
        className="max-w-4xl mx-auto flex items-center justify-between px-2 py-1.5 gap-1.5"
        style={{ paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Start Button shortcut to /home */}
        <Link
          href="/home"
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-[#0a0a0a] border-2 border-[#ca3a3a] text-xs font-bold text-white hover:bg-[#ca3a3a] transition-colors shadow-[1px_1px_0px_#000]"
          title="Regresar a Inicio / Tienda"
        >
          <span className="text-[#ca3a3a] group-hover:text-white font-black">☰</span>
          <span>START</span>
        </Link>

        {/* Taskbar Tabs */}
        <div className="flex-1 flex items-center justify-around sm:justify-center gap-1.5 sm:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-2.5 sm:px-4 text-xs font-bold transition-all select-none ${
                  isActive
                    ? 'bg-[#ca3a3a] text-white border-2 border-t-[#1a0505] border-l-[#1a0505] border-b-[#ff6b6b] border-r-[#ff6b6b] shadow-inner translate-y-px'
                    : 'bg-[#0a0a0a] text-[#A1A1AA] hover:text-white hover:bg-[#150505] border-2 border-t-[#ca3a3a] border-l-[#ca3a3a] border-b-[#1a0505] border-r-[#1a0505] shadow-[1px_1px_0px_#000]'
                }`}
              >
                <span className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#ca3a3a]'}`}>
                  {item.icon}
                </span>
                <span className="text-[11px] uppercase tracking-wider truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* System Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#111111] border border-[#1a0505] text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>NET: ONLINE</span>
        </div>
      </div>
    </nav>
  );
}
