/**
 * KrishiMitra AI — Theme Provider
 * ==================================
 * Locked to bright light theme as requested.
 */

import { useEffect, useCallback, type ReactNode } from 'react'
import { ThemeContext } from '@/app/store/themeStore'

interface ThemeProviderProps {
  children: ReactNode
}

function applyThemeToDOM(): void {
  const root = document.documentElement
  root.classList.remove('dark')
}

export function ThemeProvider({ children }: ThemeProviderProps) {


  // Apply light theme on mount
  useEffect(() => {
    applyThemeToDOM()
  }, [])

  // Mock setter for theme (no-op since we force light)
  const setTheme = useCallback(() => {}, [])

  return (
    <ThemeContext.Provider
      value={{
        theme:         'light',
        resolvedTheme: 'light',
        isDark:        false,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
export default ThemeProvider
