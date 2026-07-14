/**
 * KrishiMitra AI — Shimmering Loading Skeleton Components
 * ========================================================
 * Purpose: Provide premium placeholder loading states to reduce perceived latency.
 * Responsibilities: Render shimmering boxes, lines, or preconfigured mock cards.
 * Dependencies: clsx, tailwind-merge
 * Usage:
 *   <LoadingSkeleton className="h-6 w-24" />
 *   <LoadingSkeleton.Card />
 */

import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle'
}

export const SkeletonRoot = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rect', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'skeleton',
          variant === 'circle' ? 'rounded-full' : 'rounded-input',
          className
        )}
        {...props}
      />
    )
  }
)

SkeletonRoot.displayName = 'LoadingSkeleton'

// ── Widget Card Skeleton ─────────────────────────────────────────────────────
const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'p-6 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-card flex flex-col gap-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <SkeletonRoot variant="circle" className="h-10 w-10 shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonRoot className="h-4 w-1/3" />
          <SkeletonRoot className="h-3 w-1/4" />
        </div>
      </div>
      <div className="flex flex-col gap-2.5 pt-2">
        <SkeletonRoot className="h-5 w-full" />
        <SkeletonRoot className="h-5 w-5/6" />
        <SkeletonRoot className="h-5 w-2/3" />
      </div>
    </div>
  )
}

CardSkeleton.displayName = 'LoadingSkeleton.Card'

// ── List Item Skeleton ───────────────────────────────────────────────────────
const ListItemSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={twMerge('flex items-center justify-between gap-4 py-3.5 border-b border-border dark:border-border-dark last:border-0', className)}>
      <div className="flex items-center gap-3 flex-1">
        <SkeletonRoot variant="circle" className="h-10 w-10 shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <SkeletonRoot className="h-4 w-1/4" />
          <SkeletonRoot className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonRoot className="h-6 w-16 rounded-full" />
    </div>
  )
}

ListItemSkeleton.displayName = 'LoadingSkeleton.ListItem'

// Combine skeletons
export const LoadingSkeleton = Object.assign(SkeletonRoot, {
  Card: CardSkeleton,
  ListItem: ListItemSkeleton,
})
export default LoadingSkeleton
