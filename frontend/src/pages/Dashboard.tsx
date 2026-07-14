/**
 * KrishiMitra AI — Dashboard Page Shell
 * =====================================
 * Purpose: Render the main overview dashboard showing status updates and key metrics.
 * Responsibilities: Layout widget cards, handle welcome message display.
 */

import { LayoutDashboard, TrendingUp, CloudSun, Sprout, Landmark } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-1.5 p-6 bg-linear-to-r from-brand-primary to-brand-secondary rounded-card text-white shadow-card">
        <h1 className="text-h2 font-bold tracking-tight">
          Welcome back, {user?.farmer_profile?.full_name ?? 'Farmer'}!
        </h1>
        <p className="text-small text-green-100 max-w-xl">
          Your dashboard is connected and monitoring weather conditions, local market prices, and optimizing logistics routes for maximum profit.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card hoverable>
          <Card.Body className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="text-caption text-text-secondary dark:text-text-muted font-medium">Market Index</div>
              <div className="text-h3 font-bold mt-0.5">Optimized</div>
            </div>
          </Card.Body>
        </Card>

        <Card hoverable>
          <Card.Body className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary rounded-xl">
              <CloudSun size={24} />
            </div>
            <div>
              <div className="text-caption text-text-secondary dark:text-text-muted font-medium">Local Weather</div>
              <div className="text-h3 font-bold mt-0.5">28°C • Sunny</div>
            </div>
          </Card.Body>
        </Card>

        <Card hoverable>
          <Card.Body className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary rounded-xl">
              <Sprout size={24} />
            </div>
            <div>
              <div className="text-caption text-text-secondary dark:text-text-muted font-medium">Active Crop</div>
              <div className="text-h3 font-bold mt-0.5">Wheat</div>
            </div>
          </Card.Body>
        </Card>

        <Card hoverable>
          <Card.Body className="flex items-center gap-4">
            <div className="p-3 bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-secondary rounded-xl">
              <Landmark size={24} />
            </div>
            <div>
              <div className="text-caption text-text-secondary dark:text-text-muted font-medium">Govt Schemes</div>
              <div className="text-h3 font-bold mt-0.5">4 Available</div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <Card.Header>
            <h3 className="font-bold text-text-primary dark:text-white">AI Farming Optimization</h3>
          </Card.Header>
          <Card.Body className="min-h-[240px] flex flex-col justify-center items-center text-center p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-4">
              <LayoutDashboard size={24} />
            </div>
            <h4 className="text-body font-bold text-text-primary dark:text-white mb-1">Interactive Advisor Sandbox</h4>
            <p className="text-small text-text-secondary dark:text-text-muted max-w-sm">
              Use the AI Assistant tab to query market prices, check weather forecasts, or run profit margins model matching.
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="font-bold text-text-primary dark:text-white">Active Alerts</h3>
          </Card.Header>
          <Card.Body className="flex flex-col gap-4">
            <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 text-warning flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-warning shrink-0 mt-1.5 animate-pulse" />
              <div className="flex-1 text-small leading-snug">
                <strong>Price fluctuation alert</strong>: Market rates for Wheat in Indore Mandi have risen by 5% today.
              </div>
            </div>
            <div className="p-4 rounded-xl border border-info/20 bg-info/5 text-info flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-info shrink-0 mt-1.5" />
              <div className="flex-1 text-small leading-snug">
                <strong>Weather advisory</strong>: Scattered light rainfall predicted for next Tuesday. Ensure proper crop drainage.
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
