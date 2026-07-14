/**
 * KrishiMitra AI — API Endpoint Functions
 * =========================================
 * Typed API call functions for the authentication domain.
 * Additional feature endpoint modules will follow the same pattern.
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '@/constants/api'
import type { APISuccessResponse } from '@/types/api'
import type { LoginRequest, LoginResponse, User } from '@/types/auth'

// ── Auth Endpoints ─────────────────────────────────────────────────────────────
export const authEndpoints = {
  login: (credentials: LoginRequest) =>
    apiClient.post<APISuccessResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    ),

  refresh: (refreshToken: string) =>
    apiClient.post<APISuccessResponse<{ access_token: string }>>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refresh_token: refreshToken },
    ),

  logout: (accessToken: string) =>
    apiClient.post<APISuccessResponse<null>>(
      API_ENDPOINTS.AUTH.LOGOUT,
      null,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    ),

  getMe: (accessToken: string) =>
    apiClient.get<APISuccessResponse<User>>(
      API_ENDPOINTS.AUTH.ME,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    ),
}

// ── Health Endpoint ────────────────────────────────────────────────────────────
export const healthEndpoints = {
  check: () =>
    apiClient.get<{
      status: string
      version: string
      environment: string
      components: Record<string, { status: string }>
    }>(API_ENDPOINTS.HEALTH),
}
