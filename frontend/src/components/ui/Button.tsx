/**
 * KrishiMitra AI — Reusable Premium Button Component
 * ==================================================
 * Purpose: A highly flexible, accessible button with variant, size, loading, and scale animation support.
 * Responsibilities: Render a standard or animated action button that fits the design system tokens.
 * Dependencies: clsx, tailwind-merge, framer-motion, Spinner
 * Usage: <Button variant="primary" size="md" loading={loading} onClick={...}>Submit</Button>
 */

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Spinner } from './Spinner'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      whileHover,
      whileTap,
      ...props
    },
    ref
  ) => {
    // ── Base Styles ──────────────────────────────────────────────────────────
    const baseStyle =
      'inline-flex items-center justify-center font-medium rounded-btn transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]'

    // ── Variants ─────────────────────────────────────────────────────────────
    const variants = {
      primary:
        'bg-brand-primary text-white hover:bg-brand-primary-hover focus-visible:outline-brand-primary shadow-glow-primary/20 hover:shadow-glow-primary/30',
      secondary:
        'bg-brand-secondary text-brand-primary hover:bg-brand-secondary/80 focus-visible:outline-brand-secondary',
      outline:
        'border border-border dark:border-border-dark text-text-primary dark:text-white hover:bg-surface/5 dark:hover:bg-surface-dark/5 focus-visible:outline-border',
      ghost:
        'text-text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-text-muted',
      danger:
        'bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger shadow-sm',
      success:
        'bg-success text-white hover:bg-success/90 focus-visible:outline-success shadow-sm',
    }

    // ── Sizes ────────────────────────────────────────────────────────────────
    const sizes = {
      sm: 'px-3 py-1.5 text-small gap-1.5 h-9',
      md: 'px-4 py-2.5 text-body gap-2 h-11',
      lg: 'px-6 py-3.5 text-h4 gap-2.5 h-14',
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileHover={disabled || loading ? undefined : whileHover ?? { scale: 1.01 }}
        whileTap={disabled || loading ? undefined : whileTap ?? { scale: 0.98 }}
        className={twMerge(
          clsx(
            baseStyle,
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
          )
        )}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <Spinner
            size={size === 'lg' ? 'md' : 'sm'}
            variant={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'primary'}
            className="shrink-0 animate-spin"
          />
        )}

        {/* Left Icon (only if not loading) */}
        {!loading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}

        {/* Button Content */}
        <span className="truncate">{children}</span>

        {/* Right Icon */}
        {!loading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
