/**
 * KrishiMitra AI — Premium Sticky Header Navbar
 * ============================================
 * Purpose: Provide context header controls (mobile drawer menu, search, notification tray, theme switcher).
 * Responsibilities: Render responsive toggle buttons, page breadcrumb title, user avatar, and light/dark theme switch.
 * Dependencies: lucide-react, useTheme, useAuth, react-router-dom, Avatar
 */

import { useLocation } from 'react-router-dom'
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'
import { ROUTES } from '@/constants/routes'

interface NavbarProps {
  sidebarWidth: number
  onMobileMenuOpen: () => void
}

export function Navbar({ onMobileMenuOpen }: NavbarProps) {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()

  // Derive page heading title from route path
  const getPageTitle = (path: string) => {
    if (path.startsWith(ROUTES.DASHBOARD)) return 'Dashboard'
    if (path.startsWith(ROUTES.AI_ASSISTANT)) return 'AI Farming Assistant'
    if (path.startsWith(ROUTES.MARKET.ROOT)) return 'Market Price Insights'
    if (path.startsWith(ROUTES.WEATHER.ROOT)) return 'Weather Forecast'
    if (path.startsWith(ROUTES.TRANSPORT.ROOT)) return 'Logistics Estimator'
    if (path.startsWith(ROUTES.RECOMMENDATION.ROOT)) return 'Farming Recommendations'
    if (path.startsWith(ROUTES.GOVERNMENT.ROOT)) return 'Government Schemes'
    if (path.startsWith(ROUTES.SETTINGS.ROOT)) return 'Settings'
    return 'KrishiMitra AI'
  }

  return (
    <header className="sticky top-0 z-30 h-[72px] flex items-center justify-between px-6 bg-surface/85 dark:bg-surface-dark/85 backdrop-blur-nav border-b border-border dark:border-border-dark transition-colors duration-300">
      {/* ── Left Actions ───────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Mobile Toggle Drawer Menu */}
        <button
          onClick={onMobileMenuOpen}
          className="flex lg:hidden h-10 w-10 items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary dark:text-text-muted transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>

        {/* Dynamic Title / Route Breadcrumb */}
        <h2 className="text-h4 font-bold text-text-primary dark:text-white select-none">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      {/* ── Central Mock Search Bar (desktop only) ─────────── */}
      <div className="hidden md:flex items-center w-80 relative">
        <Search size={16} className="absolute left-3.5 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search price trends, schemes, crops..."
          className="w-full h-10 pl-10 pr-4 text-small rounded-input bg-background dark:bg-background-dark/50 border border-border dark:border-border-dark placeholder:text-text-muted text-text-primary dark:text-white focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary transition-all"
        />
      </div>

      {/* ── Right Actions ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary dark:text-text-muted transition-all"
          aria-label="Toggle theme mode"
        >
          {isDark ? <Sun size={20} className="text-brand-accent animate-pulse-glow" /> : <Moon size={20} />}
        </button>

        {/* Notifications Icon Tray */}
        <div className="relative">
          <button
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary dark:text-text-muted transition-colors"
            aria-label="View notifications"
          >
            <Bell size={20} />
          </button>
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-accent border border-surface dark:border-surface-dark block" />
        </div>

        {/* User Mini Avatar Menu */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-border dark:border-border-dark select-none">
            <Avatar
              name={user.farmer_profile?.full_name ?? user.email}
              size="sm"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-caption font-bold text-text-primary dark:text-white leading-none">
                {user.farmer_profile?.full_name ?? user.email.split('@')[0]}
              </span>
              <span className="text-[10px] text-text-secondary dark:text-text-muted mt-0.5 leading-none">
                {user.farmer_profile?.district ?? 'Farmer'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
