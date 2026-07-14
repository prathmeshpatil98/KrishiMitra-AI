/**
 * KrishiMitra AI — Auth Layout
 * ==============================
 * Centered split-screen layout for authentication pages.
 * Left panel: branding, value proposition illustration.
 * Right panel: form content (Outlet).
 */

import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sprout,
  TrendingUp,
  CloudSun,
  Banknote,
} from 'lucide-react'

const FEATURES = [
  { icon: TrendingUp, text: 'Real-time market price analysis' },
  { icon: CloudSun,   text: 'AI-powered weather forecasting' },
  { icon: Banknote,   text: 'Government scheme recommendations' },
  { icon: Sprout,     text: 'Maximize your farming profit' },
]

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* ── Left Branding Panel ────────────────────────────── */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1F2937 0%, #2E7D32 100%)' }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-brand-primary/20" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary shadow-glow-primary">
            <Sprout className="text-white" size={24} />
          </div>
          <div>
            <div className="text-lg font-bold text-white leading-none">KrishiMitra AI</div>
            <div className="text-xs text-green-300 mt-0.5">Farming Intelligence Platform</div>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Empower Your<br />
            <span className="text-brand-secondary">Farming Decisions</span>
          </h1>
          <p className="text-green-200 text-lg mb-10 leading-relaxed">
            AI-powered insights that help you maximize profit by analyzing
            real-time market prices, weather, and government schemes.
          </p>

          {/* Feature list */}
          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                className="flex items-center gap-3 text-green-100"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} className="text-brand-secondary" />
                </div>
                <span className="text-sm">{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-green-400 text-xs">
          © 2025 KrishiMitra AI. Built for Indian Farmers.
        </div>
      </motion.div>

      {/* ── Right Form Panel ────────────────────────────────── */}
      <motion.div
        className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 bg-background dark:bg-background-dark"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      >
        {/* Mobile logo */}
        <div className="mb-8 flex lg:hidden items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary">
            <Sprout className="text-white" size={20} />
          </div>
          <span className="text-lg font-bold text-text-primary dark:text-white">
            KrishiMitra AI
          </span>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </motion.div>
    </div>
  )
}
