import { motion } from 'framer-motion'
import { AlertTriangle, ChevronRight, CloudRain, CloudSun, Droplets, Wind } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

interface ForecastDay {
  date: string
  temp: number
  rainProb: number
  humidity: number
  desc: string
  status: 'clear' | 'showers' | 'warning'
}

interface WeatherWidgetProps {
  forecast: ForecastDay[]
  selectedDayIdx: number
  setSelectedDayIdx: (idx: number) => void
  activeDay: ForecastDay
  harvestRisk: {
    level: string
    color: string
    tip: string
  }
}

export function WeatherWidget({
  forecast,
  selectedDayIdx,
  setSelectedDayIdx,
  activeDay,
  harvestRisk,
}: WeatherWidgetProps) {
  const navigate = useNavigate()

  return (
    <section id="weather" className="w-full py-24 relative overflow-hidden bg-[#08120E] border-b border-white/[0.04]">
      {/* Decorative environmental image backdrop */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.03]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1504608524841-42584120d693?auto=format&fit=crop&w=1800&q=70')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#08120E] via-[#08120E]/98 to-[#08120E]" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="mb-14 text-left"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] text-[10px] font-black uppercase tracking-[0.2em] w-fit mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
            Chapter 05 · Weather Intelligence
          </div>
          <h2 className="font-display text-white tracking-tight leading-tight text-[2rem] sm:text-[2.6rem] font-black uppercase">
            Climate Intelligence
          </h2>
          <div className="w-12 h-[2.5px] bg-[#43F59A] mt-4 rounded-full" />
        </motion.div>

        {/* Weather Intelligence Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Conditions Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, damping: 18 }}
            className="bg-slate-900/20 rounded-3xl border border-white/[0.06] shadow-2xl p-8 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[5.5rem] font-black text-white leading-none tracking-tighter font-mono">
                  {activeDay.temp}°
                </p>
                <p className="text-zinc-400 text-[14px] font-semibold mt-2">
                  {activeDay.desc} · Kolhapur District
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/[0.08] flex items-center justify-center">
                <CloudSun size={30} className="text-[#43F59A] animate-pulse" />
              </div>
            </div>

            {/* Hyperlocal Agricultural Hazard Alert Box */}
            <div className={`p-4 rounded-2xl border ${harvestRisk.color} mb-6 transition-all duration-300 shadow-sm font-semibold text-[13px]`}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider mb-0.5">{harvestRisk.level}</p>
                  <p className="leading-relaxed">{harvestRisk.tip}</p>
                </div>
              </div>
            </div>

            {/* Detailed Climate Metrics Row */}
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/[0.04]">
              {[
                { icon: <CloudRain size={16} />, label: 'Precipitation', val: `${activeDay.rainProb}%` },
                { icon: <Wind size={16} />, label: 'Wind Speed', val: '14 km/h' },
                { icon: <Droplets size={16} />, label: 'Rel. Humidity', val: `${activeDay.humidity}%` },
              ].map((metric) => (
                <div key={metric.label} className="text-center font-mono">
                  <span className="text-[#43F59A] flex justify-center mb-1.5">
                    {metric.icon}
                  </span>
                  <p className="text-[10px] font-black uppercase text-zinc-350 tracking-wider">
                    {metric.label}
                  </p>
                  <p className="text-[11.5px] text-zinc-400 font-bold mt-1">{metric.val}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 5-Day Forecast Grid List */}
          <div className="flex flex-col gap-3.5">
            {forecast.map((day, idx) => {
              const active = idx === selectedDayIdx
              return (
                <motion.button
                  key={day.date}
                  onClick={() => setSelectedDayIdx(idx)}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className={`flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    active
                      ? 'border-[#2ECC71]/50 bg-slate-900/60 shadow-lg shadow-[#2ECC71]/5'
                      : 'border-white/[0.06] bg-slate-900/20 hover:border-white/[0.12]'
                  }`}
                >
                  <span className="text-[13.5px] font-black text-white w-24 text-left font-mono uppercase tracking-wider">
                    {day.date}
                  </span>
                  <span className="text-[13px] text-zinc-400 font-medium flex-1 text-left">
                    {day.desc}
                  </span>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border font-mono uppercase tracking-wider ${
                        day.status === 'clear'
                          ? 'bg-[#2ECC71]/10 text-[#43F59A] border-[#2ECC71]/20'
                          : day.status === 'showers'
                          ? 'bg-amber-555/10 text-amber-500 border-amber-555/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {day.rainProb}% Rain
                    </span>
                    <span className="text-[14px] font-black text-white w-16 text-right font-mono">
                      {day.temp}°C
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Action button redirecting to main weather dashboard */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate(ROUTES.WEATHER.ROOT)}
            className="px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-wider border border-white/[0.08] bg-white/[0.02] hover:bg-[#2ECC71] hover:text-[#08120E] text-white flex items-center gap-2 mx-auto transition-all group duration-300"
          >
            Climate Intelligence Portal
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
