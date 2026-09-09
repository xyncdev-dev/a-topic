/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * A-TOPIC / A-TYPIC REWARDS — CONFIGURACIÓN GLOBAL DE CONTENIDOS & TEXTOS
 * ═══════════════════════════════════════════════════════════════════════════════
 * Modifica este archivo para cambiar fácilmente los textos, enlaces, títulos,
 * avisos del sistema, reglas de conversión y URLs de Shopify en toda la web.
 */

export const SITE_DATA = {
  // ─── Identidad y Marca ────────────────────────────────────────────────────────
  brand: {
    name: 'A-TYPIC',
    fullName: 'A-Topic Rewards',
    slogan: 'THE WORLD IS YOURS',
    version: 'v2.6',
    logoImage: '/logo.png',
    // URL del modelo 3D GLB oficial que rota en el visualizador WebGL
    model3dUrl: 'https://ycaj60-by.myshopify.com/cdn/shop/t/31/assets/atypic.glb',
  },

  // ─── Enlaces y Reglas de Shopify ──────────────────────────────────────────────
  shopify: {
    storeUrl: 'https://ycaj60-by.myshopify.com',
    catalogUrl: 'https://ycaj60-by.myshopify.com/collections/all',
    cartUrl: 'https://ycaj60-by.myshopify.com/cart',
    contactUrl: 'https://ycaj60-by.myshopify.com/pages/contact',
    freeShippingThreshold: 50, // Importe en euros para envío gratis
    coinsPerEuro: 10, // Ratio de acumulación: 1€ = 10 VIP Coins
  },

  // ─── Barra Superior de Avisos del Sistema ────────────────────────────────────
  noticeBar: {
    leftTag: 'SYS_INFO // A-TYPIC VAULT',
    centerMessage: '⚠ RECOMPENSAS: 1€ gastado en Shopify = 10 VIP Coins | Envíos gratis en pedidos +50€',
    rightTag: 'SECURE_LINK [OK]',
  },

  // ─── Pie de Página (Status Bar Retro OS) ──────────────────────────────────────
  footer: {
    brandTag: 'A-TYPIC // REWARDS',
    copyright: '© 2026 A-Typic. Todos los derechos reservados.',
    shippingNotice: 'Envíos gratis en pedidos superiores a 50€',
    onlineStatus: 'ONLINE',
  },

  // ─── Página Principal (/home) ────────────────────────────────────────────────
  home: {
    // Ventana Izquierda: Bóveda de Recompensas
    vaultWindow: {
      title: 'C:\\ATOPIC\\LOYALTY_VAULT.EXE // VIP_TERMINAL',
      badge: '3D_EMBLEM_STREAM // ACTIVE',
      headline: 'Club VIP & Bóveda de Recompensas',
      description:
        'Tus pedidos en la tienda oficial generan monedas automáticas (1€ = 10 VIP Coins). Canjea tus puntos por prendas exclusivas, cupones directos y ventajas prioritarias.',
      ctaShopify: 'Comprar en Shopify ↗',
      ctaRewards: 'Ver Cupones',
      ctaDashboard: 'Mi Panel VIP',
      ctaLogin: 'Iniciar Sesión',
      steps: [
        { step: 'PASO 01', title: 'Compra', desc: 'En Shopify Store' },
        { step: 'PASO 02', title: '1€ = 10 Coins', desc: 'Acreditación Auto' },
        { step: 'PASO 03', title: 'Canjea', desc: 'Cupones & Drops' },
      ],
    },

    // Ventana Derecha: Simulador de Monedas
    simulatorWindow: {
      title: 'C:\\ATOPIC\\COIN_SIMULATOR.EXE',
      headline: 'Simulador de Puntos',
      description: 'Estima el importe de tu compra en Shopify para previsualizar los coins generados:',
      sliderLabel: 'Importe estimado:',
      minAmount: 10,
      maxAmount: 300,
      step: 5,
      defaultAmount: 100,
      resultTitle: 'PREVISIÓN DE RECOMPENSA',
      resultBadge: '● SIMULADO',
      labelCoins: 'Coins Ganados',
      labelTier: 'Rango VIP',
      labelDiscount: 'Descuento',
      labelShipping: 'Envío Gratis',
      shippingIncluded: '✓ Incluido',
      shippingNotIncluded: 'Pedido < 50€',
      ctaLoggedIn: 'Ver Mis Puntos Acumulados',
      ctaGuest: 'Crear Cuenta para Guardar Puntos',
    },
  },

  // ─── Catálogo de Recompensas (/rewards) ───────────────────────────────────────
  rewards: {
    windowTitle: 'C:\\ATOPIC\\REWARDS.CAT // DISCOUNT_CATALOG',
    balanceLabel: 'BALANCE DISPONIBLE PARA CANJEAR',
    btnShopify: 'VISITAR SHOPIFY ↗',
    guestTitle: 'MODO INVITADO // CATÁLOGO PÚBLICO',
    guestDescription: 'Inicia sesión para consultar tus coins y canjear cupones',
    guestCta: 'INICIAR SESIÓN [→]',
    sectionTitle: 'CUPONES & BENEFICIOS ACTIVOS',
    loadingText: 'CARGANDO RECOMPENSAS...',
  },

  // ─── Reglas y Protocolo (/earn) ──────────────────────────────────────────────
  earn: {
    windowTitle: 'C:\\RULES\\EARN_PROTOCOL.SYS // PROTOCOL_V1',
    bannerTitle: '¿CÓMO ACUMULAR COINS?',
    bannerDescription:
      'Cada compra en A-Topic Shopify genera coins automáticamente (1€ = 10 Coins). Usa el mismo correo al comprar para acumular recompensas VIP y subir de nivel.',
    claimButtonAuth: 'RECLAMAR CÓDIGO DE PEDIDO',
    claimButtonGuest: 'INICIAR SESIÓN PARA RECLAMAR',
    sectionTitle: 'REGLAS DE BONIFICACIÓN DISPONIBLES',
    footerNote:
      'Las coins de compras se acreditan al procesar el pedido. Las acciones manuales son auditadas por el equipo de A-Topic.',
  },

  // ─── Historial de Movimientos (/history) ──────────────────────────────────────
  history: {
    windowTitle: 'C:\\LOGS\\HISTORY.LOG // AUDIT_REGISTER',
    guestTitle: 'REGISTRO DE AUDITORÍA // SESIÓN REQUERIDA',
    guestDescription:
      'El historial detallado de transacciones, monedas ganadas y cupones canjeados se encuentra vinculado a tu cuenta de cliente. Inicia sesión para ver tu actividad.',
    guestLoginBtn: 'INICIAR SESIÓN [→]',
    guestRewardsBtn: 'VER RECOMPENSAS',
    statBalance: 'SALDO VIVO',
    statEarned: 'TOTAL GANADO',
    statRedeemed: 'TOTAL CANJEADO',
    sectionTitle: 'REGISTRO DE MOVIMIENTOS',
    loadingText: 'CARGANDO HISTORIAL...',
    loadMoreText: 'CARGAR MÁS MOVIMIENTOS [↓]',
    loadingMoreText: 'CARGANDO REGISTROS...',
  },

  // ─── Panel Principal de Usuario (/dashboard) ──────────────────────────────────
  dashboard: {
    windowTitleAuth: 'C:\\ATOPIC\\DASHBOARD.EXE // SESSION_ACTIVE',
    windowTitleGuest: 'C:\\ATOPIC\\DASHBOARD.EXE // GUEST_TERMINAL',
    userLabelAuth: 'USUARIO AUTENTICADO',
    userLabelGuest: 'MODO INVITADO // TERMINAL PÚBLICA',
    guestName: 'INVITADO',
    logoutBtn: 'CERRAR SESIÓN',
    loginBtn: 'INICIAR SESIÓN [→]',
    shortcutsTitle: 'C:\\SYSTEM\\SHORTCUTS.DIR',
    shortcutsBadge: 'SYSTEM TOOLS',
    activityTitle: 'C:\\LOGS\\ACTIVITY.LOG',
    viewAllActivity: 'VER TODO [→]',
    guestEmptyActivity:
      'No hay movimientos en sesión de invitado. Inicia sesión para sincronizar tus pedidos y monedas.',
  },

  // ─── Menú Inicio (Start Menu) ────────────────────────────────────────────────
  startMenu: {
    header: 'A-TYPIC OS // MENU',
    shopLinkText: 'Catálogo Oficial Shopify ↗',
    rewardsLinkText: 'Catálogo de Cupones',
    earnLinkText: 'Reglas y Protocolo VIP',
    historyLinkText: 'Historial de Movimientos',
    dashboardLinkText: 'Mi Panel de Usuario',
    loginLinkText: 'Acceder / Registrarse',
    contactLinkText: 'Contacto y Soporte',
  },
};

export type SiteData = typeof SITE_DATA;
