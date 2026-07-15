/**
 * KrishiMitra AI — Premium Dashboard Layout
 * ==========================================
 * Main authenticated application shell.
 * IMPORTANT: <Outlet> is rendered FULL WIDTH — pages control their own max-width.
 * This allows cinematic hero sections and full-bleed layouts to work correctly.
 */

import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navigation/Navbar'
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav'
import { CommandSearchModal } from '@/components/navigation/CommandSearchModal'
import { NotificationCenter } from '@/components/navigation/NotificationCenter'
import { AICompanionWidget } from '@/components/navigation/AICompanionWidget'
import { ROUTES } from '@/constants/routes'

// Pages that need full-bleed layout (no padding/max-width constraints from layout)
const FULL_BLEED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.MARKET.ROOT,
  ROUTES.AI_ASSISTANT,
  ROUTES.WEATHER.ROOT,
  ROUTES.TRANSPORT.ROOT,
  ROUTES.RECOMMENDATION.ROOT,
  ROUTES.GOVERNMENT.ROOT,
  ROUTES.PROFILE.ROOT,
  ROUTES.SETTINGS.ROOT,
]

export function DashboardLayout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  const isFullBleed = FULL_BLEED_ROUTES.some(r =>
    location.pathname === r || location.pathname === '/'
  )

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex flex-col relative overflow-x-hidden">

      {/* Sticky Header Navigation — absolute on hero, sticky elsewhere */}
      <Navbar
        onSearchClick={() => setSearchOpen(true)}
        onNotificationsClick={() => setNotificationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${isFullBleed ? '' : 'pt-[88px]'} pb-24 lg:pb-8 flex flex-col`}>
        <motion.div
          key={location.pathname}
          className={`w-full flex flex-col ${isFullBleed ? '' : 'max-w-content mx-auto px-4 sm:px-6 gap-6'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile Bottom sticky bar */}
      <MobileBottomNav />

      {/* Keyboard-triggered Search overlay */}
      <CommandSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Alert Center slide-out */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Global AI companion quick-chat bubble */}
      <AICompanionWidget />
    </div>
  )
}

export default DashboardLayout
