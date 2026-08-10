import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Navigation } from '../components/ui/Navigation';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A-Topic Rewards | Portal de Recompensas',
  description:
    'Acumula coins con cada compra y canjéalos por descuentos exclusivos en A-Topic. Tu programa de lealtad VIP de streetwear.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <main className="max-w-md mx-auto min-h-dvh relative">
            {children}
          </main>
          <Navigation />
        </AuthProvider>
      </body>
    </html>
  );
}
