import { motion } from 'framer-motion'
import { ShieldCheck, Wind } from 'lucide-react'

interface HourlyItem {
  time: string
  temp: number
  desc: string
}

interface ForecastItem {
  date: string
  temp: number
  rainProb: number
  humidity: number
  desc: string
  status: 'clear' | 'showers' | 'warning'
  wind: string
  uv: string
  sunrise: string
  sunset: string
  confidence: string
  hourly: HourlyItem[]
}

interface ForecastGridProps {
  forecast: ForecastItem[]
  selectedIdx: number
  setSelectedIdx: (idx: number) => void
  icons: Record<string, string>
}

export function ForecastGrid({ forecast, selectedIdx, setSelectedIdx, icons }: ForecastGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {forecast.map((day, i) => {
        const active = i === selectedIdx
        return (
          <motion.button
            key={day.date}
            onClick={() => setSelectedIdx(i)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18, delay: i * 0.05 }}
            className={`flex flex-col items-center gap-3.5 p-5.5 rounded-3xl border transition-all duration-250 cursor-pointer relative text-center group ${
              active
                ? 'border-[#2ECC71]/40 bg-gradient-to-b from-[#2ECC71]/10 to-[#2ECC71]/0 text-white shadow-xl shadow-[#2ECC71]/3 scale-[1.01]'
                : 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.03] text-zinc-400 hover:text-white'
            }`}
          >
            {/* Condition Icon */}
            <span className="text-4.5xl mb-1 filter drop-shadow-md select-none">{icons[day.status]}</span>
            
            {/* Day Title */}
            <p className="text-[13.5px] font-black leading-none tracking-tight">
              {day.date}
            </p>
            
            {/* Temp Display */}
            <p className="text-[22px] font-black leading-none mt-1 font-mono text-white">
              {day.temp}°C
            </p>
            
            {/* Rain Probability Badge */}
            <span
              className={`text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mt-1 border font-mono ${
                active
                  ? 'bg-[#2ECC71]/15 text-[#43F59A] border-[#2ECC71]/25'
                  : day.status === 'clear'
                  ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/15'
                  : day.status === 'showers'
                  ? 'bg-amber-500/10 text-amber-450 border-amber-500/15'
                  : 'bg-rose-500/10 text-rose-450 border-rose-500/15'
              }`}
            >
              {day.rainProb}% rain
            </span>

            {/* Bottom Meta metrics */}
            <div className="w-full grid grid-cols-2 gap-1 mt-3 pt-3 border-t border-white/[0.04] text-[9px] font-mono text-zinc-550 font-bold">
              <div className="flex items-center justify-center gap-0.5">
                <ShieldCheck size={10} className="text-[#43F59A]" />
                {day.confidence}
              </div>
              <div className="flex items-center justify-center gap-0.5">
                <Wind size={10} />
                {day.wind.split(' ')[0]}
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
export default ForecastGrid
