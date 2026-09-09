'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
 size?: 'sm' | 'md' | 'lg';
 isLoading?: boolean;
 children: React.ReactNode;
}

const variants = {
  primary:
    'bg-[#ca3a3a] text-white border-2 border-t-[#ff6b6b] border-l-[#ff6b6b] border-b-[#1a0505] border-r-[#1a0505] hover:bg-[#b53232] active:border-t-[#1a0505] active:border-l-[#1a0505] active:border-b-[#ff6b6b] active:border-r-[#ff6b6b] shadow-[2px_2px_0px_#000000]',
  secondary:
    'bg-[#0a0a0a] text-white border-2 border-t-[#ca3a3a] border-l-[#ca3a3a] border-b-[#1a0505] border-r-[#1a0505] hover:bg-[#1a0505] active:border-t-[#1a0505] active:border-l-[#1a0505] active:border-b-[#ca3a3a] active:border-r-[#ca3a3a] shadow-[2px_2px_0px_#000000]',
  ghost:
    'bg-transparent text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] border-2 border-transparent',
  danger:
    'bg-[#3a0a0a] text-[#ff6b6b] border-2 border-[#ca3a3a] hover:bg-[#ca3a3a] hover:text-white shadow-[2px_2px_0px_#000000]',
};

const sizes = {
  sm: 'px-3 py-1 text-xs font-bold font-mono tracking-wider',
  md: 'px-5 py-2 text-sm font-bold font-mono tracking-wider',
  lg: 'px-7 py-3 text-base font-bold font-mono tracking-wider',
};

export function Button({
 variant = 'primary',
 size = 'md',
 isLoading = false,
 children,
 className = '',
 disabled,
 ...props
}: ButtonProps) {
 return (
 <motion.button
 whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
 whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
 transition={{ type: 'spring', stiffness: 400, damping: 20 }}
 className={`
 inline-flex items-center justify-center font-medium transition-all duration-200
 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
 ${variants[variant]} ${sizes[size]} ${className}
 `}
 disabled={disabled || isLoading}
 {...(props as any)}
 >
 {isLoading && (
 <svg
 className="animate-spin -ml-1 mr-2 h-4 w-4"
 xmlns="http://www.w3.org/2000/svg"
 fill="none"
 viewBox="0 0 24 24"
 >
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path
 className="opacity-75"
 fill="currentColor"
 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
 />
 </svg>
 )}
 {children}
 </motion.button>
 );
}
