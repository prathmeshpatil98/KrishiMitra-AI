/**
 * KrishiMitra AI — Accessible Animated Tooltip Component
 * ========================================================
 * Purpose: Provide a premium, accessible hovering tooltip for helper info or icon descriptors.
 * Responsibilities: Render tooltip bubble, handle positioning, trigger animation on hover.
 * Dependencies: clsx, tailwind-merge, framer-motion
 * Usage:
 *   <Tooltip content="Collapse sidebar" position="right">
 *     <Button>...</Button>
 *   </Tooltip>
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface TooltipProps {
  content: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  children: React.ReactElement
  className?: string
}

export const Tooltip = ({
  content,
  position = 'top',
  children,
  className,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const showTooltip = () => setIsVisible(true)
  const hideTooltip = () => setIsVisible(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      x: position === 'left' ? 4 : position === 'right' ? -4 : '-50%',
      y: position === 'top' ? 4 : position === 'bottom' ? -4 : '-50%',
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: position === 'left' ? 0 : position === 'right' ? 0 : '-50%',
      y: position === 'top' ? 0 : position === 'bottom' ? 0 : '-50%',
      transition: { duration: 0.15, ease: 'easeOut' as const },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1, ease: 'easeIn' as const },
    },
  }

  // Clone child element to inject event handlers & accessibility attributes
  const trigger = React.cloneElement(children as React.ReactElement<any>, {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    'aria-label': typeof content === 'string' ? content : undefined,
  })

  return (
    <div className="relative inline-block">
      {trigger}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animationVariants}
            style={{ originX: 0.5, originY: 0.5 }}
            className={twMerge(
              clsx(
                'absolute z-50 px-3 py-1.5 text-caption font-semibold text-white bg-sidebar dark:bg-surface-raised rounded shadow-md pointer-events-none whitespace-nowrap border border-border/10 dark:border-border-dark',
                positionClasses[position],
                className
              )
            )}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
