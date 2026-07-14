/**
 * KrishiMitra AI — API Endpoint Constants
 * =========================================
 * All backend API endpoint path strings.
 * Always use these — never hardcode strings in service files.
 */

export const API_ENDPOINTS = {
  // ── Authentication ───────────────────────────────────────────
  AUTH: {
    LOGIN:   '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT:  '/auth/logout',
    ME:      '/users/me',
  },

  // ── Health ───────────────────────────────────────────────────
  HEALTH: '/health',

  // ── AI Chat ──────────────────────────────────────────────────
  CHAT: {
    SEND:     '/chat',
    HISTORY:  '/chat/history',
    CONVERSATION: (id: string) => `/chat/${id}`,
  },

  // ── Market ───────────────────────────────────────────────────
  MARKETS: {
    LIST:    '/markets',
    HISTORY: '/markets/history',
    DETAIL:  (id: string) => `/markets/${id}`,
  },

  // ── Weather ──────────────────────────────────────────────────
  WEATHER: {
    CURRENT:  '/weather/current',
    FORECAST: '/weather/forecast',
  },

  // ── Transport ────────────────────────────────────────────────
  TRANSPORT: {
    DISTANCE: '/transport/distance',
    ROUTES:   '/transport/routes',
  },

  // ── Recommendation ───────────────────────────────────────────
  RECOMMENDATION: {
    CREATE: '/recommendation',
  },

  // ── Government Schemes ───────────────────────────────────────
  GOVERNMENT: {
    SCHEMES: '/government/schemes',
    DETAIL:  (id: string) => `/government/schemes/${id}`,
  },

  // ── Farmer Profile ───────────────────────────────────────────
  FARMER: {
    PROFILE: (id: string) => `/farmers/${id}`,
    UPDATE:  (id: string) => `/farmers/${id}`,
  },

  // ── Dashboard ────────────────────────────────────────────────
  DASHBOARD: '/dashboard',

  // ── Notifications ────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST:     '/notifications',
    MARK_READ: '/notifications/read',
  },

  // ── Voice ────────────────────────────────────────────────────
  VOICE: {
    TRANSCRIBE: '/voice/transcribe',
    SPEAK:      '/voice/speak',
  },
} as const
