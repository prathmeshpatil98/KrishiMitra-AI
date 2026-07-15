/**
 * KrishiMitra AI — Root Providers Composition
 * =============================================
 * Composes all context providers in the correct dependency order.
 * Import and use <Providers> in main.tsx only.
 *
 * Order (outer → inner):
 *   QueryProvider → ThemeProvider → AuthProvider
 */

import type { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider }  from './ThemeProvider'
import { AuthProvider }   from './AuthProvider'
import { LanguageProvider } from './LanguageProvider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryProvider>
  )
}
