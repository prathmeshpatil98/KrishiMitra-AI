/**
 * KrishiMitra AI — Authentication Types
 * =======================================
 * Typed models for authentication state, JWT tokens, and user profiles.
 * These mirror the backend User and authentication schemas.
 */

// ── Roles ────────────────────────────────────────────────────────────────────
export type UserRole = 'farmer' | 'admin' | 'government_officer'

// ── User Profile ─────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  phone?: string
  role: UserRole
  preferred_language: string
  is_verified: boolean
  is_active: boolean
  created_at: string
  farmer_profile?: FarmerProfile
}

export interface FarmerProfile {
  id: string
  full_name: string
  state: string
  district: string
  village?: string
  latitude?: number
  longitude?: number
  farm_size?: number
  soil_type?: string
  primary_crop?: string
  secondary_crop?: string
  preferred_market?: string
}

// ── Authentication State ─────────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}

// ── Request / Response Shapes ────────────────────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  preferred_language?: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}
