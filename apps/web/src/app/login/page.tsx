'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export default function LoginPage() {
 const [isLogin, setIsLogin] = useState(true);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [name, setName] = useState('');
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);

 const { login, register } = useAuth();
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setError('');
 setIsLoading(true);

 try {
 if (isLogin) {
 await login(email, password);
 } else {
 await register(email, password, name || undefined);
 }
 router.push('/dashboard');
 } catch (err: any) {
 setError(err.message || 'Ha ocurrido un error');
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="min-h-dvh flex flex-col relative overflow-hidden">
 {/* Animated background */}
 <div className="absolute inset-0 pointer-events-none">
 <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#E50914]/8 blur-[100px]" />
 <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#7F1D1D]/8 blur-[100px]" />
 <motion.div
 animate={{ rotate: 360 }}
 transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
 className="absolute top-1/4 right-1/4 w-[300px] h-[300px] border border-white/[0.03]"
 />
 <motion.div
 animate={{ rotate: -360 }}
 transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
 className="absolute top-1/3 right-1/3 w-[200px] h-[200px] border border-white/[0.02]"
 />
 </div>

 {/* Content */}
 <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
 {/* Logo / Brand */}
 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center mb-10 flex flex-col items-center"
 >
 <img src="/logo.png" alt="A-Topic" className="w-24 h-auto mb-4 object-contain" />
 <h1 className="text-3xl font-bold font-[family-name:var(--font-display)] mb-2">
 A-TOPIC
 </h1>
 <p className="text-[#A1A1AA] uppercase tracking-[0.2em] text-sm mb-4">
 The world is yours
 </p>
 </motion.div>

 {/* Form */}
 <motion.form
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 onSubmit={handleSubmit}
 className="space-y-4"
 >
 {/* Toggle */}
 <div className="flex bg-white/[0.04] p-1 mb-6">
 <button
 type="button"
 onClick={() => { setIsLogin(true); setError(''); }}
 className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
 isLogin
 ? 'bg-white/[0.08] text-white '
 : 'text-[#A1A1AA] hover:text-white'
 }`}
 >
 Iniciar Sesión
 </button>
 <button
 type="button"
 onClick={() => { setIsLogin(false); setError(''); }}
 className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
 !isLogin
 ? 'bg-white/[0.08] text-white '
 : 'text-[#A1A1AA] hover:text-white'
 }`}
 >
 Registrarse
 </button>
 </div>

 {/* Name field (register only) */}
 <AnimatePresence mode="wait">
 {!isLogin && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 transition={{ duration: 0.2 }}
 >
 <label htmlFor="name" className="block text-xs text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
 Nombre
 </label>
 <input
 id="name"
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="Tu nombre"
 className="w-full px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 transition-all"
 />
 </motion.div>
 )}
 </AnimatePresence>

 <div>
 <label htmlFor="email" className="block text-xs text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
 Email
 </label>
 <input
 id="email"
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="tu@email.com"
 className="w-full px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 transition-all"
 />
 </div>

 <div>
 <label htmlFor="password" className="block text-xs text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
 Contraseña
 </label>
 <input
 id="password"
 type="password"
 required
 minLength={6}
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className="w-full px-4 py-3 text-sm text-white placeholder-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#E50914]/50 transition-all"
 />
 </div>

 {/* Error */}
 <AnimatePresence>
 {error && (
 <motion.p
 initial={{ opacity: 0, y: -5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0 }}
 className="text-sm text-red-400 text-center bg-red-500/10 py-2 px-3"
 >
 {error}
 </motion.p>
 )}
 </AnimatePresence>

 <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
 {isLogin ? 'Entrar' : 'Crear cuenta'}
 </Button>
 </motion.form>

 {/* Footer note */}
 <motion.p
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.6 }}
 className="text-center text-xs text-[#52525B] mt-8"
 >
 Usa el mismo email de tus compras en A-Topic para vincular tus coins
 </motion.p>
 </div>
 </div>
 );
}
