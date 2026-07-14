/**
 * KrishiMitra AI — Root Layout
 * ==============================
 * Wraps the entire application. Provides:
 * - Sonner toast container
 * - Global page meta / font rendering
 * - Animated route transitions
 */

import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useTheme } from '@/hooks/useTheme'

export function RootLayout() {
  const { isDark } = useTheme()

  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={isDark ? 'dark' : 'light'}
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'Inter, sans-serif', borderRadius: '12px' },
        }}
      />
    </>
  )
}
