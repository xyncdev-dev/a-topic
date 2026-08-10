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
 ' E50914] 7F1D1D] text-white -500/20 hover:-500/40',
 secondary:
 'bg-white/[0.06] text-white border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2]',
 ghost: 'bg-transparent text-[#A1A1AA] hover:text-white hover:bg-white/[0.05]',
 danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
};

const sizes = {
 sm: 'px-3 py-1.5 text-sm ',
 md: 'px-5 py-2.5 text-sm ',
 lg: 'px-8 py-3.5 text-base ',
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
