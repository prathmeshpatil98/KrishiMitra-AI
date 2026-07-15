/**
 * KrishiMitra AI — TanStack Query Provider
 * ==========================================
 * Configures the global QueryClient with sensible production defaults.
 * - 3 retries for server errors (not 4xx client errors)
 * - Conservative stale times to avoid unnecessary refetches
 * - Toast on query errors via sonner
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ReactNode } from 'react'

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Never retry authentication / validation errors
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status
    if (status >= 400 && status < 500) return false
  }
  return failureCount < 3
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:         2 * 60 * 1000,  // 2 minutes default
      gcTime:            10 * 60 * 1000, // 10 minutes garbage collection
      retry:             shouldRetry,
      refetchOnWindowFocus:    false,
      refetchOnReconnect:      true,
      refetchOnMount:          true,
    },
    mutations: {
      retry: 0,
      onError: (error: unknown) => {
        const message =
          error && typeof error === 'object' && 'message' in error
            ? String((error as { message: unknown }).message)
            : 'An unexpected error occurred.'
        toast.error(message)
      },
    },
  },
})

interface QueryProviderProps {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export { queryClient }
