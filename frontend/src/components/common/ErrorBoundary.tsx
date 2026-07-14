/**
 * KrishiMitra AI — Robust React Error Boundary
 * ============================================
 * Purpose: Catch unhandled rendering errors and display a premium fallback UI.
 * Responsibilities: Catch layout crashes, display detail description, offer reset trigger.
 * Dependencies: React (class component model), lucide-react, Button
 */

import React, { ErrorInfo, ReactNode } from 'react'
import { AlertOctagon, RotateCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = ROUTES.DASHBOARD
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-card shadow-card animate-fade-in text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-5">
            <AlertOctagon size={32} />
          </div>

          <h2 className="text-h3 font-bold text-text-primary dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-text-secondary dark:text-text-muted text-body max-w-md mb-6">
            A rendering error occurred in this view. Don't worry, your farming data is safe.
            Try refreshing the component or return to the main dashboard.
          </p>

          {/* Dev details */}
          {import.meta.env.DEV && this.state.error && (
            <pre className="w-full max-w-2xl text-left bg-background dark:bg-background-dark p-4 rounded-input text-caption font-mono text-danger overflow-auto max-h-40 mb-6 border border-border dark:border-border-dark">
              {this.state.error.stack}
            </pre>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<RotateCcw size={16} />}
              onClick={this.handleReset}
            >
              Try Again
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home size={16} />}
              onClick={this.handleGoHome}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
