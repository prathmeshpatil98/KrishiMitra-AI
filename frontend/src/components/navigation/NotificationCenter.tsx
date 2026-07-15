/**
 * KrishiMitra AI — Premium Notification Center
 * ============================================
 * Purpose: slide-over drawer showing alert matrices and notifications.
 * Responsibilities: Render categorized alerts (price, weather, system alerts) with status badges and clear operations.
 * Dependencies: framer-motion, lucide-react
 */

import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, TrendingUp, AlertTriangle, Info, Calendar } from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'price' | 'weather' | 'scheme' | 'system'
  severity: 'info' | 'success' | 'warning' | 'danger'
  time: string
  read: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Sugarcane Rate Active Increase',
      message: 'Sugarcane pricing in Kolhapur APMC yard rose by ₹120.00/Quintal (+4%) due to sugar mill demand.',
      type: 'price',
      severity: 'success',
      time: '15 mins ago',
      read: false
    },
    {
      id: '2',
      title: 'Monsoon Transit Advisory',
      message: 'Rain showers predicted over Sangli route next Wednesday. Remember to cover loaded transit trucks with waterproof tarps.',
      type: 'weather',
      severity: 'warning',
      time: '2 hours ago',
      read: false
    },
    {
      id: '3',
      title: 'SMAM Subsidies Deadline',
      message: 'Equipment mechanical subsidy applications for tractor purchases close on August 31, 2026.',
      type: 'scheme',
      severity: 'info',
      time: '1 day ago',
      read: true
    },
    {
      id: '4',
      title: 'Aadhaar KYC Certified',
      message: 'Your farmer identity verification process has been verified successfully. PM-Kisan payouts linked.',
      type: 'system',
      severity: 'success',
      time: '2 days ago',
      read: true
    }
  ]

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'warning':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      case 'danger':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    }
  }

  const getIcon = (type: string, _severity: string) => {
    if (type === 'price') return <TrendingUp size={16} />
    if (type === 'weather') return <AlertTriangle size={16} />
    if (type === 'scheme') return <Calendar size={16} />
    return <Info size={16} />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface dark:bg-zinc-900 border-l border-border dark:border-border-dark shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border dark:border-border-dark">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary dark:text-white text-body">
                    Alert Center
                  </h3>
                  <p className="text-[10px] text-text-secondary dark:text-text-muted mt-0.5">
                    Live advisor warnings and price notifications
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-background dark:hover:bg-zinc-800 text-text-secondary dark:text-text-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {notifications.map((n) => {
                return (
                  <div
                    key={n.id}
                    className={`p-4 rounded-xl border border-border/50 dark:border-border-dark/50 hover:border-brand-primary/20 dark:hover:border-brand-primary/20 transition-all flex flex-col gap-2 relative group overflow-hidden ${
                      n.read ? 'bg-surface dark:bg-zinc-900/50' : 'bg-background-primary/30 dark:bg-zinc-950/20'
                    }`}
                  >
                    {!n.read && (
                      <span className="absolute top-3.5 right-3.5 h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                    )}
                    <div className="flex items-center gap-2">
                      <div className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 ${getSeverityStyles(n.severity)}`}>
                        {getIcon(n.type, n.severity)}
                      </div>
                      <span className="font-bold text-text-primary dark:text-white text-small pr-4">
                        {n.title}
                      </span>
                    </div>
                    <p className="text-caption text-text-secondary dark:text-text-muted leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-text-muted mt-1 font-medium">{n.time}</span>
                  </div>
                )
              })}
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-background/50 dark:bg-zinc-900/50 border-t border-border dark:border-border-dark flex justify-between items-center text-caption text-text-muted select-none">
              <span>2 unread alerts</span>
              <button className="font-bold text-brand-primary hover:text-brand-primary-hover hover:underline transition-colors">
                Mark all read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationCenter
