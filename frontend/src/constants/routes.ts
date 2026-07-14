/**
 * KrishiMitra AI — Application Route Constants
 * ==============================================
 * Single source of truth for all client-side route paths.
 * Never hardcode route strings in components or hooks.
 * Import from here everywhere.
 */

export const ROUTES = {
  // ── Public ──────────────────────────────────────────────────
  HOME: '/',

  // ── Authentication ──────────────────────────────────────────
  AUTH: {
    LOGIN:    '/auth/login',
    REGISTER: '/auth/register',
    FORGOT:   '/auth/forgot-password',
    RESET:    '/auth/reset-password',
  },

  // ── Authenticated App ────────────────────────────────────────
  DASHBOARD:      '/dashboard',
  AI_ASSISTANT:   '/assistant',

  MARKET: {
    ROOT:    '/markets',
    DETAIL:  '/markets/:marketId',
    HISTORY: '/markets/history',
  },

  WEATHER: {
    ROOT:     '/weather',
    FORECAST: '/weather/forecast',
  },

  TRANSPORT: {
    ROOT:   '/transport',
    ROUTES: '/transport/routes',
  },

  RECOMMENDATION: {
    ROOT:   '/recommendations',
    DETAIL: '/recommendations/:id',
  },

  GOVERNMENT: {
    ROOT:   '/government-schemes',
    DETAIL: '/government-schemes/:schemeId',
  },

  PROFILE: {
    ROOT: '/profile',
    FARM: '/profile/farm',
    CROP: '/profile/crops',
  },

  SETTINGS: {
    ROOT:         '/settings',
    PREFERENCES:  '/settings/preferences',
    SECURITY:     '/settings/security',
    NOTIFICATIONS:'/settings/notifications',
  },

  // ── Error / Utility ──────────────────────────────────────────
  NOT_FOUND: '/404',
} as const
