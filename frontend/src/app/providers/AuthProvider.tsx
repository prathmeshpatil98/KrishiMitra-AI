/**
 * KrishiMitra AI — Authentication Provider
 * ==========================================
 * Manages authentication state across the entire application.
 * - Reads persisted tokens from sessionStorage on mount
 * - Exposes login / logout / refreshToken actions
 * - Invalidates TanStack Query cache on logout
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type { AuthState, AuthTokens, LoginRequest, User } from '@/types/auth'
import { CACHE_KEYS } from '@/constants/config'
import { authEndpoints } from '@/services/api/endpoints'
import { queryClient } from '@/app/providers/QueryProvider'

// ── Context ───────────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  login:        (credentials: LoginRequest) => Promise<void>
  logout:       () => Promise<void>
  refreshToken: () => Promise<boolean>
  setUser:      (user: User) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within <AuthProvider>')
  return ctx
}

// ── Provider ──────────────────────────────────────────────────────────────────
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user,    setUser]    = useState<User | null>(null)
  const [tokens,  setTokens]  = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem(CACHE_KEYS.ACCESS_TOKEN)
    const storedUser  = sessionStorage.getItem(CACHE_KEYS.USER)
    const storedRefresh = sessionStorage.getItem(CACHE_KEYS.REFRESH_TOKEN)

    if (storedToken && storedUser && storedRefresh) {
      try {
        setUser(JSON.parse(storedUser) as User)
        setTokens({
          access_token:  storedToken,
          refresh_token: storedRefresh,
          expires_in:    3600,
        })
      } catch {
        // Corrupted storage — clear it
        sessionStorage.clear()
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await authEndpoints.login(credentials)
      const { access_token, refresh_token, expires_in } = response.data.data

      const meResponse = await authEndpoints.getMe(access_token)
      const userProfile = meResponse.data.data

      setTokens({ access_token, refresh_token, expires_in })
      setUser(userProfile)

      sessionStorage.setItem(CACHE_KEYS.ACCESS_TOKEN,  access_token)
      sessionStorage.setItem(CACHE_KEYS.REFRESH_TOKEN, refresh_token)
      sessionStorage.setItem(CACHE_KEYS.USER, JSON.stringify(userProfile))

      toast.success(`Welcome back, ${userProfile.farmer_profile?.full_name ?? userProfile.email}!`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    try {
      if (tokens?.access_token) {
        await authEndpoints.logout(tokens.access_token)
      }
    } catch {
      // Logout best-effort — clear state regardless
    } finally {
      setUser(null)
      setTokens(null)
      sessionStorage.clear()
      queryClient.clear()
    }
  }, [tokens])

  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!tokens?.refresh_token) return false
    try {
      const response = await authEndpoints.refresh(tokens.refresh_token)
      const { access_token } = response.data.data
      setTokens(prev => prev ? { ...prev, access_token } : null)
      sessionStorage.setItem(CACHE_KEYS.ACCESS_TOKEN, access_token)
      return true
    } catch {
      await logout()
      return false
    }
  }, [tokens, logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user && !!tokens,
        isLoading,
        login,
        logout,
        refreshToken,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
