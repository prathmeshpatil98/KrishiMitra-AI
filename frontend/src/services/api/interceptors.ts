/**
 * KrishiMitra AI — Axios Interceptors
 * =====================================
 * Request: Attach JWT Bearer token from sessionStorage.
 * Response: Normalise errors into typed APIErrorResponse shape.
 *           On 401 → attempt token refresh once → logout on failure.
 */

import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { apiClient } from './client'
import { CACHE_KEYS } from '@/constants/config'
import type { APIErrorResponse } from '@/types/api'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject:  (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

// ── Request Interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem(CACHE_KEYS.ACCESS_TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response Interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<APIErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status   = error.response?.status
    const errorData = error.response?.data

    // ── 401 Unauthorized → attempt token refresh ──────────────
    if (status === 401 && !originalRequest._retry) {
      const refreshToken = sessionStorage.getItem(CACHE_KEYS.REFRESH_TOKEN)

      if (!refreshToken) {
        sessionStorage.clear()
        window.location.href = '/auth/login'
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((newToken) => {
          originalRequest.headers!.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refresh_token: refreshToken },
        )
        const { access_token } = refreshResponse.data.data as { access_token: string }
        sessionStorage.setItem(CACHE_KEYS.ACCESS_TOKEN, access_token)
        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`
        processQueue(null, access_token)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        sessionStorage.clear()
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // ── 429 Rate Limited ─────────────────────────────────────
    if (status === 429) {
      toast.error('Too many requests. Please wait a moment and try again.')
    }

    // ── 5xx Server Errors ─────────────────────────────────────
    if (status && status >= 500) {
      toast.error('A server error occurred. Please try again later.')
    }

    // Normalise error message
    const message = errorData?.message ?? error.message ?? 'Request failed'
    const normalisedError = Object.assign(new Error(message), {
      status,
      error_code: errorData?.error_code,
      details:    errorData?.details,
    })

    return Promise.reject(normalisedError)
  },
)
