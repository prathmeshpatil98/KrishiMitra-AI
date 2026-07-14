/**
 * KrishiMitra AI — Collapsible Sidebar Item
 * ==========================================
 * Purpose: Render a single item inside the sidebar list.
 * Responsibilities: Route matching, active state visual styling, tooltip support on collapse.
 * Dependencies: react-router-dom, framer-motion, lucide-react, Tooltip
 * Usage:
 *   <SidebarItem
 *     label="Dashboard"
 *     href={ROUTES.DASHBOARD}
 *     icon={LayoutDashboard}
 *     isCollapsed={isCollapsed}
 *   />
 */

import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Tooltip } from '@/components/ui/Tooltip'

interface SidebarItemProps {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: number
  isCollapsed: boolean
  onClick?: () => void
}

export function SidebarItem({
  label,
  href,
  icon: Icon,
  badge,
  isCollapsed,
  onClick,
}: SidebarItemProps) {
  const location = useLocation()

  // Match root paths exactly, subpaths as prefix
  const isActive =
    href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(href)

  const content = (
    <Link
      to={href}
      onClick={onClick}
      className={twMerge(
        clsx(
          'relative flex items-center w-full rounded-btn font-medium transition-all select-none focus-visible:outline-2 focus-visible:outline-brand-secondary h-11',
          isCollapsed ? 'justify-center px-0' : 'px-4 gap-3',
          isActive
            ? 'bg-brand-primary/20 text-brand-secondary'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        )
      )}
    >
      {/* Active Left Indicator Dot (only if collapsed) */}
      {isActive && isCollapsed && (
        <motion.div
          layoutId="activeIndicatorCollapsed"
          className="absolute left-0 w-1 h-6 rounded-r bg-brand-primary"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}

      {/* Icon */}
      <span className={clsx('shrink-0 transition-transform duration-200', isActive && 'scale-105')}>
        <Icon size={20} className={isActive ? 'text-brand-secondary' : 'text-gray-400'} />
      </span>

      {/* Label (hidden if collapsed) */}
      {!isCollapsed && (
        <span className="truncate text-small flex-1">{label}</span>
      )}

      {/* Badge Indicator */}
      {badge !== undefined && badge > 0 && (
        <span
          className={clsx(
            'flex items-center justify-center font-bold text-[10px] rounded-full shrink-0',
            isCollapsed
              ? 'absolute -top-1 -right-1 bg-brand-accent text-sidebar px-1 h-4 min-w-4 scale-90 border border-sidebar'
              : 'bg-brand-accent text-sidebar px-1.5 h-5 min-w-5'
          )}
        >
          {badge}
        </span>
      )}
    </Link>
  )

  // Wrap in a Tooltip if the sidebar is collapsed
  if (isCollapsed) {
    return (
      <Tooltip content={label} position="right">
        {content}
      </Tooltip>
    )
  }

  return content
}

export default SidebarItem
