/**
 * KrishiMitra AI — Application Configuration Constants
 * ======================================================
 * Non-secret application-level constants.
 * Secrets and environment-specific values live in .env files.
 */

export const APP_CONFIG = {
  NAME:    'KrishiMitra AI',
  TAGLINE: 'AI-Powered Farming Intelligence',
  VERSION: '1.0.0',
} as const

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     100,
} as const

export const CACHE_KEYS = {
  USER:            'krishimitra_user',
  ACCESS_TOKEN:    'krishimitra_access_token',
  REFRESH_TOKEN:   'krishimitra_refresh_token',
  THEME:           'krishimitra_theme',
  LANGUAGE:        'krishimitra_language',
  SIDEBAR_COLLAPSED: 'krishimitra_sidebar_collapsed',
} as const

export const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'mr', label: 'मराठी' },
] as const

export const QUERY_STALE_TIMES = {
  MARKET_PRICES: 5 * 60 * 1000,   // 5 minutes
  WEATHER:       10 * 60 * 1000,  // 10 minutes
  GOVERNMENT:    24 * 60 * 60 * 1000, // 24 hours
  DASHBOARD:     2 * 60 * 1000,   // 2 minutes
  NOTIFICATIONS: 30 * 1000,       // 30 seconds
} as const

export const REQUEST_TIMEOUT_MS = 15_000
