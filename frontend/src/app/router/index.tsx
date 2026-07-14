/**
 * KrishiMitra AI — Application Router
 * =====================================
 * Creates the full application routing tree using React Router v7.
 * - All feature pages are lazy-loaded for code splitting
 * - Protected routes redirect unauthenticated users to login
 * - Auth routes redirect authenticated users to dashboard
 */

import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  type RouteObject,
} from 'react-router-dom'

import { DashboardLayout } from '@/app/layouts/DashboardLayout'
import { AuthLayout }      from '@/app/layouts/AuthLayout'
import { PageLoader }      from '@/components/common/PageLoader'
import { ROUTES }          from '@/constants/routes'
import { useAuthContext }  from '@/app/providers/AuthProvider'

// ── Lazy Page Imports ─────────────────────────────────────────────────────────
// These will be implemented in Phase 2 of the project.
// The Suspense + PageLoader handles the loading state for all pages.

const LazyDashboard       = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const LazyAssistant       = lazy(() => import('@/pages/Assistant').then(m => ({ default: m.Assistant })))
const LazyLogin           = lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.Login })))
const LazyNotFound        = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))

// ── Route Guards ─────────────────────────────────────────────────────────────

function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthContext()
  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  return <Outlet />
}

function RequireGuest() {
  const { isAuthenticated, isLoading } = useAuthContext()
  if (isLoading) return <PageLoader />
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ── Route Tree ────────────────────────────────────────────────────────────────
const routes: RouteObject[] = [
  // ── Auth routes (unauthenticated only) ─────────────────────
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.AUTH.LOGIN,
            element: <SuspenseWrapper><LazyLogin /></SuspenseWrapper>,
          },
        ],
      },
    ],
  },

  // ── Protected routes (authenticated only) ──────────────────
  {
    element: <RequireAuth />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          // Default: redirect / to /dashboard
          {
            index: true,
            path:  ROUTES.HOME,
            element: <Navigate to={ROUTES.DASHBOARD} replace />,
          },

          // Dashboard
          {
            path: ROUTES.DASHBOARD,
            element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper>,
          },

          // Feature pages — slots for Phase 2 implementation
          { path: ROUTES.AI_ASSISTANT,       element: <SuspenseWrapper><LazyAssistant /></SuspenseWrapper> },
          { path: ROUTES.MARKET.ROOT,        element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper> },
          { path: ROUTES.WEATHER.ROOT,       element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper> },
          { path: ROUTES.TRANSPORT.ROOT,     element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper> },
          { path: ROUTES.RECOMMENDATION.ROOT,element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper> },
          { path: ROUTES.GOVERNMENT.ROOT,    element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper> },
          { path: ROUTES.PROFILE.ROOT,       element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper> },
          { path: ROUTES.SETTINGS.ROOT,      element: <SuspenseWrapper><LazyDashboard /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // ── Fallback ────────────────────────────────────────────────
  {
    path: '*',
    element: <SuspenseWrapper><LazyNotFound /></SuspenseWrapper>,
  },
]

export const router = createBrowserRouter(routes)
