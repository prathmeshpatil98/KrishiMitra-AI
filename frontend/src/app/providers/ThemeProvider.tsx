/**
 * KrishiMitra AI — Theme Provider
 * ==================================
 * Manages light / dark / system theme with:
 *  - localStorage persistence
 *  - OS prefers-color-scheme listener
 *  - Smooth class toggling on <html>
 */

import { useEffect, useReducer, useCallback, type ReactNode } from 'react'
import { CACHE_KEYS } from '@/constants/config'
import type { Theme } from '@/types/common'
import { ThemeContext, themeReducer } from '@/app/store/themeStore'

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyThemeToDOM(resolved: 'light' | 'dark'): void {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps) {
  const stored = (localStorage.getItem(CACHE_KEYS.THEME) as Theme | null) ?? defaultTheme
  const initialResolved = resolveTheme(stored)

  const [state, dispatch] = useReducer(themeReducer, {
    theme: stored,
    resolvedTheme: initialResolved,
  })

  // Apply on mount and on change
  useEffect(() => {
    applyThemeToDOM(state.resolvedTheme)
  }, [state.resolvedTheme])

  // Listen for OS theme changes when user has 'system' selected
  useEffect(() => {
    if (state.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => dispatch({ type: 'SET_THEME', payload: 'system' })
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [state.theme])

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem(CACHE_KEYS.THEME, theme)
    dispatch({ type: 'SET_THEME', payload: theme })
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        theme:         state.theme,
        resolvedTheme: state.resolvedTheme,
        isDark:        state.resolvedTheme === 'dark',
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
