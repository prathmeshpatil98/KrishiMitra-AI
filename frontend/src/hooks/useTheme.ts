/**
 * KrishiMitra AI — useTheme Hook
 * =================================
 * Convenience hook for consuming the ThemeContext.
 * Always use this in components — never useThemeContext directly.
 */

import { useThemeContext } from '@/app/store/themeStore'
import type { Theme }      from '@/types/common'

export interface UseThemeReturn {
  theme:         Theme
  resolvedTheme: 'light' | 'dark'
  isDark:        boolean
  isLight:       boolean
  setTheme:      (theme: Theme) => void
  toggleTheme:   () => void
}

export function useTheme(): UseThemeReturn {
  const { theme, resolvedTheme, isDark, setTheme } = useThemeContext()

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return {
    theme,
    resolvedTheme,
    isDark,
    isLight: !isDark,
    setTheme,
    toggleTheme,
  }
}
