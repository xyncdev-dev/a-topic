'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSignIn, useSignUp } from '@clerk/nextjs/legacy';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { refreshUser } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!isSignInLoaded) return;
    const result = await signIn.create({
      identifier: email,
      password,
    });

    if (result.status === 'complete') {
      await setSignInActive({ session: result.createdSessionId });
      await refreshUser();
      router.push('/dashboard');
    } else {
      console.warn('Sign in status:', result.status);
      setError('Verificación adicional requerida para completar el acceso.');
    }
  };

  const handleSignUp = async () => {
    if (!isSignUpLoaded) return;
    const result = await signUp.create({
      emailAddress: email,
      password,
      firstName: name || undefined,
    });

    if (result.status === 'complete') {
      await setSignUpActive({ session: result.createdSessionId });
      await refreshUser();
      router.push('/dashboard');
    } else if (result.status === 'missing_requirements') {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } else {
      console.warn('Sign up status:', result.status);
      setError('Verificación requerida.');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId });
        await refreshUser();
        router.push('/dashboard');
      } else {
        setError('El código ingresado no es válido o ha expirado.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Código incorrecto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await handleSignIn();
      } else {
        await handleSignUp();
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Ha ocurrido un error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-center items-center px-4 py-8 relative font-mono selection:bg-[#ca3a3a] bg-[#0a0a0a]">
      {/* Background Retro Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1a0505_1px,transparent_1px),linear-gradient(to_bottom,#1a0505_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Main Retro Auth Window */}
      <div className="w-full max-w-md win-frame relative z-10 shadow-[4px_4px_0px_#000000]">
        {/* Titlebar */}
        <div className="win-titlebar">
          <span className="flex items-center gap-2 truncate">
            <span>🔑</span>
            <span>C:\SYSTEM\AUTH.EXE // ATOPIC_VAULT</span>
          </span>
          <div className="win-controls flex items-center gap-1">
            <span className="win-btn" aria-hidden="true">_</span>
            <span className="win-btn" aria-hidden="true">□</span>
            <span className="win-btn" aria-hidden="true">✕</span>
          </div>
        </div>

        <div className="p-6 bg-[#0a0a0a]">
          {/* Brand Header inside window */}
          <div className="text-center mb-6 flex flex-col items-center">
            <img src="/logo.png" alt="A-Topic" className="w-16 h-auto mb-2 object-contain" />
            <h1 className="text-xl font-bold tracking-wider text-white">
              A-TOPIC REWARDS
            </h1>
            <p className="text-[11px] text-[#A1A1AA] uppercase tracking-widest mt-0.5">
              THE WORLD IS YOURS // VIP TERMINAL
            </p>
          </div>

          {verifying ? (
            /* Email Verification Code Form */
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleVerifyCode}
              className="space-y-4"
            >
              <div className="retro-inset p-3 text-center mb-4">
                <p className="text-xs font-bold text-white mb-1">CÓDIGO DE VERIFICACIÓN</p>
                <p className="text-[11px] text-[#A1A1AA]">
                  Enviado a <span className="text-[#ff6b6b] font-bold">{email}</span>
                </p>
              </div>

              <div>
                <input
                  id="code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  placeholder="123456"
                  className="retro-input w-full text-center tracking-[0.3em] text-xl font-bold"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-[#ff6b6b] bg-[#1a0505] border border-[#ca3a3a] py-2 px-3 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
                VERIFICAR Y ACCEDER
              </Button>

              <button
                type="button"
                onClick={() => { setVerifying(false); setError(''); }}
                className="w-full text-xs text-[#A1A1AA] hover:text-white py-1.5 text-center transition-colors cursor-pointer"
              >
                [ ← VOLVER AL FORMULARIO ]
              </button>
            </motion.form>
          ) : (
            /* Main Login / Register Form */
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Retro Tab Switcher */}
              <div className="grid grid-cols-2 gap-1 bg-[#111] p-1 border border-[#1a0505] mb-5">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setError(''); }}
                  className={`py-2 text-xs font-bold transition-all cursor-pointer ${
                    isLogin
                      ? 'bg-[#ca3a3a] text-white border border-t-[#ff6b6b] border-l-[#ff6b6b] border-b-[#1a0505] border-r-[#1a0505]'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  INICIAR SESIÓN
                </button>
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setError(''); }}
                  className={`py-2 text-xs font-bold transition-all cursor-pointer ${
                    !isLogin
                      ? 'bg-[#ca3a3a] text-white border border-t-[#ff6b6b] border-l-[#ff6b6b] border-b-[#1a0505] border-r-[#1a0505]'
                      : 'text-[#A1A1AA] hover:text-white'
                  }`}
                >
                  REGISTRARSE
                </button>
              </div>

              {/* Name field (register only) */}
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <label htmlFor="name" className="block text-[10px] text-[#A1A1AA] mb-1 uppercase tracking-wider">
                      NOMBRE DE USUARIO
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="retro-input w-full text-xs"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label htmlFor="email" className="block text-[10px] text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  CORREO ELECTRÓNICO
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@atopic.com"
                  className="retro-input w-full text-xs"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] text-[#A1A1AA] mb-1 uppercase tracking-wider">
                  CONTRASEÑA
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="retro-input w-full text-xs"
                />
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-[#ff6b6b] bg-[#1a0505] border border-[#ca3a3a] py-2 px-3 text-center"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={isLoading}>
                {isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA VIP'}
              </Button>
            </motion.form>
          )}

          {/* Footer note */}
          <div className="mt-5 pt-3 border-t border-[#1a0505] text-center">
            <p className="text-[10px] text-[#A1A1AA] leading-relaxed">
              Usa el mismo correo con el que realizas compras en Shopify para sincronizar automáticamente tus coins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
