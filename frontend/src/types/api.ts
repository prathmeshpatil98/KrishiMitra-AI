/**
 * KrishiMitra AI — API Response Types
 * =====================================
 * TypeScript interfaces that mirror the backend's standard API schemas.
 * Every API call must be typed against one of these — never use `any`.
 */

// ── Standard Success Response ────────────────────────────────────────────────
export interface APISuccessResponse<T> {
  success: true
  message: string
  data: T
  timestamp: string
  request_id: string
}

// ── Standard Error Response ──────────────────────────────────────────────────
export interface APIErrorResponse {
  success: false
  message: string
  error_code: string
  details: Record<string, unknown>
  timestamp: string
  request_id: string
}

// ── Pagination ───────────────────────────────────────────────────────────────
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}

export interface PaginatedResponse<T> {
  success: true
  message: string
  data: T[]
  pagination: PaginationMeta
  timestamp: string
  request_id: string
}

// ── Query Params ─────────────────────────────────────────────────────────────
export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface LocationParams {
  location: string
  latitude?: number
  longitude?: number
}

// ── Error Codes (mirrors backend) ────────────────────────────────────────────
export type APIErrorCode =
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'INVALID_CREDENTIALS'
  | 'MISSING_TOKEN'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'MARKET_API_TIMEOUT'
  | 'WEATHER_API_TIMEOUT'
  | 'TRANSPORT_ERROR'
  | 'LANGGRAPH_ERROR'
  | 'AGENT_TIMEOUT'
  | 'DATABASE_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR'
  | string
