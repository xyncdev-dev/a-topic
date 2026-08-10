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

 // Don't show nav on login page
 if (pathname === '/login' || pathname === '/') {
 return null;
 }

 return (
 <nav className="fixed bottom-0 left-0 right-0 z-40">
 <div className="border-t border-white/[0.06]">
 <div className="max-w-md mx-auto flex items-center justify-around px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
 {navItems.map((item) => {
 const isActive = pathname === item.href;
 return (
 <Link
 key={item.href}
 href={item.href}
 className="relative flex flex-col items-center py-2.5 px-4 min-w-[64px]"
 >
 <div className="relative">
 <motion.div
 animate={{
 color: isActive ? '#E50914' : '#A1A1AA',
 scale: isActive ? 1.1 : 1,
 }}
 transition={{ type: 'spring', stiffness: 400, damping: 25 }}
 >
 {item.icon}
 </motion.div>
 {isActive && (
 <motion.div
 layoutId="nav-indicator"
 className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#E50914]"
 transition={{ type: 'spring', stiffness: 400, damping: 30 }}
 />
 )}
 </div>
 <motion.span
 animate={{ color: isActive ? '#FAFAFA' : '#71717A' }}
 className="text-[10px] mt-0.5 font-medium"
 >
 {item.label}
 </motion.span>
 </Link>
 );
 })}
 </div>
 </div>
 </nav>
 );
}
