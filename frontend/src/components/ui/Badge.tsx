/**
 * KrishiMitra AI — Status Badge Component
 * =======================================
 * Purpose: Display status tags/labels (success, warning, info, danger, neutral).
 * Responsibilities: Render a clean inline badge matching design tokens.
 * Dependencies: clsx, tailwind-merge
 * Usage: <Badge variant="success">Active</Badge>
 */

import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  pill?: boolean
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, variant = 'neutral', pill = false, ...props }, ref) => {
    const baseStyle =
      'inline-flex items-center justify-center font-semibold text-caption px-2 py-0.5 select-none'

    const variants = {
      success:
        'bg-success/10 text-success dark:bg-success/20 border border-success/20 dark:border-success/30',
      warning:
        'bg-warning/10 text-warning dark:bg-warning/20 border border-warning/20 dark:border-warning/30',
      danger:
        'bg-danger/10 text-danger dark:bg-danger/20 border border-danger/20 dark:border-danger/30',
      info:
        'bg-info/10 text-info dark:bg-info/20 border border-info/20 dark:border-info/30',
      neutral:
        'bg-black/5 text-text-secondary dark:bg-white/5 dark:text-text-muted border border-border dark:border-border-dark',
    }

    return (
      <span
        ref={ref}
        className={twMerge(
          clsx(
            baseStyle,
            variants[variant],
            pill ? 'rounded-full' : 'rounded-badge',
            className
          )
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
export default Badge
