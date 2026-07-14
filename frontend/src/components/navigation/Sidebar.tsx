/**
 * KrishiMitra AI — Collapsible Responsive Sidebar
 * ===============================================
 * Purpose: Global navigation sidebar for the application shell.
 * Responsibilities: Layout list of NavItems, collapse/expand toggle, mobile overlay slide-in, user logout action.
 * Dependencies: react-router-dom, framer-motion, lucide-react, SidebarItem, useAuth
 */

import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  Store,
  CloudSun,
  Truck,
  FileText,
  BookmarkCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sprout,
  LogOut,
} from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

interface SidebarProps {
  isCollapsed: boolean
  mobileOpen: boolean
  onCollapse: () => void
  onMobileClose: () => void
}

export function Sidebar({
  isCollapsed,
  mobileOpen,
  onCollapse,
  onMobileClose,
}: SidebarProps) {
  const { user, logout } = useAuth()

  const navItems = [
    { label: 'Dashboard',         href: ROUTES.DASHBOARD,          icon: LayoutDashboard },
    { label: 'AI Assistant',      href: ROUTES.AI_ASSISTANT,       icon: MessageSquare },
    { label: 'Market Prices',     href: ROUTES.MARKET.ROOT,        icon: Store },
    { label: 'Weather Forecast',  href: ROUTES.WEATHER.ROOT,       icon: CloudSun },
    { label: 'Transport Cost',    href: ROUTES.TRANSPORT.ROOT,     icon: Truck },
    { label: 'Recommendations',  href: ROUTES.RECOMMENDATION.ROOT,icon: BookmarkCheck },
    { label: 'Govt Schemes',      href: ROUTES.GOVERNMENT.ROOT,    icon: FileText },
    { label: 'Settings',          href: ROUTES.SETTINGS.ROOT,      icon: Settings },
  ]

  const sidebarVariants = {
    open: {
      width: '280px',
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    collapsed: {
      width: '72px',
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  }

  const mobileVariants = {
    open: {
      x: 0,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
    },
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r border-border/10">
      {/* ── Brand Header ───────────────────────────────────── */}
      <div className="h-[72px] flex items-center justify-between px-4 border-b border-border/10">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white shadow-glow-primary">
            <Sprout size={20} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-white text-body leading-none truncate">KrishiMitra AI</span>
              <span className="text-[10px] text-green-300 font-medium select-none tracking-wider mt-0.5">PLATFORM</span>
            </div>
          )}
        </div>

        {/* Collapse Button (desktop only) */}
        {!isCollapsed && (
          <button
            onClick={onCollapse}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation Links ───────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isCollapsed={isCollapsed}
            onClick={onMobileClose}
          />
        ))}
      </nav>

      {/* ── Sidebar Footer ─────────────────────────────────── */}
      <div className="p-3 border-t border-border/10 flex flex-col gap-2.5">
        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-brand-secondary border border-brand-primary/20 font-bold text-small">
              {user.farmer_profile?.full_name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-small font-semibold text-white truncate leading-snug">
                  {user.farmer_profile?.full_name ?? user.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-gray-400 capitalize truncate">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Expand Trigger / Logout Button */}
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <button
              onClick={onCollapse}
              className="hidden lg:flex h-9 w-full items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={logout}
              className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-300 hover:text-red-200 border border-red-900/30 font-medium text-small transition-all"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:block shrink-0 h-full overflow-hidden"
        initial={isCollapsed ? 'collapsed' : 'open'}
        animate={isCollapsed ? 'collapsed' : 'open'}
        variants={sidebarVariants}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Drawer Sidebar */}
      <motion.aside
        className="fixed inset-y-0 left-0 z-50 lg:hidden w-[280px] h-full shadow-2xl"
        initial="closed"
        animate={mobileOpen ? 'open' : 'closed'}
        variants={mobileVariants}
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}

export default Sidebar
