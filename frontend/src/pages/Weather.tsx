import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wind, Droplets, Thermometer, CloudRain, Sun, Zap, Gauge } from 'lucide-react'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import { useLanguage } from '@/app/providers/LanguageProvider'

// Subcomponents
import { ForecastGrid } from '@/features/weather/components/ForecastGrid'
import { HazardAdvisory } from '@/features/weather/components/HazardAdvisory'

interface HourlyItem {
  time: string
  temp: number
  desc: string
  wind: string
  rain: number
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

const MOCK_FORECAST: ForecastItem[] = [
  {
    date: 'Today',
    temp: 29.5,
    rainProb: 15,
    humidity: 65,
    desc: 'Partly Cloudy',
    status: 'clear',
    wind: '14 km/h',
    uv: 'Moderate (4)',
    sunrise: '06:02 AM',
    sunset: '06:48 PM',
    confidence: '98%',
    hourly: [
      { time: '09:00 AM', temp: 27, desc: '☀️ Clear', wind: '12 km/h', rain: 10 },
      { time: '12:00 PM', temp: 29, desc: '🌤️ Cloudy', wind: '14 km/h', rain: 15 },
      { time: '03:00 PM', temp: 30, desc: '🌤️ Cloudy', wind: '15 km/h', rain: 15 },
      { time: '06:00 PM', temp: 28, desc: '☀️ Clear', wind: '11 km/h', rain: 5 },
      { time: '09:00 PM', temp: 26, desc: '🌙 Clear', wind: '10 km/h', rain: 0 },
    ]
  },
  {
    date: 'Wednesday',
    temp: 30.0,
    rainProb: 10,
    humidity: 60,
    desc: 'Sunny Day',
    status: 'clear',
    wind: '12 km/h',
    uv: 'High (6)',
    sunrise: '06:03 AM',
    sunset: '06:49 PM',
    confidence: '97%',
    hourly: [
      { time: '09:00 AM', temp: 27, desc: '☀️ Sunny', wind: '10 km/h', rain: 5 },
      { time: '12:00 PM', temp: 30, desc: '☀️ Sunny', wind: '12 km/h', rain: 10 },
      { time: '03:00 PM', temp: 31, desc: '☀️ Sunny', wind: '13 km/h', rain: 5 },
      { time: '06:00 PM', temp: 29, desc: '☀️ Sunny', wind: '11 km/h', rain: 0 },
      { time: '09:00 PM', temp: 25, desc: '🌙 Clear', wind: '9 km/h', rain: 0 },
    ]
  },
  {
    date: 'Thursday',
    temp: 28.5,
    rainProb: 40,
    humidity: 75,
    desc: 'Light Showers',
    status: 'showers',
    wind: '18 km/h',
    uv: 'Low (2)',
    sunrise: '06:03 AM',
    sunset: '06:49 PM',
    confidence: '95%',
    hourly: [
      { time: '09:00 AM', temp: 26, desc: '🌤️ Overcast', wind: '14 km/h', rain: 30 },
      { time: '12:00 PM', temp: 28, desc: '🌧️ Showers', wind: '18 km/h', rain: 40 },
      { time: '03:00 PM', temp: 29, desc: '🌧️ Drizzle', wind: '17 km/h', rain: 40 },
      { time: '06:00 PM', temp: 27, desc: '🌤️ Overcast', wind: '15 km/h', rain: 20 },
      { time: '09:00 PM', temp: 24, desc: '🌙 Clear', wind: '12 km/h', rain: 10 },
    ]
  },
  {
    date: 'Friday',
    temp: 27.0,
    rainProb: 65,
    humidity: 85,
    desc: 'Heavy Rain',
    status: 'warning',
    wind: '22 km/h',
    uv: 'Low (1)',
    sunrise: '06:04 AM',
    sunset: '06:50 PM',
    confidence: '94%',
    hourly: [
      { time: '09:00 AM', temp: 25, desc: '🌧️ Rain', wind: '18 km/h', rain: 60 },
      { time: '12:00 PM', temp: 26, desc: '⛈️ Storm', wind: '22 km/h', rain: 75 },
      { time: '03:00 PM', temp: 27, desc: '⛈️ Storm', wind: '20 km/h', rain: 70 },
      { time: '06:00 PM', temp: 25, desc: '🌧️ Rain', wind: '16 km/h', rain: 60 },
      { time: '09:00 PM', temp: 23, desc: '🌙 Wet Mist', wind: '14 km/h', rain: 40 },
    ]
  },
  {
    date: 'Saturday',
    temp: 29.0,
    rainProb: 20,
    humidity: 70,
    desc: 'Scattered Clouds',
    status: 'clear',
    wind: '10 km/h',
    uv: 'Moderate (4)',
    sunrise: '06:05 AM',
    sunset: '06:50 PM',
    confidence: '96%',
    hourly: [
      { time: '09:00 AM', temp: 26, desc: '☀️ Clear', wind: '8 km/h', rain: 15 },
      { time: '12:00 PM', temp: 28, desc: '🌤️ Clouds', wind: '10 km/h', rain: 20 },
      { time: '03:00 PM', temp: 29, desc: '🌤️ Clouds', wind: '11 km/h', rain: 15 },
      { time: '06:00 PM', temp: 27, desc: '☀️ Clear', wind: '9 km/h', rain: 5 },
      { time: '09:00 PM', temp: 24, desc: '🌙 Clear', wind: '8 km/h', rain: 0 },
    ]
  },
]

const ICONS: Record<string, string> = { clear: '☀️', showers: '🌧️', warning: '⛈️' }

// CountUp Animated Counter for Premium SaaS styling
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) {
      setCurrent(end)
      return
    }
    const totalMiliseconds = 800
    const incrementTime = 16
    const numIterations = totalMiliseconds / incrementTime
    const step = (end - start) / numIterations

    const timer = setInterval(() => {
      start += step
      if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
        clearInterval(timer)
        setCurrent(end)
      } else {
        setCurrent(Math.round(start * 10) / 10)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  return <span>{current}{suffix}</span>
}

type ChartMetric = 'temp' | 'rain' | 'humidity' | 'wind'

export function Weather() {
  const { t } = useLanguage()
  const [forecast, setForecast] = useState<ForecastItem[]>(MOCK_FORECAST)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [activeChartMetric, setActiveChartMetric] = useState<ChartMetric>('temp')

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.WEATHER.FORECAST)
      .then((res) => {
        if (res.data?.data?.length) setForecast(res.data.data)
      })
      .catch(() => {})
  }, [])

  const active = forecast[selectedIdx]

  const harvestRisk = useMemo(() => {
    const r = active.rainProb
    if (r > 50)
      return {
        level: 'CRITICAL',
        color: 'border-rose-500/15 bg-[#170e0f] text-rose-400',
        bar: 'bg-rose-500',
        w: '85%',
        tip: 'Delay harvest immediately. High saturation and rain damage hazards active.',
      }
    if (r > 30)
      return {
        level: 'WARNING',
        color: 'border-amber-500/15 bg-[#17140e] text-amber-400',
        bar: 'bg-amber-500',
        w: '50%',
        tip: 'Harvest with caution. Cover harvested crop with tarps.',
      }
    return {
      level: 'OPTIMAL',
      color: 'border-emerald-500/15 bg-[#0e1711] text-emerald-400',
      bar: 'bg-[#2ECC71]',
      w: '20%',
      tip: 'Optimal harvest and sowing conditions verified.',
    }
  }, [active])

  const transitRisk = useMemo(() => {
    const r = active.rainProb
    const h = active.humidity
    if (r > 50)
      return {
        level: 'CRITICAL',
        color: 'border-rose-500/15 bg-[#170e0f] text-rose-400',
        bar: 'bg-rose-500',
        w: '85%',
        tip: 'Hazardous transit. Wet roads and low visibility. Enclosed payload mandatory.',
      }
    if (r > 30 || h > 78)
      return {
        level: 'WARNING',
        color: 'border-amber-500/15 bg-[#17140e] text-amber-400',
        bar: 'bg-amber-500',
        w: '50%',
        tip: 'Caution on wet roads. Cover sugarcane payloads with waterproof sheets.',
      }
    return {
      level: 'OPTIMAL',
      color: 'border-emerald-500/15 bg-[#0e1711] text-emerald-400',
      bar: 'bg-[#2ECC71]',
      w: '20%',
      tip: 'Clear transport corridors. Optimal dispatch conditions verified.',
    }
  }, [active])

  // Chart Interpolator coordinates
  const cW = 520
  const cH = 160
  const padX = 40
  const padY = 30

  const chartPoints = useMemo(() => {
    const dataValues = forecast.map(day => {
      if (activeChartMetric === 'rain') return day.rainProb
      if (activeChartMetric === 'humidity') return day.humidity
      if (activeChartMetric === 'wind') return parseFloat(day.wind)
      return day.temp
    })

    const minV = Math.min(...dataValues) * 0.95
    const maxV = Math.max(...dataValues) * 1.05
    const range = maxV - minV || 1

    return dataValues.map((val, i) => {
      const x = padX + i * ((cW - padX * 2) / (forecast.length - 1))
      const y = cH - padY - ((val - minV) / range) * (cH - padY * 2)
      return { x, y, value: val, label: forecast[i].date.slice(0, 3) }
    })
  }, [forecast, activeChartMetric])

  // Cubic Bezier interpolation path generator for Stripe style smooth graphs
  const curvePath = useMemo(() => {
    if (chartPoints.length === 0) return ""
    let d = `M ${chartPoints[0].x} ${chartPoints[0].y}`
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const cpX1 = (chartPoints[i].x + chartPoints[i + 1].x) / 2
      const cpY1 = chartPoints[i].y
      const cpX2 = (chartPoints[i].x + chartPoints[i + 1].x) / 2
      const cpY2 = chartPoints[i + 1].y
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${chartPoints[i + 1].x} ${chartPoints[i + 1].y}`
    }
    return d
  }, [chartPoints])

  return (
    <div className="w-full flex flex-col bg-[#08120E] text-[#F5F7F6] min-h-screen relative overflow-x-hidden pb-24 font-sans selection:bg-[#2ECC71]/30">
      
      {/* Specular Ambient Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full blur-[160px] bg-gradient-to-b from-[#2ECC71]/4 to-transparent pointer-events-none select-none z-0" />

      {/* Interactive Background Grid */}
      <div className="absolute top-0 left-0 w-full h-[650px] pointer-events-none select-none overflow-hidden opacity-[0.03] z-0">
        <motion.div
          className="w-[200%] h-[200%]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
          animate={{
            x: ['0px', '-48px'],
            y: ['0px', '-48px']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Hero Header */}
      <div className="w-full py-20 border-b border-white/[0.06] relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <p className="text-[#43F59A] text-[10px] font-black uppercase tracking-[0.25em] mb-4.5 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 bg-[#43F59A] rounded-full animate-ping" />
              {t('weather_title')}
            </p>
            <h1 className="text-white tracking-tight leading-[1.05] text-[3.2rem] sm:text-[4.2rem] font-extrabold uppercase bg-gradient-to-r from-[#F5F7F6] via-[#F5F7F6] to-[#A7B1AC] bg-clip-text text-transparent">
              {t('weather_title')}
            </h1>
            <p className="text-[#A7B1AC] text-[15.5px] font-medium max-w-xl leading-relaxed mt-4">
              {t('weather_subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-12 flex flex-col gap-8 relative z-10">
        
        {/* Forecast cards selector */}
        <ForecastGrid
          forecast={forecast}
          selectedIdx={selectedIdx}
          setSelectedIdx={setSelectedIdx}
          icons={ICONS}
        />

        {/* Bento Board Layout Split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          
          {/* Main detailed view index & charts (Left) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Current Conditions Dashboard */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="rounded-[24px] border border-white/[0.06] bg-[#0E1713]/85 p-8 shadow-2xl flex flex-col justify-between backdrop-blur-3xl min-h-[480px]"
              >
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <p className="text-[5.8rem] font-black text-white leading-none tracking-tighter font-mono">
                      <AnimatedCounter value={active.temp} suffix="°" />
                    </p>
                    <p className="text-[#A7B1AC] text-[13.5px] font-bold mt-4 font-mono uppercase tracking-wider">
                      {active.desc} · Karveer Region · {active.date}
                    </p>
                  </div>
                  <div className="text-6xl p-3.5 rounded-[24px] bg-[#111D18] border border-white/[0.06] shadow-lg">
                    {ICONS[active.status]}
                  </div>
                </div>

                {/* Hyperlocal specs grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/[0.06]">
                  {[
                    { icon: <CloudRain size={16} />, label: 'Precipitation Probability', val: active.rainProb, suffix: "%" },
                    { icon: <Wind size={16} />, label: 'Wind Velocity', val: parseFloat(active.wind), suffix: " km/h" },
                    { icon: <Droplets size={16} />, label: 'Humidity Rate', val: active.humidity, suffix: "%" },
                    { icon: <Sun size={16} />, label: 'UV Exposure index', val: parseFloat(active.uv.split(' ')[1].slice(1, -1)), suffix: " UV" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="text-left p-4.5 rounded-[24px] bg-[#111D18]/70 border border-white/[0.06] flex flex-col justify-between"
                    >
                      <span className="text-[#43F59A] mb-3">
                        {metric.icon}
                      </span>
                      <div>
                        <p className="text-[9.5px] font-black uppercase tracking-wider text-zinc-550 font-mono">
                          {metric.label}
                        </p>
                        <p className="text-[16px] font-extrabold text-white mt-1 font-mono">
                          <AnimatedCounter value={metric.val} suffix={metric.suffix} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hourly Outlook timeline */}
                <div className="mt-8 pt-6 border-t border-white/[0.06] text-left">
                  <p className="text-[9.5px] font-black uppercase tracking-widest text-[#43F59A] mb-4.5 font-mono">
                    Hourly Outlook Index
                  </p>
                  <div className="flex gap-4 overflow-x-auto pb-2.5 scrollbar-thin">
                    {active.hourly.map((h, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-[24px] bg-[#111D18]/40 border border-white/[0.06] min-w-[110px] text-center"
                      >
                        <span className="text-[9px] text-[#A7B1AC]/70 font-bold font-mono uppercase">{h.time}</span>
                        <span className="text-xl my-1">{h.desc.split(' ')[0]}</span>
                        <span className="text-[13px] font-black text-white font-mono">{h.temp}°C</span>
                        <span className="text-[9px] text-zinc-500 font-medium font-sans">
                          {h.desc.split(' ').slice(1).join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            {/* 5-Day Climate Outlook Smooth Curve Line Chart */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-[#0E1713]/85 border border-white/[0.06] rounded-[24px] p-8 shadow-2xl backdrop-blur-3xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <p className="text-[13.5px] font-extrabold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                  <Thermometer size={16} className="text-[#43F59A]" /> 5-Day Climate Outlook
                </p>

                {/* Smooth tab selectors */}
                <div className="flex gap-1 p-0.5 bg-[#111D18] border border-white/[0.06] rounded-xl flex-wrap">
                  {([
                    { id: 'temp', label: 'Temperature' },
                    { id: 'rain', label: 'Rainfall' },
                    { id: 'humidity', label: 'Humidity' },
                    { id: 'wind', label: 'Wind' },
                  ] as { id: ChartMetric; label: string }[]).map((tab) => {
                    const isSelected = activeChartMetric === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveChartMetric(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer relative ${
                          isSelected ? 'text-[#08120E] bg-[#43F59A]' : 'text-[#A7B1AC] hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Glowing SVG cubic-bezier smooth interpolated chart */}
              <div className="relative w-full h-[180px] flex items-center justify-center pt-4 select-none">
                <svg viewBox={`0 0 ${cW} ${cH}`} className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide rails */}
                  {[0.25, 0.5, 0.75].map((val) => (
                    <line
                      key={val}
                      x1={padX}
                      y1={cH * val}
                      x2={cW - padX}
                      y2={cH * val}
                      stroke="currentColor"
                      strokeWidth="0.75"
                      strokeDasharray="4 6"
                      className="text-white/5"
                    />
                  ))}

                  {/* Gradient Area Fill under the curve */}
                  {chartPoints.length > 0 && (
                    <path
                      d={`M ${chartPoints[0].x} ${cH - padY} L ${curvePath.slice(2)} L ${chartPoints[chartPoints.length - 1].x} ${cH - padY} Z`}
                      fill="url(#glowGradient)"
                    />
                  )}

                  {/* Bezier Stroke Curve */}
                  <motion.path
                    d={curvePath}
                    fill="none"
                    stroke="#43F59A"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />

                  {/* Curve nodes & labels */}
                  {chartPoints.map((pt, i) => (
                    <g key={i} className="group">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#43F59A"
                        stroke="#08120E"
                        strokeWidth="2.5"
                        className="shadow-lg"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="12"
                        fill="#2ECC71"
                        className="opacity-0 hover:opacity-15 transition-all duration-150 cursor-pointer"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 12}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="800"
                        fill="#F5F7F6"
                        className="font-mono"
                      >
                        {pt.value}{activeChartMetric === 'temp' ? '°' : activeChartMetric === 'wind' ? 'k' : '%'}
                      </text>
                      <text
                        x={pt.x}
                        y={cH - 6}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="#A7B1AC"
                        className="font-mono"
                      >
                        {pt.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

            </motion.div>

            {/* Climate Analytics & Agricultural recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sowing Viability telemetry */}
              <div className="p-6 rounded-[24px] border border-white/[0.06] bg-[#0E1713]/85 text-left">
                <p className="text-[12.5px] font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                  <Gauge size={14} className="text-[#43F59A]" /> Climate Analytics
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono block">Sowing Viability</span>
                    <span className="text-[20px] font-black text-[#43F59A] font-mono mt-1 block">92%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase font-mono block">Evapotranspiration</span>
                    <span className="text-[20px] font-black text-white font-mono mt-1 block">4.2 mm/d</span>
                  </div>
                </div>
              </div>

              {/* Crop suggestions advisory */}
              <div className="p-6 rounded-[24px] border border-white/[0.06] bg-[#0E1713]/85 text-left">
                <p className="text-[12.5px] font-black text-white uppercase tracking-widest font-mono flex items-center gap-2">
                  <Zap size={14} className="text-[#43F59A]" /> Agricultural Recommendation
                </p>
                <p className="text-[12.5px] text-[#A7B1AC] leading-relaxed mt-4.5 font-medium">
                  Ideal conditions for sugarcane sowing. High soil moisture retention ensures rapid germination. Keep drainage clear.
                </p>
              </div>

            </div>

          </div>

          {/* AI advisories and Heatmaps (Right) */}
          <div className="xl:col-span-4">
            <HazardAdvisory
              harvestRisk={harvestRisk}
              transitRisk={transitRisk}
              activeRainProb={active.rainProb}
            />
          </div>

        </div>

      </div>

    </div>
  )
}

export default Weather
