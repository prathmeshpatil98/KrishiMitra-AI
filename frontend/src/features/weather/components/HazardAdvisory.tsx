import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'

interface RiskItem {
  level: string
  color: string
  bar: string
  w: string
  tip: string
}

interface HazardAdvisoryProps {
  harvestRisk: RiskItem
  transitRisk: RiskItem
  activeRainProb: number
}

const REGIONAL_HEATMAP = {
  dry: [
    { area: 'Karveer (Central)', rain: '15%', density: 'Low', color: 'text-emerald-450' },
    { area: 'Kagal (South Corridor)', rain: '12%', density: 'Low', color: 'text-emerald-450' },
    { area: 'Radhanagari (Western Ghats)', rain: '45%', density: 'Medium', color: 'text-amber-450' },
    { area: 'Panhala (Elevation Highlands)', rain: '30%', density: 'Medium', color: 'text-amber-450' },
  ],
  wet: [
    { area: 'Karveer (Central)', rain: '70%', density: 'High', color: 'text-rose-455' },
    { area: 'Kagal (South Corridor)', rain: '65%', density: 'High', color: 'text-rose-455' },
    { area: 'Radhanagari (Western Ghats)', rain: '95%', density: 'Critical', color: 'text-red-500 font-black animate-pulse' },
    { area: 'Panhala (Elevation Highlands)', rain: '80%', density: 'High', color: 'text-rose-455' },
  ]
}

export function HazardAdvisory({ harvestRisk, transitRisk, activeRainProb }: HazardAdvisoryProps) {
  const isWet = activeRainProb > 30
  const heatmap = isWet ? REGIONAL_HEATMAP.wet : REGIONAL_HEATMAP.dry

  return (
    <div className="flex flex-col gap-6 text-left font-sans">
      
      {/* AI Harvest Guidance (Harvest Advisory) */}
      <div className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${harvestRisk.color}`}>
        <div className="flex items-start gap-3.5 mb-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-[12.5px] font-black uppercase tracking-widest font-mono">AI Harvest Guidance</p>
            <p className="text-[12.5px] font-medium leading-relaxed mt-2 text-zinc-300">{harvestRisk.tip}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${harvestRisk.bar}`}
              initial={{ width: 0 }}
              animate={{ width: harvestRisk.w }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[9.5px] font-bold uppercase tracking-widest text-zinc-550 font-mono">
            <span>Low Risk</span>
            <span className="text-[#43F59A] font-extrabold">{harvestRisk.level}</span>
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* Transport Risk Analysis (Transit Advisory) */}
      <div className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${transitRisk.color}`}>
        <div className="flex items-start gap-3.5 mb-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-[12.5px] font-black uppercase tracking-widest font-mono">Transport Risk Analysis</p>
            <p className="text-[12.5px] font-medium leading-relaxed mt-2 text-zinc-300">{transitRisk.tip}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${transitRisk.bar}`}
              initial={{ width: 0 }}
              animate={{ width: transitRisk.w }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[9.5px] font-bold uppercase tracking-widest text-zinc-550 font-mono">
            <span>Low Risk</span>
            <span className="text-[#43F59A] font-extrabold">{transitRisk.level}</span>
            <span>High Risk</span>
          </div>
        </div>
      </div>

      {/* Soil Intelligence (Soil Moisture Check) */}
      <div className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-start gap-3.5">
          <CheckCircle size={18} className="text-[#43F59A] mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-black text-white uppercase tracking-wider font-mono">
              Soil Intelligence
            </p>
            <p className="text-[12.5px] text-zinc-400 leading-relaxed font-medium mt-3">
              Soil moisture is at <span className="text-[#43F59A] font-bold font-mono">62% saturation</span>. Optimal for{' '}
              {activeRainProb < 30
                ? 'direct sowing and crop harvesting'
                : 'allowing the field to drain before beginning harvest'}
              . Sowing viability remains high.
            </p>
          </div>
        </div>
      </div>

      {/* Precipitation Density Heatmap (Kolhapur district talukas) */}
      <div className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-start gap-3.5 mb-4">
          <BarChart3 size={18} className="text-[#43F59A] mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-black text-white uppercase tracking-wider font-mono">
              Precipitation Heatmap
            </p>
            <p className="text-[11px] text-zinc-550 font-medium">Sub-district taluka density index</p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 mt-4">
          {heatmap.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-[12px] border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
            >
              <span className="text-zinc-450 font-medium">{item.area}</span>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-zinc-350 font-bold">{item.rain}</span>
                <span className={`text-[9.5px] font-black uppercase ${item.color}`}>
                  {item.density}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
export default HazardAdvisory
