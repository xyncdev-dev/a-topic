'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useUser, UserButton } from '@clerk/nextjs';
import { useAuth } from '../../context/AuthContext';
import { SITE_DATA } from '../../data';

const ModelViewer = 'model-viewer' as any;

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { user } = useAuth();

  // Retro OS state
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Interactive Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(SITE_DATA.home.simulatorWindow.defaultAmount);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Model-viewer material tinting to #ca3a3a
  useEffect(() => {
    const applyTint = () => {
      const viewer = document.querySelector('#hero-logo-3d') as any;
      if (viewer && viewer.model && viewer.model.materials) {
        viewer.model.materials.forEach((mat: any) => {
          if (mat.pbrMetallicRoughness) {
            mat.pbrMetallicRoughness.setBaseColorFactor([0.792, 0.227, 0.227, 1]);
          }
        });
      }
    };

    const viewerEl = document.querySelector('#hero-logo-3d');
    if (viewerEl) {
      viewerEl.addEventListener('load', applyTint);
    }
  }, []);

  // Calculation helpers
  const calculatedCoins = Math.floor(calcAmount * SITE_DATA.shopify.coinsPerEuro);
  const calculatedTier =
    calculatedCoins >= 3500
      ? 'BLACK VIP'
      : calculatedCoins >= 1500
      ? 'GOLD TIER'
      : calculatedCoins >= 500
      ? 'SILVER TIER'
      : 'BRONZE TIER';
  const discountUnlocked =
    calculatedCoins >= 1000 ? '10,00€' : calculatedCoins >= 500 ? '5,00€' : '2,50€';

  const { home, noticeBar, footer, startMenu, shopify, brand } = SITE_DATA;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0a0a0a] text-[#f0f0f0] font-mono selection:bg-[#ca3a3a] selection:text-white flex flex-col justify-between relative">
      {/* Inline styles for Retro OS desktop */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-accent: #ca3a3a;
          --color-titlebar: #ca3a3a;
          --color-border-light: #ca3a3a;
          --color-border-dark: #660000;
          --color-border-darkest: #1a0505;
        }
        .win-frame {
          background: #0a0a0a;
          border: 2px solid;
          border-color: #ca3a3a #1a0505 #1a0505 #ca3a3a;
          box-shadow: 2px 2px 0px #000000;
        }
        .win-titlebar {
          background: #ca3a3a;
          color: #ffffff;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.05em;
          user-select: none;
        }
        .win-btn {
          width: 18px;
          height: 16px;
          background: #0a0a0a;
          border: 1px solid;
          border-color: #ff6b6b #1a0505 #1a0505 #ff6b6b;
          font-size: 10px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #f0f0f0;
          user-select: none;
          cursor: default;
        }
        button.win-btn,
        .win-btn[role="button"] {
          cursor: pointer;
        }
        .win-btn:active {
          border-color: #1a0505 #ff6b6b #ff6b6b #1a0505;
        }
        .btn-retro {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 16px;
          background: #0a0a0a;
          border: 2px solid;
          border-color: #ca3a3a #1a0505 #1a0505 #ca3a3a;
          font-size: 12px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.05em;
          box-shadow: 2px 2px 0px #000000;
          transition: all 0.1s ease;
          user-select: none;
          text-decoration: none;
          cursor: pointer;
        }
        .btn-retro:hover {
          background: #1a0505;
          color: #ffffff;
        }
        .btn-retro:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #000000;
          border-color: #1a0505 #ca3a3a #ca3a3a #1a0505;
        }
        .retro-inset {
          background: #050505;
          border: 2px solid;
          border-color: #1a0505 #ca3a3a #ca3a3a #1a0505;
        }
      `}} />

      {/* External script for 3D model viewer */}
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
        strategy="afterInteractive"
      />

      {/* Header Container */}
      <div className="flex-shrink-0">
        {/* Top System Notice Bar */}
        <div className="bg-[#ca3a3a] text-white text-[11px] font-bold py-1 px-4 tracking-wider border-b border-[#1a0505] flex items-center justify-between overflow-hidden">
          <span className="hidden sm:inline">{noticeBar.leftTag}</span>
          <span className="mx-auto sm:mx-0">{noticeBar.centerMessage}</span>
          <span className="hidden sm:inline">{noticeBar.rightTag}</span>
        </div>

        {/* Main Retro OS Menu Bar */}
        <header className="bg-[#0a0a0a] border-b-2 border-[#ca3a3a] shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <div className="max-w-6xl mx-auto px-4 h-11 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Start Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStartMenuOpen(!startMenuOpen)}
                  className={`btn-retro text-xs py-1 px-2.5 flex items-center gap-1.5 ${
                    startMenuOpen ? '!bg-[#ca3a3a] !text-white' : ''
                  }`}
                >
                  <span className="text-[#ca3a3a] font-black group-hover:text-white">☰</span>
                  <span>Start</span>
                </button>

                {/* Start Menu Dropdown */}
                {startMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-[#0a0a0a] border-2 border-[#ca3a3a] shadow-[4px_4px_0px_#1a0505] z-50 py-1">
                    <div className="bg-[#ca3a3a] text-white text-[10px] font-bold px-3 py-1.5 mb-1 tracking-widest">
                      {startMenu.header}
                    </div>
                    <a
                      href={shopify.catalogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setStartMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f0f0f0] hover:bg-[#ca3a3a] hover:text-white transition-colors"
                    >
                      <span>🛍️</span>
                      <span>{startMenu.shopLinkText}</span>
                    </a>
                    <Link
                      href="/rewards"
                      onClick={() => setStartMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f0f0f0] hover:bg-[#ca3a3a] hover:text-white transition-colors"
                    >
                      <span>🏷️</span>
                      <span>{startMenu.rewardsLinkText}</span>
                    </Link>
                    <Link
                      href="/earn"
                      onClick={() => setStartMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f0f0f0] hover:bg-[#ca3a3a] hover:text-white transition-colors"
                    >
                      <span>💎</span>
                      <span>{startMenu.earnLinkText}</span>
                    </Link>
                    <Link
                      href="/history"
                      onClick={() => setStartMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f0f0f0] hover:bg-[#ca3a3a] hover:text-white transition-colors"
                    >
                      <span>📜</span>
                      <span>{startMenu.historyLinkText}</span>
                    </Link>
                    <div className="my-1 border-t border-[#330000]" />
                    {isSignedIn ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setStartMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f0f0f0] hover:bg-[#ca3a3a] hover:text-white transition-colors"
                      >
                        <span>👤</span>
                        <span>{startMenu.dashboardLinkText}</span>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setStartMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#ca3a3a] font-bold hover:bg-[#ca3a3a] hover:text-white transition-colors"
                      >
                        <span>🔑</span>
                        <span>{startMenu.loginLinkText}</span>
                      </Link>
                    )}
                    <a
                      href={shopify.contactUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setStartMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#f0f0f0] hover:bg-[#ca3a3a] hover:text-white transition-colors"
                    >
                      <span>✉</span>
                      <span>{startMenu.contactLinkText}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Brand Logo in Menu */}
              <Link href="/home" className="flex items-center gap-2 group">
                <span className="text-lg font-black tracking-widest text-[#ca3a3a] group-hover:text-white transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-[#666666] border border-[#330000] px-1.5 py-0.5">
                  {brand.version}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-5 text-xs">
              <a
                href={shopify.catalogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a1a1aa] hover:text-[#ca3a3a] transition-colors flex items-center gap-1 font-bold"
              >
                <span>Catálogo Shopify</span>
                <span className="text-[10px]">↗</span>
              </a>
              <Link href="/rewards" className="text-[#a1a1aa] hover:text-[#ca3a3a] transition-colors">
                Cupones
              </Link>
              <Link href="/earn" className="text-[#a1a1aa] hover:text-[#ca3a3a] transition-colors">
                Ganar Coins
              </Link>
              <Link href="/history" className="text-[#a1a1aa] hover:text-[#ca3a3a] transition-colors">
                Historial
              </Link>
            </nav>

            {/* Right System Tools */}
            <div className="flex items-center gap-2.5">
              {/* Live Coin Balance (if signed in) */}
              {isSignedIn && user && (
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 bg-[#111111] border border-[#ca3a3a] px-2.5 py-1 text-xs text-white"
                >
                  <span className="text-[#ca3a3a]">🪙</span>
                  <span className="font-bold">{user.currentBalance.toLocaleString('es-ES')}</span>
                  <span className="text-[10px] text-[#a1a1aa]">COINS</span>
                </Link>
              )}

              {/* Clerk User Button / Login */}
              {isSignedIn ? (
                <div className="flex items-center gap-2">
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-7 h-7 border border-[#ca3a3a]',
                      },
                    }}
                  />
                  <Link
                    href="/dashboard"
                    className="btn-retro text-[11px] py-1 px-2.5 hidden sm:inline-flex"
                  >
                    Portal
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="btn-retro text-[11px] py-1 px-3 !bg-[#ca3a3a] !text-white hover:!bg-[#e04848]">
                  Acceder
                </Link>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Main Single-Viewport Container (Fits without scroll on desktop) */}
      <main className="max-w-6xl w-full mx-auto px-4 py-3 sm:py-4 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* ─── Left Window: Bóveda de Recompensas ─── */}
          <section className="lg:col-span-7 win-frame flex flex-col">
            <div className="win-titlebar">
              <span className="flex items-center gap-2 truncate">
                <span>⚡</span>
                <span>{home.vaultWindow.title}</span>
              </span>
              <div className="win-controls flex items-center gap-1">
                <span className="win-btn" aria-hidden="true">_</span>
                <span className="win-btn" aria-hidden="true">□</span>
                <span className="win-btn" aria-hidden="true">✕</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-[#0e0e0e] flex-1 flex flex-col justify-between space-y-4">
              {/* 3D Model Emblem */}
              <div className="flex items-center justify-center min-h-[140px] bg-[#070707] border border-[#1a0505] relative overflow-hidden">
                <div className="absolute top-1.5 left-2 text-[9px] text-[#555555] tracking-widest">
                  {home.vaultWindow.badge}
                </div>
                <ModelViewer
                  id="hero-logo-3d"
                  src={brand.model3dUrl}
                  alt={`${brand.name} 3D Logo`}
                  auto-rotate
                  auto-rotate-delay="0"
                  rotation-per-second="18deg"
                  orientation="90deg 90deg 0deg"
                  interaction-prompt="none"
                  camera-controls
                  min-camera-orbit="auto 90deg auto"
                  max-camera-orbit="auto 90deg auto"
                  disable-zoom
                  field-of-view="30deg"
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    height: '140px',
                    backgroundColor: 'transparent',
                  }}
                >
                  <div slot="poster" className="flex flex-col items-center justify-center h-full">
                    <h2 className="text-3xl font-black text-[#ca3a3a] tracking-widest">{brand.name}</h2>
                    <p className="text-[10px] text-[#888888] tracking-widest">{brand.slogan}</p>
                  </div>
                </ModelViewer>
              </div>

              {/* Value Proposition */}
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
                  {home.vaultWindow.headline}
                </h1>
                <p className="text-xs text-[#a1a1aa] mt-1.5 leading-relaxed">
                  {home.vaultWindow.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={shopify.catalogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-retro !bg-[#ca3a3a] !text-white hover:!bg-[#e04848] text-xs py-2 px-4 font-bold flex items-center gap-1.5"
                >
                  <span>🛍️</span>
                  <span>{home.vaultWindow.ctaShopify}</span>
                </a>
                <Link href="/rewards" className="btn-retro text-xs py-2 px-3.5">
                  <span>🏷️</span>
                  <span className="ml-1.5">{home.vaultWindow.ctaRewards}</span>
                </Link>
                <Link
                  href={isSignedIn ? "/dashboard" : "/login"}
                  className="btn-retro text-xs py-2 px-3.5"
                >
                  {isSignedIn ? home.vaultWindow.ctaDashboard : home.vaultWindow.ctaLogin}
                </Link>
              </div>

              {/* 3-Step Program Strip */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#1a0505] text-left">
                {home.vaultWindow.steps.map((step, idx) => (
                  <div key={idx} className="bg-[#050505] border border-[#1a0505] p-2">
                    <span className="text-[9px] text-[#ca3a3a] font-bold block">{step.step}</span>
                    <p className="text-xs font-bold text-white mt-0.5">{step.title}</p>
                    <p className="text-[10px] text-[#777777] mt-0.5 hidden sm:block">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── Right Window: Simulador de Monedas ─── */}
          <section className="lg:col-span-5 win-frame flex flex-col">
            <div className="win-titlebar">
              <span className="flex items-center gap-2">
                <span>🧮</span>
                <span>{home.simulatorWindow.title}</span>
              </span>
              <div className="win-controls flex items-center gap-1">
                <span className="win-btn" aria-hidden="true">_</span>
                <span className="win-btn" aria-hidden="true">□</span>
                <span className="win-btn" aria-hidden="true">✕</span>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-[#0e0e0e] flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {home.simulatorWindow.headline}
                </h2>
                <p className="text-[11px] text-[#888888] mt-1">
                  {home.simulatorWindow.description}
                </p>

                {/* Slider */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#ca3a3a] font-bold uppercase">{home.simulatorWindow.sliderLabel}</span>
                    <span className="text-white font-black bg-[#111] px-2 py-0.5 border border-[#222]">
                      {calcAmount}€
                    </span>
                  </div>
                  <input
                    id="calc-amount"
                    type="range"
                    min={home.simulatorWindow.minAmount}
                    max={home.simulatorWindow.maxAmount}
                    step={home.simulatorWindow.step}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full accent-[#ca3a3a] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#666666]">
                    <span>{home.simulatorWindow.minAmount}€</span>
                    <span>{Math.round((home.simulatorWindow.minAmount + home.simulatorWindow.maxAmount) / 2)}€</span>
                    <span>{home.simulatorWindow.maxAmount}€</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Inset Box */}
              <div className="retro-inset p-3 sm:p-4">
                <div className="text-[10px] text-[#666666] tracking-widest mb-2 pb-1 border-b border-[#1a0505] flex items-center justify-between">
                  <span>{home.simulatorWindow.resultTitle}</span>
                  <span className="text-emerald-400 font-bold">{home.simulatorWindow.resultBadge}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-[#a1a1aa] uppercase block">{home.simulatorWindow.labelCoins}</span>
                    <span className="text-xl font-black text-[#ca3a3a]">
                      +{calculatedCoins.toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#a1a1aa] uppercase block">{home.simulatorWindow.labelTier}</span>
                    <span className="text-xs font-bold text-white block mt-1">
                      {calculatedTier}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#a1a1aa] uppercase block">{home.simulatorWindow.labelDiscount}</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-0.5">
                      {discountUnlocked}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#a1a1aa] uppercase block">{home.simulatorWindow.labelShipping}</span>
                    <span className="text-xs font-bold text-white block mt-0.5">
                      {calcAmount >= shopify.freeShippingThreshold
                        ? home.simulatorWindow.shippingIncluded
                        : home.simulatorWindow.shippingNotIncluded}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-1">
                <Link
                  href={isSignedIn ? "/dashboard" : "/login"}
                  className="btn-retro !w-full text-center text-xs py-2"
                >
                  {isSignedIn ? home.simulatorWindow.ctaLoggedIn : home.simulatorWindow.ctaGuest}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Retro OS Status Bar (Always docked) */}
      <footer className="flex-shrink-0 bg-[#0a0a0a] border-t-2 border-[#ca3a3a] text-[11px] select-none">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[#ca3a3a] font-bold">{footer.brandTag}</span>
            <span className="text-[#666666] hidden sm:inline">|</span>
            <span className="text-[#a1a1aa] hidden sm:inline">
              {footer.copyright}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#888888]">
            <span className="hidden md:inline">{footer.shippingNotice}</span>
            <div className="flex items-center gap-1.5 bg-[#111111] px-2 py-0.5 border border-[#333333]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-white text-[10px]">{footer.onlineStatus}</span>
            </div>
            <div className="bg-[#111111] px-2.5 py-0.5 border border-[#333333] font-mono text-white text-[10px]">
              {currentTime || '22:00:00'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
