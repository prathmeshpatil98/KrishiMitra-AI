/**
 * KrishiMitra AI — Accessible Spinner Component
 * =============================================
 * Purpose: Provide a highly accessible, premium loading spinner with size and variant support.
 * Responsibilities: Render a clean SVG spinner that adapts to light/dark themes and supports screen readers.
 * Dependencies: clsx, tailwind-merge (via clean class composition)
 * Usage: <Spinner size="md" variant="primary" />
 */

import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'white' | 'muted'
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'primary', ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4 stroke-[3]',
      md: 'h-6 w-6 stroke-[2.5]',
      lg: 'h-8 w-8 stroke-[2]',
      xl: 'h-12 w-12 stroke-[2px]',
    }

    const variantClasses = {
      primary: 'text-brand-primary dark:text-brand-primary',
      secondary: 'text-brand-secondary',
      white: 'text-white',
      muted: 'text-text-muted',
    }

    return (
      <span
        ref={ref}
        role="status"
        aria-label="Loading"
        className={twMerge('inline-flex items-center justify-center', className)}
        {...props}
      >
        <svg
          className={twMerge('animate-spin', sizeClasses[size], variantClasses[variant])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </span>
    )
  }
)

Spinner.displayName = 'Spinner'
