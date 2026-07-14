/**
 * KrishiMitra AI — Premium Card Component
 * =======================================
 * Purpose: Provide a consistent container with elegant shadows, hover effects, and slots.
 * Responsibilities: Render card headers, footers, body, and support interactive/hover states.
 * Dependencies: clsx, tailwind-merge, framer-motion
 * Usage:
 *   <Card hoverable>
 *     <Card.Header>Title</Card.Header>
 *     <Card.Body>Content</Card.Body>
 *   </Card>
 */

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  hoverable?: boolean
  variant?: 'default' | 'raised' | 'outlined' | 'glass'
}

export const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hoverable = false, variant = 'default', ...props }, ref) => {
    const baseStyle =
      'rounded-card transition-all overflow-hidden flex flex-col'

    const variants = {
      default: 'bg-surface dark:bg-surface-dark border border-border dark:border-border-dark shadow-card',
      raised: 'bg-surface dark:bg-surface-dark shadow-float border border-border/50 dark:border-border-dark/50',
      outlined: 'bg-transparent border border-border dark:border-border-dark',
      glass: 'glass shadow-card',
    }

    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -4, boxShadow: 'var(--shadow-card-hover)' } : undefined}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={twMerge(
          clsx(
            baseStyle,
            variants[variant],
            hoverable && 'cursor-pointer',
            className
          )
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

CardRoot.displayName = 'Card'

// ── Header Sub-component ─────────────────────────────────────────────────────
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode
}

const CardHeader = ({ children, className, action, ...props }: CardHeaderProps) => {
  return (
    <div
      className={twMerge(
        'px-6 py-4 border-b border-border dark:border-border-dark flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

CardHeader.displayName = 'Card.Header'

// ── Body Sub-component ───────────────────────────────────────────────────────
const CardBody = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={twMerge('p-6 flex-1', className)} {...props}>
      {children}
    </div>
  )
}

CardBody.displayName = 'Card.Body'

// ── Footer Sub-component ─────────────────────────────────────────────────────
const CardFooter = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={twMerge(
        'px-6 py-4 border-t border-border dark:border-border-dark bg-background/30 dark:bg-background-dark/30 flex items-center gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

CardFooter.displayName = 'Card.Footer'

// Combine subcomponents
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})
