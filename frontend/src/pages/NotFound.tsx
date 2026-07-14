/**
 * KrishiMitra AI — Premium 404 Page
 * =================================
 * Purpose: Render clean fallback page when route matching fails.
 * Responsibilities: Layout friendly illustration, redirect home button action.
 */

import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-background dark:bg-background-dark text-center select-none">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary mb-6 shrink-0">
        <AlertCircle size={40} />
      </div>

      <h1 className="text-display font-extrabold text-text-primary dark:text-white tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-h3 font-bold text-text-primary dark:text-white mb-3">
        Page not found
      </h2>
      <p className="text-text-secondary dark:text-text-muted text-body max-w-md mb-8 leading-relaxed">
        The page you are looking for doesn't exist or has been moved. Check the URL or click the button below to return to safety.
      </p>

      <Button
        variant="primary"
        size="md"
        leftIcon={<ArrowLeft size={18} />}
        onClick={() => navigate(ROUTES.DASHBOARD)}
      >
        Back to Dashboard
      </Button>
    </div>
  )
}

export default NotFound
