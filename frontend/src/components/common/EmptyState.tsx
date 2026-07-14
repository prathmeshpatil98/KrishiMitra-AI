/**
 * KrishiMitra AI — Premium Empty State Component
 * ===============================================
 * Purpose: Render beautiful empty states for lists, search results, or offline errors.
 * Responsibilities: Render centered illustration/icon, text details, and action button.
 * Dependencies: lucide-react, Button
 * Usage:
 *   <EmptyState
 *     title="No Schemes Found"
 *     description="There are no government schemes listed matching your search criteria."
 *     action={{ label: "Clear Filters", onClick: ... }}
 *   />
 */

import React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ title, description, icon, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full flex flex-col items-center justify-center p-8 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-card animate-fade-in text-center min-h-[300px]"
        {...props}
      >
        {/* Animated Icon Container */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary mb-5 shrink-0">
          {icon || <Inbox size={28} />}
        </div>

        {/* Messaging */}
        <h3 className="text-h4 font-bold text-text-primary dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-text-secondary dark:text-text-muted text-body max-w-sm mb-6 select-none">
          {description}
        </p>

        {/* Action Button */}
        {action && (
          <Button
            variant="primary"
            size="sm"
            onClick={action.onClick}
            leftIcon={action.icon}
          >
            {action.label}
          </Button>
        )}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'
export default EmptyState
