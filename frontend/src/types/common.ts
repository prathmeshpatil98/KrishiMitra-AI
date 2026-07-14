/**
 * KrishiMitra AI — Common Shared Types
 * ======================================
 * Generic utility types shared across the entire frontend.
 */

// ── Theme ────────────────────────────────────────────────────────────────────
export type Theme = 'light' | 'dark' | 'system'

// ── Language ─────────────────────────────────────────────────────────────────
export type Language = 'en' | 'hi' | 'mr'

// ── Loading State ─────────────────────────────────────────────────────────────
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// ── Select Option ─────────────────────────────────────────────────────────────
export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

// ── Component Size ────────────────────────────────────────────────────────────
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// ── Component Variant ─────────────────────────────────────────────────────────
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'

// ── Status ────────────────────────────────────────────────────────────────────
export type StatusColor = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

// ── Coordinates ──────────────────────────────────────────────────────────────
export interface Coordinates {
  latitude: number
  longitude: number
}

// ── Date Range ───────────────────────────────────────────────────────────────
export interface DateRange {
  from: string
  to: string
}

// ── Navigation Item ───────────────────────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: number
  roles?: import('./auth').UserRole[]
  children?: NavItem[]
}
