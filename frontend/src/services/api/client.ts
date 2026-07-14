/**
 * KrishiMitra AI — Axios HTTP Client
 * =====================================
 * Configured Axios instance for all backend API calls.
 * Base URL reads from VITE_API_BASE_URL environment variable.
 * Interceptors are attached in interceptors.ts.
 */

import axios from 'axios'
import { REQUEST_TIMEOUT_MS } from '@/constants/config'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export const apiClient = axios.create({
  baseURL:        API_BASE_URL,
  timeout:        REQUEST_TIMEOUT_MS,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-Client':     'KrishiMitra-Web/1.0',
  },
})

export default apiClient
