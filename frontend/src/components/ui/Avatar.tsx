/**
 * KrishiMitra AI — User Avatar Component
 * =====================================
 * Purpose: Render user profile images or initials fallbacks with size options and status dots.
 * Responsibilities: Render image safely, calculate initials on fallback, display optional status.
 * Dependencies: clsx, tailwind-merge
 * Usage: <Avatar src={user.avatar} name="Rajesh Kumar" status="online" size="md" />
 */

import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'busy'
  border?: boolean
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, name, size = 'md', status, border = false, ...props }, ref) => {
    const [imageError, setImageError] = useState(false)

    // Calculate initials (up to 2 characters)
    const getInitials = (userName: string) => {
      const parts = userName.trim().split(/\s+/)
      if (parts.length === 0 || !parts[0]) return '?'
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const sizeClasses = {
      sm: 'h-8 w-8 text-caption font-semibold',
      md: 'h-10 w-10 text-body font-semibold',
      lg: 'h-14 w-14 text-h3 font-bold',
      xl: 'h-20 w-20 text-h1 font-bold',
    }

    const statusSizes = {
      sm: 'h-2.5 w-2.5 ring-1',
      md: 'h-3 w-3 ring-2',
      lg: 'h-4 w-4 ring-2',
      xl: 'h-5 w-5 ring-2',
    }

    const statusColors = {
      online: 'bg-success',
      offline: 'bg-text-muted',
      busy: 'bg-danger',
    }

    return (
      <div
        ref={ref}
        className={twMerge(
          'relative inline-flex items-center justify-center shrink-0 rounded-full select-none',
          border && 'ring-2 ring-brand-primary/20 dark:ring-brand-primary/45',
          className
        )}
        {...props}
      >
        {/* Profile Image or Initials Fallback */}
        {src && !imageError ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className={twMerge('h-full w-full rounded-full object-cover', sizeClasses[size])}
          />
        ) : (
          <div
            className={twMerge(
              'h-full w-full rounded-full flex items-center justify-center bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary border border-brand-primary/10',
              sizeClasses[size]
            )}
          >
            {getInitials(name)}
          </div>
        )}

        {/* Status Indicator Dot */}
        {status && (
          <span
            className={twMerge(
              'absolute bottom-0 right-0 rounded-full ring-white dark:ring-surface-dark block',
              statusSizes[size],
              statusColors[status]
            )}
            role="presentation"
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'
export default Avatar
