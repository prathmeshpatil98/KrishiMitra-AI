import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, MapPin, Route, Search, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

type CropKey = 'Sugarcane' | 'Paddy' | 'Soybean'

interface MandiItem {
  id: string
  name: string
  crop: string
  price: number
  previousPrice: number
  distance: number
  transportCost: number
  latitude: number
  longitude: number
  arrivalDate: string
}

interface MandiExplorerWidgetProps {
  crop: CropKey
  setCrop: (c: CropKey) => void
  mandis: MandiItem[]
  mandiSearch: string
  setMandiSearch: (s: string) => void
  selectedMandiId: string
  setSelectedMandiId: (id: string) => void
  filteredMandis: MandiItem[]
  activeMandi: MandiItem
  mapUrl: string
}

export function MandiExplorerWidget({
  crop,
  setCrop,
  mandiSearch,
  setMandiSearch,
  selectedMandiId,
  setSelectedMandiId,
  filteredMandis,
  activeMandi,
  mapUrl,
}: MandiExplorerWidgetProps) {
  const navigate = useNavigate()

  // SVG Chart Calculation
  const chartPrices = crop === 'Sugarcane' ? [2980, 3030, 3060, 3110, 3150] : crop === 'Paddy' ? [1950, 2010, 2060, 2100, 2150] : [4200, 4280, 4320, 4390, 4450]
  const cW = 420
  const cH = 150
  const minP = crop === 'Sugarcane' ? 2900 : crop === 'Paddy' ? 1900 : 4100
  const maxP = crop === 'Sugarcane' ? 3200 : crop === 'Paddy' ? 2200 : 4500
  const pts = chartPrices.map((p, i) => ({
    x: 35 + i * ((cW - 70) / 4),
    y: cH - 35 - ((p - minP) / (maxP - minP)) * (cH - 65),
    p,
  }))
  const poly = pts.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <section id="market" className="w-full py-24 bg-[#08120E] border-b border-white/[0.04] relative overflow-hidden">
      {/* Aurora blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-50" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', animation: 'aurora-drift-1 20s ease-in-out infinite' }} />
        <div className="absolute bottom-[5%] right-[-5%] w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-50" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', animation: 'aurora-drift-2 18s ease-in-out infinite' }} />
      </div>
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2.5 mb-14 text-left"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] w-fit shadow-[0_0_14px_rgba(245,158,11,0.12)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Market Analytics
          </div>
          <h2 className="font-display text-white tracking-tight leading-none text-[2.2rem] sm:text-[2.8rem] font-black uppercase">
            Market{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #fbbf24, #34d399)', backgroundSize: '200% 100%', animation: 'gradient-shift 5s ease infinite' }}>Price Index</span>
          </h2>
        </motion.div>

        {/* Tab Filter and Search Bar */}
        <div className="flex flex-wrap gap-4 mb-10 items-center justify-between pb-4 border-b border-white/[0.04]">
          <div className="flex gap-2">
            {(['Sugarcane', 'Paddy', 'Soybean'] as CropKey[]).map((c) => {
              const isActive = crop === c
              const tabColor = c === 'Sugarcane'
                ? isActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]' : 'text-zinc-400 hover:text-emerald-300 border-transparent'
                : c === 'Paddy'
                ? isActive ? 'text-sky-400 bg-sky-500/10 border-sky-500/25 shadow-[0_0_12px_rgba(14,165,233,0.15)]' : 'text-zinc-400 hover:text-sky-300 border-transparent'
                : isActive ? 'text-amber-400 bg-amber-500/10 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]' : 'text-zinc-400 hover:text-amber-300 border-transparent'
              return (
                <button
                  key={c}
                  onClick={() => {
                    setCrop(c)
                    setSelectedMandiId(c === 'Sugarcane' ? '1' : c === 'Paddy' ? '4' : '6')
                  }}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer border ${tabColor}`}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              value={mandiSearch}
              onChange={(e) => setMandiSearch(e.target.value)}
              placeholder="Search regional mandis..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-900/40 border border-white/[0.08] text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#2ECC71] transition-all font-semibold"
            />
          </div>
        </div>

        {/* Structured 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Mandi Cards List */}
          <div className="md:col-span-4 flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-none">
            <AnimatePresence mode="popLayout">
              {filteredMandis.map((m, idx) => {
                const diff = m.price - m.previousPrice
                const active = m.id === selectedMandiId
                return (
                  <motion.button
                    key={m.id}
                    layoutId={`mandiCard-${m.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22, delay: idx * 0.04 }}
                    onClick={() => setSelectedMandiId(m.id)}
                    className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[135px] ${
                      active
                        ? 'border-[#2ECC71]/40 bg-white/[0.02] shadow-xl shadow-[#2ECC71]/2'
                        : 'border-white/[0.04] bg-slate-900/10 hover:border-white/[0.1]'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <p className="text-[13.5px] font-bold text-white leading-snug">
                        {m.name}
                      </p>
                      <span
                        className={`text-[9.5px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                          diff >= 0
                            ? 'bg-[#2ECC71]/10 text-[#43F59A] border-[#2ECC71]/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[12px] mt-4 font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Route size={12} className="text-zinc-550" />
                        {m.distance}km · Fuel: ₹{m.transportCost}
                      </span>
                      <span className="font-bold text-[#43F59A]">
                        ₹{m.price}/Qtl
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/[0.04] flex justify-between items-center text-[10.5px] font-mono text-zinc-500">
                      <span>{m.arrivalDate}</span>
                      <span className="font-black text-[#43F59A] uppercase tracking-wider">
                        Yield: ₹{(m.price * 50 - m.transportCost).toLocaleString()}
                      </span>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Column 2: Map Router */}
          <div className="md:col-span-4 rounded-3xl border border-white/[0.06] overflow-hidden shadow-2xl bg-slate-900/15 flex flex-col justify-between min-h-[500px]">
            <div className="p-4 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01] font-mono">
              <span className="text-[11px] font-black text-[#43F59A] uppercase tracking-wider flex items-center gap-2">
                <MapPin size={13} className="text-[#2ECC71]" /> Map Router
              </span>
              <span className="text-[11px] text-zinc-500 font-bold">{activeMandi.name.split(',')[0]}</span>
            </div>
            
            <div className="h-64 relative bg-zinc-950">
              <iframe
                title="mandi-map"
                src={mapUrl}
                className="absolute inset-0 w-full h-full border-none filter invert hue-rotate-[180deg] opacity-[0.8]"
                loading="lazy"
              />
            </div>

            <div className="p-5 flex flex-col gap-2.5 text-[12.5px] bg-[#08120E]/50 border-t border-white/[0.04] font-medium text-zinc-400">
              {[
                ['Mandi Distance', `${activeMandi.distance} km`],
                ['Estimated Fuel Cost', `₹${activeMandi.transportCost}`],
                ['Mandi Selling Price', `₹${activeMandi.price}/Qtl`],
                ['Net Return (50 Qtl)', `₹${(activeMandi.price * 50 - activeMandi.transportCost).toLocaleString()}`],
              ].map(([k, v]) => {
                const isHighlight = k.includes('Net Return')
                return (
                  <div
                    key={k}
                    className="flex justify-between border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-zinc-500">{k}</span>
                    <span
                      className={`font-mono font-bold ${
                        isHighlight
                          ? 'text-[#43F59A] text-[13.5px]'
                          : 'text-zinc-200'
                      }`}
                    >
                      {v}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Column 3: Rate Trend Chart */}
          <div className="md:col-span-4 rounded-3xl border border-white/[0.06] bg-slate-900/15 shadow-2xl p-6 flex flex-col justify-between min-h-[500px]">
            <div className="flex items-center gap-3.5 border-b border-white/[0.04] pb-4">
              <div className="w-9 h-9 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center">
                <TrendingUp size={16} className="text-[#43F59A]" />
              </div>
              <div>
                <p className="text-[12.5px] font-black text-white uppercase tracking-wider font-mono">
                  {crop} Rate Trend
                </p>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">5-Week historical overview</p>
              </div>
            </div>

            {/* Glowing Custom SVG Line Chart */}
            <div className="flex-1 flex items-center justify-center py-6">
              <svg viewBox={`0 0 ${cW} ${cH}`} className="w-full overflow-visible select-none">
                <defs>
                  <linearGradient id="chartGradientDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                  </linearGradient>
                  <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((val) => (
                  <line
                    key={val}
                    x1="35"
                    y1={cH * val}
                    x2={cW - 35}
                    y2={cH * val}
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeDasharray="4 6"
                    className="text-white/5"
                  />
                ))}

                {/* Fill Area */}
                <path
                  d={`M ${pts[0].x} ${cH - 15} L ${poly} L ${pts[pts.length - 1].x} ${cH - 15} Z`}
                  fill="url(#chartGradientDark)"
                />

                {/* Line Path with glow */}
                <polyline
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={poly}
                  filter="url(#lineGlow)"
                />
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>

                {/* Interactive coordinate points */}
                {pts.map((p, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="4.5"
                      fill="currentColor"
                      stroke="#08120E"
                      strokeWidth="2.5"
                      className="text-[#43F59A] shadow-sm"
                    />
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="9"
                      fill="currentColor"
                      className="text-[#43F59A]/20 opacity-0 hover:opacity-100 transition-opacity duration-200"
                    />
                    {/* Tooltip labels with strict positioning offset to prevent label clash */}
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill="currentColor"
                      className="text-white font-mono"
                    >
                      ₹{p.p}
                    </text>
                    <text
                      x={p.x}
                      y={cH - 6}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="600"
                      fill="currentColor"
                      className="text-zinc-650 font-mono"
                    >
                      W{i + 1}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            
            <p className="text-[10px] text-zinc-550 text-center mt-2.5 font-bold uppercase tracking-wider font-mono border-t border-white/[0.04] pt-3">
              FRP support rates trending upward · Agmarknet verified
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate(ROUTES.MARKET.ROOT)}
            className="px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-wider text-[#08120E] flex items-center gap-2 mx-auto transition-all group duration-300 hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(16,185,129,0.35)] active:scale-[0.98] cursor-pointer"
            style={{ background: 'linear-gradient(90deg, #34d399, #fbbf24)', backgroundSize: '200% 100%', animation: 'gradient-shift 5s ease infinite', boxShadow: '0 4px 20px rgba(16,185,129,0.2)' }}
          >
            Explore Market Dynamics
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
