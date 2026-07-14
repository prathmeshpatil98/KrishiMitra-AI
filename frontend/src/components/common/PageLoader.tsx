/**
 * KrishiMitra AI — Premium Full-Screen Page Loader
 * ===============================================
 * Purpose: Display during initial app boot or lazy route loading.
 * Responsibilities: Show animated branding and smooth progress transition.
 * Dependencies: framer-motion, lucide-react
 * Usage: <PageLoader />
 */

import { motion } from 'framer-motion'
import { Sprout } from 'lucide-react'

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background dark:bg-background-dark transition-colors duration-300">
      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Sprout Container */}
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-glow-primary"
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sprout size={32} />
        </motion.div>

        {/* Text Loader */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-body font-bold text-text-primary dark:text-white"
          >
            KrishiMitra AI
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-caption text-text-secondary dark:text-text-muted mt-1 select-none"
          >
            Sowing digital intelligence...
          </motion.div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-32 h-1 bg-border dark:bg-border-dark rounded-full overflow-hidden mt-2 relative">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-brand-primary rounded-full"
            initial={{ left: '-100%', right: '100%' }}
            animate={{ left: '100%', right: '-100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default PageLoader
