/**
 * KrishiMitra AI — Premium Command Search Modal
 * ============================================
 * Purpose: Provide a keyboard-accessible search-first overlay.
 * Responsibilities: Bind Ctrl/Cmd+K, filter navigation paths, display intelligent suggestions.
 * Dependencies: framer-motion, lucide-react, react-router-dom
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sprout, CloudSun, Store, FileText, Landmark, Settings, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/constants/routes'

interface SuggestionItem {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  category: string
  path: string
}

interface CommandSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandSearchModal({ isOpen, onClose }: CommandSearchModalProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestions: SuggestionItem[] = [
    { icon: Sprout, label: 'Crop growth journey timeline', category: 'Crops', path: ROUTES.DASHBOARD },
    { icon: Store, label: 'Compare nearby APMC market prices', category: 'Markets', path: ROUTES.MARKET.ROOT },
    { icon: CloudSun, label: 'Check 3-day weather forecast risk', category: 'Weather', path: ROUTES.WEATHER.ROOT },
    { icon: Sprout, label: 'Get AI consensus recommendation feed', category: 'Advisor', path: ROUTES.RECOMMENDATION.ROOT },
    { icon: FileText, label: 'Examine active government subsidies', category: 'Subsidies', path: ROUTES.GOVERNMENT.ROOT },
    { icon: Landmark, label: 'Check Aadhaar KYC profile verification', category: 'Account', path: ROUTES.SETTINGS.ROOT },
    { icon: Settings, label: 'System preferences & language configurations', category: 'Preferences', path: ROUTES.SETTINGS.ROOT },
  ]

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else onClose() // Toggle handled by parent
      }
    };
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const filtered = suggestions.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (path: string) => {
    navigate(path)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % filtered.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].path)
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-[15%] left-[50%] -translate-x-[50%] w-full max-w-lg bg-surface dark:bg-zinc-900 border border-border dark:border-border-dark rounded-dialog shadow-float z-50 overflow-hidden"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 border-b border-border dark:border-border-dark py-3.5 gap-3">
              <Search size={20} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a farming action or path (e.g. Weather, Market)..."
                className="w-full text-body bg-transparent text-text-primary dark:text-white placeholder:text-text-muted focus:outline-none"
              />
              <span className="text-[10px] font-bold text-text-muted px-2 py-1 bg-background dark:bg-zinc-800 rounded border border-border dark:border-border-dark shrink-0">
                ESC
              </span>
            </div>

            {/* Recommendations / Suggestions List */}
            <div className="max-h-[320px] overflow-y-auto p-2 flex flex-col gap-1">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => {
                  const Icon = item.icon
                  const active = idx === selectedIndex
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleSelect(item.path)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left text-small transition-all ${
                        active
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'hover:bg-background dark:hover:bg-zinc-800 text-text-secondary dark:text-text-muted'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-white' : 'text-brand-primary dark:text-brand-secondary'} />
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-background-primary dark:bg-zinc-800 text-text-secondary dark:text-text-muted'
                        }`}
                      >
                        {item.category}
                      </span>
                      {active && <ArrowRight size={14} className="shrink-0 text-white" />}
                    </button>
                  )
                })
              ) : (
                <div className="p-8 text-center text-small text-text-muted">
                  No matching suggestions found. Try typing "Weather" or "Mandi".
                </div>
              )}
            </div>

            {/* Bottom Help Tips */}
            <div className="bg-background/50 dark:bg-zinc-900/50 border-t border-border dark:border-border-dark px-4 py-2.5 flex items-center justify-between text-[11px] text-text-muted select-none">
              <span>Use ↑↓ arrows to navigate, Enter to select</span>
              <span>Cmd/Ctrl + K to toggle</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
