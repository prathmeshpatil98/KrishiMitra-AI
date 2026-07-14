/**
 * KrishiMitra AI — Dashboard Layout
 * ====================================
 * Main authenticated application shell.
 * Renders: Sidebar (collapsible) + Navbar (sticky top) + main content area.
 * Sidebar collapse state is persisted in localStorage.
 */

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/navigation/Sidebar'
import { Navbar }  from '@/components/navigation/Navbar'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { CACHE_KEYS } from '@/constants/config'

const SIDEBAR_WIDTH     = 280
const SIDEBAR_COLLAPSED = 72

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>(
    CACHE_KEYS.SIDEBAR_COLLAPSED,
    false,
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-background-dark">
      {/* ── Mobile Overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ────────────────────────────────────────── */}
      <Sidebar
        isCollapsed={isCollapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setIsCollapsed(!isCollapsed)}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main Area ──────────────────────────────────────── */}
      <motion.div
        className="flex flex-1 flex-col overflow-hidden"
        animate={{ marginLeft: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ minWidth: 0 }}
      >
        {/* Navbar */}
        <Navbar
          sidebarWidth={sidebarWidth}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        {/* Page Content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingTop: '0' }}
        >
          <motion.div
            key="page-content"
            className="min-h-full p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </motion.div>
    </div>
  )
}
