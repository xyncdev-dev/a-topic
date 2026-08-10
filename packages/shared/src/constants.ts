import type { VipTier, EarnRule } from './types';

// ─── VIP Tiers ─────────────────────────────────────────────────
export const VIP_TIERS: VipTier[] = [
  {
    name: 'Bronce',
    slug: 'bronze',
    minCoins: 0,
    color: '#CD7F32',
    gradient: 'from-amber-700 to-amber-500',
    icon: '',
    benefits: ['Acceso al portal de recompensas', 'Acumulación de coins por compras'],
  },
  {
    name: 'Plata',
    slug: 'silver',
    minCoins: 5000,
    color: '#C0C0C0',
    gradient: 'from-gray-400 to-gray-300',
    icon: '',
    benefits: ['Todo lo de Bronce', 'Acceso anticipado a drops', 'Multiplicador x1.2'],
  },
  {
    name: 'Oro',
    slug: 'gold',
    minCoins: 15000,
    color: '#FFD700',
    gradient: 'from-yellow-500 to-amber-400',
    icon: '',
    benefits: ['Todo lo de Plata', 'Envío gratis permanente', 'Multiplicador x1.5'],
  },
  {
    name: 'Platino',
    slug: 'platinum',
    minCoins: 50000,
    color: '#E50914',
    gradient: 'from-red-600 to-red-900',
    icon: '',
    benefits: ['Todo lo de Oro', 'Productos exclusivos', 'Multiplicador x2', 'Soporte VIP prioritario'],
  },
];

// ─── Default Coins Multiplier ──────────────────────────────────
export const DEFAULT_COINS_MULTIPLIER = 10; // 10 coins per 1€ spent

// ─── Earn Rules (informational) ────────────────────────────────
export const EARN_RULES: EarnRule[] = [
  {
    id: 'purchase',
    icon: '',
    title: 'Compras en la tienda',
    description: 'Gana coins automáticamente con cada compra que realices en A-Topic.',
    coinsAmount: '10 coins por cada 1€',
    isAutomatic: true,
  },
  {
    id: 'instagram',
    icon: '',
    title: 'Etiquétanos en Instagram',
    description: 'Sube una foto con nuestros productos y etiqueta @atopic. Nos encanta verte brillar.',
    coinsAmount: '+500 coins',
    isAutomatic: false,
  },
  {
    id: 'referral',
    icon: '',
    title: 'Refiere a un amigo',
    description: 'Comparte tu código de referido. Cuando tu amigo haga su primera compra, ambos ganan.',
    coinsAmount: '+1,000 coins',
    isAutomatic: false,
  },
  {
    id: 'birthday',
    icon: '',
    title: 'Cumpleaños',
    description: 'Registra tu fecha de nacimiento y recibe un bonus especial cada año.',
    coinsAmount: '+500 coins',
    isAutomatic: false,
  },
  {
    id: 'review',
    icon: '',
    title: 'Deja una reseña',
    description: 'Comparte tu opinión sobre los productos que has comprado.',
    coinsAmount: '+200 coins',
    isAutomatic: false,
  },
];
