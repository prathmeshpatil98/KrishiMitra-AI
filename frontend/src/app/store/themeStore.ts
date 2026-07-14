/**
 * KrishiMitra AI — Theme Store (React Context + Reducer)
 * =======================================================
 * Manages light/dark/system theme state.
 * Persists to localStorage and syncs with OS prefers-color-scheme.
 */

import { createContext, useContext } from 'react'
import type { Theme } from '@/types/common'

export interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
}

export type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }

export function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME': {
      const resolved = action.payload === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : action.payload
      return { theme: action.payload, resolvedTheme: resolved }
    }
    default:
      return state
  }
}

export interface ThemeContextValue {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  isDark: boolean
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useThemeContext must be used within <ThemeProvider>')
  }
  return ctx
}
