/**
 * KrishiMitra AI — Premium Dashboard Page
 * ========================================
 * Purpose: Render the main overview dashboard showing status updates, key widgets, and recommendations.
 * Design: High-end SaaS quality comparable to Linear/Stripe, glassmorphic hover effects, animations, and fully responsive panels.
 */

import { motion } from 'framer-motion'
import {
  TrendingUp,
  CloudSun,
  Sprout,
  Landmark,
  ArrowUpRight,
  MapPin,
  Route,
  MessageSquare,
  Bell,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  DollarSign
} from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Stagger Animation Config
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
}

export function Dashboard() {
  // Mock data matching backend LangGraph execution results
  const mockRecommendation = {
    crop: 'Wheat',
    quantity: '100 Quintals',
    bestMarket: 'Ujjain Mandi',
    netProfit: 244010.70,
    confidence: 95,
    sellingDay: 'Friday',
    advice: 'Weather is ideal for transit and harvest.'
  }

  const mockMarkets = [
    { name: 'Ujjain Mandi', price: 2510.0, distance: '45.8 km', cost: 469.30, profit: 244010.70, trend: 'up' },
    { name: 'Indore Mandi', price: 2450.0, distance: '12.4 km', cost: 185.40, profit: 238914.60, trend: 'up' },
    { name: 'Dewas Mandi', price: 2390.0, distance: '38.2 km', cost: 404.70, profit: 232145.30, trend: 'down' }
  ]

  const mockForecast = [
    { date: 'Today', temp: '29.5°C', desc: 'Sunny', rain: '15%', status: 'clear' },
    { date: 'Tomorrow', temp: '30.0°C', desc: 'Partly Cloudy', rain: '10%', status: 'clear' },
    { date: 'Thursday', temp: '28.5°C', desc: 'Showers Predicted', rain: '40%', status: 'warning' }
  ]

  const mockConversations = [
    { id: '1', title: 'Wheat Profit Margin Query', time: '10 min ago', excerpt: 'I found Ujjain Mandi yields...' },
    { id: '2', title: 'Paddy Harvesting Weather Advice', time: '2 hours ago', excerpt: 'Heavy rain is expected...' }
  ]

  const mockNotifications = [
    { id: '1', type: 'price', text: 'Wheat rate in Indore increased by 5%', color: 'border-green-500/20 bg-green-500/5 text-green-500' },
    { id: '2', type: 'warning', text: 'High transit risk next Thursday due to rainfall forecast', color: 'border-amber-500/20 bg-amber-500/5 text-amber-500' }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* ── Welcome Header & Local Settings ────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-h1 font-black tracking-tight text-text-primary dark:text-white">
            Overview
          </h1>
          <p className="text-body text-text-secondary dark:text-text-muted mt-1">
            Real-time optimization matrix for agricultural logistics & profits.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <MapPin size={16} className="mr-2" /> Indore, MP
          </Button>
          <Button variant="primary" size="sm" className="h-9 bg-brand-primary hover:bg-brand-primary/95 text-white">
            Optimize Today
          </Button>
        </div>
      </motion.div>

      {/* ── Metric Cards Row ─────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign size={80} />
          </div>
          <Card.Body className="flex flex-col gap-1.5">
            <span className="text-caption font-semibold tracking-wider text-text-secondary dark:text-text-muted uppercase">Expected Net Profit</span>
            <div className="text-h2 font-black text-brand-primary tracking-tight">₹2,44,010.70</div>
            <span className="text-caption flex items-center text-emerald-500 dark:text-emerald-400 font-semibold gap-1">
              <TrendingUp size={14} /> +₹5,096.10 max efficiency yields
            </span>
          </Card.Body>
        </Card>

        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CloudSun size={80} />
          </div>
          <Card.Body className="flex flex-col gap-1.5">
            <span className="text-caption font-semibold tracking-wider text-text-secondary dark:text-text-muted uppercase">Weather Risk Matrix</span>
            <div className="text-h2 font-black text-text-primary dark:text-white tracking-tight">LOW RISK</div>
            <span className="text-caption text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle size={14} /> Stable conditions for harvest
            </span>
          </Card.Body>
        </Card>

        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sprout size={80} />
          </div>
          <Card.Body className="flex flex-col gap-1.5">
            <span className="text-caption font-semibold tracking-wider text-text-secondary dark:text-text-muted uppercase">Primary Active Crop</span>
            <div className="text-h2 font-black text-text-primary dark:text-white tracking-tight">Wheat</div>
            <span className="text-caption text-text-secondary dark:text-text-muted">100.0 Quintals registered</span>
          </Card.Body>
        </Card>

        <Card hoverable className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Landmark size={80} />
          </div>
          <Card.Body className="flex flex-col gap-1.5">
            <span className="text-caption font-semibold tracking-wider text-text-secondary dark:text-text-muted uppercase">Subsidies & Schemes</span>
            <div className="text-h2 font-black text-text-primary dark:text-white tracking-tight">3 Eligible</div>
            <span className="text-caption text-emerald-500 font-semibold flex items-center gap-1">
              <ArrowUpRight size={14} /> PM-Kisan portal active
            </span>
          </Card.Body>
        </Card>
      </motion.div>

      {/* ── Main Dashboard Layout ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Double Columns: Analytics, Rankings, Forecasts */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Today's Recommendation Banner */}
          <motion.div variants={itemVariants}>
            <div className="relative overflow-hidden p-6 rounded-card border border-brand-primary/10 bg-linear-to-r from-brand-primary/5 via-brand-secondary/5 to-brand-primary/5 dark:from-brand-primary/10 dark:via-brand-secondary/5 dark:to-brand-primary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="info" className="bg-brand-primary/20 text-brand-primary dark:text-brand-secondary border-none px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Today's AI Advisory
                  </Badge>
                  <span className="text-caption text-text-secondary dark:text-text-muted">• {mockRecommendation.confidence}% Confidence Rating</span>
                </div>
                <h3 className="text-h3 font-black text-text-primary dark:text-white mt-1.5">
                  Sell Wheat in <span className="text-brand-primary">{mockRecommendation.bestMarket}</span>
                </h3>
                <p className="text-small text-text-secondary dark:text-text-muted mt-1 max-w-xl">
                  {mockRecommendation.advice} Optimal day to sell is estimated on <strong className="text-brand-secondary">{mockRecommendation.sellingDay}</strong> for a projected price of ₹2,510/Quintal.
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 select-none text-right shrink-0">
                <div className="text-caption text-text-secondary dark:text-text-muted uppercase">Recommended Net Revenue</div>
                <div className="text-h2 font-black text-brand-primary">₹2.44L</div>
              </div>
            </div>
          </motion.div>

          {/* Markets Rankings Widget */}
          <motion.div variants={itemVariants}>
            <Card>
              <Card.Header className="flex flex-row justify-between items-center pb-4 border-b border-border-primary/5">
                <div>
                  <h3 className="font-black text-text-primary dark:text-white flex items-center gap-2">
                    <TrendingUp size={20} className="text-brand-primary" /> Nearby Market Prices
                  </h3>
                  <p className="text-caption text-text-secondary dark:text-text-muted mt-0.5">Mandi arrivals and travel logistics projections</p>
                </div>
                <Button variant="ghost" size="sm" className="text-brand-primary dark:text-brand-secondary">
                  View All Mandis <ChevronRight size={16} />
                </Button>
              </Card.Header>
              <Card.Body className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border-primary/5 text-caption font-bold text-text-secondary dark:text-text-muted uppercase bg-border-primary/2">
                      <th className="p-4">Market</th>
                      <th className="p-4">Price / Qtl</th>
                      <th className="p-4">Transit Cost</th>
                      <th className="p-4">Distance</th>
                      <th className="p-4">Expected Net Profit</th>
                      <th className="p-4 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMarkets.map((market, idx) => (
                      <tr 
                        key={idx} 
                        className="border-b border-border-primary/5 hover:bg-border-primary/2 transition-colors text-small"
                      >
                        <td className="p-4 font-bold text-text-primary dark:text-white flex items-center gap-2">
                          <MapPin size={14} className="text-text-muted" /> {market.name}
                        </td>
                        <td className="p-4 font-semibold text-text-primary dark:text-white">₹{market.price.toLocaleString()}</td>
                        <td className="p-4 text-text-secondary dark:text-text-muted">₹{market.cost.toFixed(2)}</td>
                        <td className="p-4 text-text-secondary dark:text-text-muted flex items-center gap-1.5 mt-1 border-none">
                          <Route size={14} className="text-text-muted" /> {market.distance}
                        </td>
                        <td className="p-4 font-bold text-brand-primary">₹{market.profit.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <Badge 
                            variant={market.trend === 'up' ? 'success' : 'danger'}
                            className="text-[10px] uppercase font-bold"
                          >
                            {market.trend === 'up' ? (
                              <span className="flex items-center gap-0.5"><TrendingUp size={10} /> Upward</span>
                            ) : (
                              <span className="flex items-center gap-0.5"><TrendingDown size={10} /> Down</span>
                            )}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Weather & Transit Risk Widgets */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Daily Weather Forecast Card */}
              <Card>
                <Card.Header className="pb-3">
                  <h3 className="font-bold text-text-primary dark:text-white flex items-center gap-2">
                    <CloudSun size={18} className="text-brand-primary" /> Forecast Weather
                  </h3>
                </Card.Header>
                <Card.Body className="flex flex-col gap-4">
                  {mockForecast.map((day, idx) => (
                    <div 
                      key={idx} 
                      className="flex justify-between items-center p-3 rounded-xl border border-border-primary/5 hover:bg-border-primary/2 transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary dark:text-white text-small">{day.date}</span>
                        <span className="text-caption text-text-secondary dark:text-text-muted">{day.desc}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-bold text-text-primary dark:text-white text-small">{day.temp}</span>
                          <div className="text-caption text-text-secondary dark:text-text-muted">Rain: {day.rain}</div>
                        </div>
                        {day.status === 'warning' ? (
                          <AlertTriangle size={18} className="text-warning animate-pulse" />
                        ) : (
                          <CheckCircle size={18} className="text-brand-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Transit Cost Analysis Card */}
              <Card>
                <Card.Header className="pb-3">
                  <h3 className="font-bold text-text-primary dark:text-white flex items-center gap-2">
                    <Route size={18} className="text-brand-primary" /> Transit Cost Analysis
                  </h3>
                </Card.Header>
                <Card.Body className="flex flex-col gap-4 text-small">
                  <div className="flex justify-between pb-2 border-b border-border-primary/5">
                    <span className="text-text-secondary dark:text-text-muted">Fuel Cost (Avg 9 Rs/km)</span>
                    <span className="font-bold text-text-primary dark:text-white">₹412.20</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-border-primary/5">
                    <span className="text-text-secondary dark:text-text-muted">Tolls & Taxes</span>
                    <span className="font-bold text-text-primary dark:text-white">₹57.10</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-border-primary/5">
                    <span className="text-text-secondary dark:text-text-muted">Handling & Commission (2%)</span>
                    <span className="font-bold text-text-primary dark:text-white">₹5,020.00</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="font-bold text-text-primary dark:text-white">Total Expenses</span>
                    <span className="font-black text-brand-primary">₹5,489.30</span>
                  </div>
                </Card.Body>
              </Card>

            </div>
          </motion.div>

        </div>

        {/* Right Sidebar Columns: Notifications & Conversations */}
        <div className="flex flex-col gap-6">
          
          {/* Notifications Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <Card.Header className="pb-3">
                <h3 className="font-bold text-text-primary dark:text-white flex items-center gap-2">
                  <Bell size={18} className="text-brand-primary animate-bounce" /> Alerts & Notifications
                </h3>
              </Card.Header>
              <Card.Body className="flex flex-col gap-3">
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 rounded-xl border flex items-start gap-3 text-small leading-snug ${notif.color}`}
                  >
                    <div className="h-2 w-2 rounded-full bg-current shrink-0 mt-1.5 animate-pulse" />
                    <div className="flex-1">{notif.text}</div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </motion.div>

          {/* Recent AI Advisor Conversations */}
          <motion.div variants={itemVariants}>
            <Card>
              <Card.Header className="pb-3">
                <h3 className="font-bold text-text-primary dark:text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-brand-primary" /> Recent Conversations
                </h3>
              </Card.Header>
              <Card.Body className="flex flex-col gap-3">
                {mockConversations.map((chat) => (
                  <div 
                    key={chat.id} 
                    className="p-4 rounded-xl border border-border-primary/5 hover:border-brand-primary/20 hover:bg-border-primary/2 transition-all cursor-pointer flex flex-col gap-1.5 group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary dark:text-white text-small group-hover:text-brand-primary transition-colors">
                        {chat.title}
                      </span>
                      <span className="text-[10px] text-text-secondary dark:text-text-muted">{chat.time}</span>
                    </div>
                    <p className="text-caption text-text-secondary dark:text-text-muted truncate">
                      {chat.excerpt}
                    </p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Open Assistant Session
                </Button>
              </Card.Body>
            </Card>
          </motion.div>

        </div>

      </div>
    </motion.div>
  )
}
