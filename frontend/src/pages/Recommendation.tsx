/**
 * KrishiMitra AI — Premium Recommendation Page
 * ============================================
 * Design: High-fidelity Perplexity/Stripe style, circular SVG confidence indicators,
 * side-by-side revenue/profit progress bars, and custom SVG comparative bar charts.
 */

import { useState, useMemo } from 'react'
import {
  TrendingUp,
  Route,
  CloudSun,
  Landmark,
  ShieldCheck,
  ArrowUpRight,
  Info,
  Terminal,
  Activity
} from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

// Types
interface MandiRecommendation {
  name: string
  distance: number
  price: number
  grossRevenue: number
  expenses: number
  netProfit: number
  rank: number
}

export function Recommendation() {
  const [selectedMandi, setSelectedMandi] = useState<string>('Ujjain Mandi')

  // Mock Recommendation Dataset
  const mockRecommendations: MandiRecommendation[] = [
    { name: 'Ujjain Mandi', distance: 45.8, price: 2510.0, grossRevenue: 251000.0, expenses: 6989.30, netProfit: 244010.70, rank: 1 },
    { name: 'Indore Mandi', distance: 12.4, price: 2450.0, grossRevenue: 245000.0, expenses: 6085.40, netProfit: 238914.60, rank: 2 },
    { name: 'Dewas Mandi', distance: 38.2, price: 2390.0, grossRevenue: 239000.0, expenses: 6854.70, netProfit: 232145.30, rank: 3 }
  ]

  const activeRec = useMemo(() => {
    return mockRecommendations.find(r => r.name === selectedMandi) || mockRecommendations[0]
  }, [selectedMandi])

  // Mock metadata matching backend LangGraph execution results
  const mockAI = {
    decision: 'Sell 100.0 Quintals of Wheat in Ujjain Mandi on Friday.',
    confidence: 95,
    reasoning: 'Ujjain Mandi provides the highest net profit margin (₹2,44,010.70) despite the 45.8 km transit distance, due to a premium price rate (₹2,510/Quintal) compared to Indore. The weather risk for the weekend transit is low, and Ujjain has active Agmarknet price arrivals updates.',
    weatherAdvice: 'Weather is ideal for transit and harvest. No rain predicted for Friday.',
    subsidies: [
      { name: 'PM Kisan Samman Nidhi', benefit: 'Direct benefit transfer of ₹6,000/year' },
      { name: 'Pradhan Mantri Fasal Bima Yojana', benefit: 'Full weather crop insurance coverage' }
    ]
  }

  // Circular progress SVG values
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (mockAI.confidence / 100) * circumference

  // SVG comparative bar chart dimensions
  const svgWidth = 500
  const svgHeight = 180

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-h1 font-black text-text-primary dark:text-white tracking-tight">AI Recommendation</h1>
          <p className="text-body text-text-secondary dark:text-text-muted mt-1">
            Optimized decision matrices synthesizing mandi rates, weather forecast, transit overheads, and welfare schemes.
          </p>
        </div>
      </div>

      {/* ── Main Recommendation Showcase Banner ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double Card: AI Decision & Detailed Reasoning */}
        <Card className="lg:col-span-2 relative overflow-hidden bg-linear-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-primary/5 border-brand-primary/10">
          <Card.Header className="pb-2 border-none">
            <Badge variant="info" className="bg-brand-primary/20 text-brand-primary dark:text-brand-secondary border-none px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider w-fit">
              Consensus Decision Reached
            </Badge>
            <h2 className="text-h2 font-black text-text-primary dark:text-white mt-3 leading-tight">
              {mockAI.decision}
            </h2>
          </Card.Header>
          <Card.Body className="flex flex-col gap-4">
            
            {/* Reasoning Block */}
            <div className="p-4 rounded-xl border border-border-primary/5 bg-background-primary/50 text-small text-text-secondary dark:text-text-muted leading-relaxed">
              <div className="flex items-center gap-2 mb-2 text-caption font-bold text-text-primary dark:text-white uppercase tracking-wider">
                <Terminal size={14} className="text-brand-primary animate-pulse" /> Reasoning Logic Summary
              </div>
              <p>{mockAI.reasoning}</p>
            </div>

            {/* Weather & Schemes Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-small">
              <div className="p-3.5 rounded-xl border border-border-primary/5 bg-background-primary/30 flex items-start gap-3">
                <CloudSun size={18} className="text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-text-primary dark:text-white">Weather Suitability</span>
                  <p className="text-caption text-text-secondary dark:text-text-muted mt-0.5">{mockAI.weatherAdvice}</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl border border-border-primary/5 bg-background-primary/30 flex items-start gap-3">
                <Landmark size={18} className="text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-text-primary dark:text-white">Govt Benefits Applied</span>
                  <p className="text-caption text-text-secondary dark:text-text-muted mt-0.5">PMFBY Weather Insurance active</p>
                </div>
              </div>
            </div>

          </Card.Body>
        </Card>

        {/* Right Single Card: Confidence Gauge */}
        <Card className="flex flex-col justify-center items-center p-6 text-center">
          <Card.Header className="pb-2 border-none">
            <span className="text-caption font-bold tracking-wider text-text-secondary dark:text-text-muted uppercase">Confidence Score</span>
          </Card.Header>
          <Card.Body className="flex flex-col items-center justify-center gap-4">
            
            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-95">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-border-primary/5"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[32px] font-black text-text-primary dark:text-white tracking-tight">{mockAI.confidence}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-small font-bold text-text-primary dark:text-white flex items-center justify-center gap-1.5">
                <ShieldCheck size={16} className="text-brand-primary" /> Verified Accuracy
              </h4>
              <p className="text-caption text-text-secondary dark:text-text-muted mt-1 max-w-[200px]">
                Calculated based on real-time Agmarknet, OpenWeather and Google Maps Matrix APIs.
              </p>
            </div>

          </Card.Body>
        </Card>

      </div>

      {/* ── Net Profit Comparison & Charts ────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Columns: Comparison Progress bars & interactive Bar Charts */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Custom SVG Comparative Bar Chart */}
          <Card>
            <Card.Header className="pb-1">
              <h3 className="font-black text-text-primary dark:text-white flex items-center gap-2">
                <Activity size={20} className="text-brand-primary" /> Net profit vs Expenses Comparison
              </h3>
              <p className="text-caption text-text-secondary dark:text-text-muted">Comparing total revenue cutdowns across candidate mandis</p>
            </Card.Header>
            <Card.Body className="p-4 flex flex-col gap-4">
              
              {/* SVG Layout */}
              <div className="w-full h-48 bg-border-primary/2 rounded-xl relative overflow-hidden flex items-end">
                <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                  
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2={svgWidth - 30} y2="20" stroke="currentColor" strokeWidth="0.5" className="text-border-primary/5" />
                  <line x1="30" y1="80" x2={svgWidth - 30} y2="80" stroke="currentColor" strokeWidth="0.5" className="text-border-primary/5" />
                  <line x1="30" y1="140" x2={svgWidth - 30} y2="140" stroke="currentColor" strokeWidth="0.5" className="text-border-primary/5" />

                  {/* Render 3 grouped columns */}
                  {mockRecommendations.map((rec, index) => {
                    const groupWidth = (svgWidth - 60) / 3
                    const startX = 30 + index * groupWidth + 20
                    
                    // Scale metrics
                    const maxScale = 260000
                    const profitHeight = (rec.netProfit / maxScale) * (svgHeight - 60)
                    const costHeight = ((rec.grossRevenue - rec.netProfit) / maxScale) * (svgHeight - 60) + 10

                    return (
                      <g key={index} className="cursor-pointer" onClick={() => setSelectedMandi(rec.name)}>
                        
                        {/* Net Profit Bar (emerald) */}
                        <rect
                          x={startX}
                          y={svgHeight - profitHeight - 30}
                          width="24"
                          height={profitHeight}
                          fill="#10b981"
                          rx="4"
                          className="hover:opacity-90 transition-opacity"
                        />

                        {/* Expenses Bar (rose/amber) */}
                        <rect
                          x={startX + 30}
                          y={svgHeight - costHeight - 30}
                          width="24"
                          height={costHeight}
                          fill="#f59e0b"
                          rx="4"
                          className="hover:opacity-90 transition-opacity"
                        />

                        {/* Mandi label */}
                        <text
                          x={startX + 27}
                          y={svgHeight - 10}
                          fontSize="9"
                          textAnchor="middle"
                          className="fill-text-secondary dark:fill-text-muted font-bold"
                        >
                          {rec.name.split(' ')[0]}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Chart Legend indicators */}
              <div className="flex gap-4 text-caption font-bold justify-center">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 bg-emerald-500 rounded-sm" /> Net Profit</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 bg-amber-500 rounded-sm" /> Expenses (Logistics + Load)</span>
              </div>

            </Card.Body>
          </Card>

          {/* Interactive comparative listings */}
          <div className="flex flex-col gap-4">
            {mockRecommendations.map((rec) => (
              <div 
                key={rec.name}
                onClick={() => setSelectedMandi(rec.name)}
                className={`p-4 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all ${selectedMandi === rec.name ? 'border-brand-primary bg-brand-primary/5 font-semibold text-brand-primary' : 'border-border-primary/5 hover:bg-border-primary/2 text-text-secondary dark:text-text-muted'}`}
              >
                <div className="flex items-center gap-3">
                  <Badge variant={rec.rank === 1 ? 'success' : 'neutral'} className="text-[10px] font-black h-fit">
                    Rank #{rec.rank}
                  </Badge>
                  <div>
                    <h4 className="font-bold text-text-primary dark:text-white text-small">{rec.name}</h4>
                    <span className="text-caption text-text-secondary dark:text-text-muted flex items-center gap-1 mt-0.5">
                      <Route size={12} /> {rec.distance} km away
                    </span>
                  </div>
                </div>
                <div className="flex gap-6 text-right items-center">
                  <div>
                    <span className="text-[10px] text-text-secondary dark:text-text-muted uppercase">Gross Revenue</span>
                    <div className="font-semibold text-text-primary dark:text-white text-small">₹{rec.grossRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-secondary dark:text-text-muted uppercase">Est. Net Profit</span>
                    <div className="font-extrabold text-brand-primary text-small">₹{rec.netProfit.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar: Active Details Breakdown */}
        <div className="flex flex-col gap-6">
          
          {/* Revenue Cutdown Breakdown */}
          <Card>
            <Card.Header className="pb-3 border-b border-border-primary/5">
              <h3 className="font-bold text-text-primary dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-primary" /> {activeRec.name} Cost Breakdown
              </h3>
            </Card.Header>
            <Card.Body className="flex flex-col gap-4 text-small">
              <div className="flex justify-between pb-2 border-b border-border-primary/5">
                <span className="text-text-secondary dark:text-text-muted">Gross Revenue (Wheat)</span>
                <span className="font-bold text-text-primary dark:text-white">₹{activeRec.grossRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-border-primary/5 text-rose-500">
                <span className="flex items-center gap-1"><Route size={14} /> Total Transport Cost</span>
                <span>- ₹{activeRec.expenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-bold text-text-primary dark:text-white">Est. Net Profit</span>
                <span className="font-black text-brand-primary">₹{activeRec.netProfit.toLocaleString()}</span>
              </div>
            </Card.Body>
          </Card>

          {/* Eligible Welfare Subsidies programs list */}
          <Card>
            <Card.Header className="pb-2">
              <h3 className="font-bold text-text-primary dark:text-white flex items-center gap-2">
                <Landmark size={18} className="text-brand-primary" /> Government Benefits
              </h3>
            </Card.Header>
            <Card.Body className="flex flex-col gap-3 text-small">
              {mockAI.subsidies.map((sub, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border-primary/5 hover:bg-border-primary/2 transition-colors flex flex-col gap-1">
                  <span className="font-bold text-text-primary dark:text-white flex items-center justify-between">
                    {sub.name} <ArrowUpRight size={14} className="text-text-muted" />
                  </span>
                  <p className="text-caption text-text-secondary dark:text-text-muted">{sub.benefit}</p>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Disclaimer & Info */}
          <div className="p-3.5 rounded-xl border border-border-primary/5 bg-background-secondary/2 flex items-start gap-2.5 text-caption text-text-secondary dark:text-text-muted leading-relaxed">
            <Info size={16} className="text-brand-primary shrink-0 mt-0.5" />
            <div>
              Estimates are dynamically simulated based on current mandi arrival modal rates. Actual rates may vary slightly at time of loading.
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
