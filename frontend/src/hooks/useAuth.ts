/**
 * KrishiMitra AI — useAuth Hook
 * ================================
 * Convenience hook for consuming the AuthContext.
 * Always use this hook in components — never useAuthContext directly.
 */

import { useAuthContext } from '@/app/providers/AuthProvider'
import type { User }      from '@/types/auth'

export interface UseAuthReturn {
  user:            User | null
  isAuthenticated: boolean
  isLoading:       boolean
  isFarmer:        boolean
  isAdmin:         boolean
  isGovernmentOfficer: boolean
  login:           ReturnType<typeof useAuthContext>['login']
  logout:          ReturnType<typeof useAuthContext>['logout']
  refreshToken:    ReturnType<typeof useAuthContext>['refreshToken']
}

export function useAuth(): UseAuthReturn {
  const auth = useAuthContext()

  return {
    user:            auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading:       auth.isLoading,
    isFarmer:        auth.user?.role === 'farmer',
    isAdmin:         auth.user?.role === 'admin',
    isGovernmentOfficer: auth.user?.role === 'government_officer',
    login:           auth.login,
    logout:          auth.logout,
    refreshToken:    auth.refreshToken,
  }
}
