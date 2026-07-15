import { motion } from 'framer-motion'

interface RouteItem {
  id: string
  name: string
  distance: number
  eta: string
  fuelCost: number
  tollCost: number
  totalCost: number
  weather: { temp: number; desc: string; rainProb: number }
  latitude: number
  longitude: number
}

interface CostBreakdownProps {
  active: RouteItem
  riskColor: string
}

export function CostBreakdown({ active, riskColor }: CostBreakdownProps) {
  const fuelPct = (active.fuelCost / Math.max(active.totalCost, 1)) * 100
  const tollPct = (active.tollCost / Math.max(active.totalCost, 1)) * 100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Financial Cost cards */}
      <div className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-border/60 dark:border-white/5 shadow-card p-6 flex flex-col justify-between">
        <div>
          <p className="text-[14px] font-extrabold text-text-primary dark:text-zinc-100 uppercase tracking-wider mb-6">
            Cost Breakdown
          </p>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Fuel Expense', val: `₹${active.fuelCost}`, icon: '⛽', pct: fuelPct },
              { label: 'Toll Charges', val: `₹${active.tollCost}`, icon: '🛣️', pct: tollPct },
              { label: 'Total Expense', val: `₹${active.totalCost}`, icon: '💰', pct: 100, highlight: true },
            ].map((s) => (
              <div
                key={s.label}
                className={`p-4 rounded-xl ${
                  s.highlight
                    ? 'bg-farm-green dark:bg-emerald-600 text-white shadow-sm'
                    : 'bg-cream-DEFAULT/80 dark:bg-zinc-900/60 border border-border/30 dark:border-white/5'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[12.5px] font-bold ${s.highlight ? 'text-white/80' : 'text-text-muted'}`}>
                    {s.icon} {s.label}
                  </span>
                  <span className={`text-[15.5px] font-black ${s.highlight ? 'text-white' : 'text-text-primary dark:text-zinc-100'}`}>
                    {s.val}
                  </span>
                </div>
                <div className={`h-1.5 rounded-full ${s.highlight ? 'bg-white/20' : 'bg-border/60 dark:bg-white/5'} overflow-hidden`}>
                  <motion.div
                    className={`h-full rounded-full ${s.highlight ? 'bg-white' : 'bg-farm-green dark:bg-emerald-500'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transit weather risks card */}
      <div className={`rounded-3xl border p-6 shadow-sm flex flex-col justify-between ${riskColor}`}>
        <div>
          <p className="text-[14px] font-extrabold uppercase tracking-wider mb-6">Route Weather & Risk</p>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[48px]">
              {active.weather.rainProb > 50 ? '⛈️' : active.weather.rainProb > 30 ? '🌧️' : '☀️'}
            </span>
            <div>
              <p className="text-[26px] font-black leading-none tracking-tight">{active.weather.temp}°C</p>
              <p className="text-[13px] font-bold mt-1 text-zinc-600 dark:text-zinc-300">{active.weather.desc}</p>
            </div>
          </div>
          <div className="space-y-3.5 text-[12.5px] border-t border-black/10 dark:border-white/10 pt-4">
            <div className="flex justify-between font-semibold">
              <span className="opacity-70">Precipitation Risk</span>
              <span className="font-extrabold">{active.weather.rainProb}%</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="opacity-70">Road Condition</span>
              <span className="font-extrabold">
                {active.weather.rainProb > 50
                  ? 'Wet / Slippery Risk'
                  : active.weather.rainProb > 30
                  ? 'Damp Surface'
                  : 'Dry / Optimal'}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="opacity-70">Waterproof Tarp Needed</span>
              <span className="font-extrabold">
                {active.weather.rainProb > 30 ? 'Yes — Mandatory' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CostBreakdown
