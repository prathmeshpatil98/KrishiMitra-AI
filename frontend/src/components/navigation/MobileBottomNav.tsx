/**
 * KrishiMitra AI — Mobile Bottom Navigation
 * ==========================================
 * Purpose: Render a bottom sticky menu bar for mobile viewports.
 * Responsibilities: Display primary routes, slide up popover sheet for secondary pages, active state animations.
 * Dependencies: react-router-dom, framer-motion, lucide-react
 */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  Store,
  CloudSun,
  MoreHorizontal,
  Truck,
  FileText,
  Settings,
  LogOut,
  X
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function MobileBottomNav() {
  const location = useLocation()
  const { logout } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)

  const primaryItems = [
    { label: 'Home', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { label: 'Chat', href: ROUTES.AI_ASSISTANT, icon: MessageSquare },
    { label: 'Markets', href: ROUTES.MARKET.ROOT, icon: Store },
    { label: 'Weather', href: ROUTES.WEATHER.ROOT, icon: CloudSun },
  ]

  const moreItems = [
    { label: 'Transport Cost', href: ROUTES.TRANSPORT.ROOT, icon: Truck },
    { label: 'Govt Schemes', href: ROUTES.GOVERNMENT.ROOT, icon: FileText },
    { label: 'Preferences', href: ROUTES.SETTINGS.ROOT, icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden h-16 bg-surface/85 dark:bg-zinc-950/85 backdrop-blur-md border-t border-border dark:border-border-dark flex items-center justify-around px-2 pb-safe-bottom select-none">
        {primaryItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-center transition-colors relative ${
                active ? 'text-brand-primary dark:text-brand-secondary' : 'text-text-secondary dark:text-text-muted hover:text-text-primary'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="activeMobileDot"
                  className="absolute top-1.5 h-1 w-1 rounded-full bg-brand-primary dark:bg-brand-secondary"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={20} className={active ? 'scale-110 transition-transform' : ''} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          )
        })}

        {/* More Menu Toggle */}
        <button
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-center text-text-secondary dark:text-text-muted hover:text-text-primary ${moreOpen ? 'text-brand-primary dark:text-brand-secondary' : ''}`}
        >
          <MoreHorizontal size={20} />
          <span className="text-[10px] font-semibold">More</span>
        </button>
      </nav>

      {/* Slide up More Sheet */}
      <AnimatePresence>
        {moreOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-surface dark:bg-zinc-900 border-t border-border dark:border-border-dark rounded-t-dialog shadow-float p-4 lg:hidden max-h-[75vh] overflow-y-auto flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border dark:border-border-dark pb-3">
                <h3 className="font-bold text-text-primary dark:text-white text-body">
                  Farming Options
                </h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-background dark:hover:bg-zinc-800 text-text-secondary dark:text-text-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Grid of Options */}
              <div className="grid grid-cols-3 gap-3">
                {moreItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border/50 dark:border-border-dark/50 text-center transition-all ${
                        active
                          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary dark:text-brand-secondary font-semibold shadow-sm'
                          : 'bg-background/40 dark:bg-zinc-950/20 text-text-secondary dark:text-text-muted hover:bg-background dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Icon size={22} className={active ? 'text-brand-primary dark:text-brand-secondary' : 'text-text-muted'} />
                      <span className="text-[11px] leading-tight">{item.label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Logout Block */}
              <button
                onClick={() => {
                  setMoreOpen(false)
                  logout()
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-950/10 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl font-bold text-small hover:bg-red-500/10 dark:hover:bg-red-950/30 transition-all mt-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default MobileBottomNav
