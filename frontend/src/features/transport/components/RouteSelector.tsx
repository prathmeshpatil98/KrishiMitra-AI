import { motion } from 'framer-motion'
import { Navigation, ShieldCheck, Star, Sparkles, Clock } from 'lucide-react'
import { ComputedRouteItem } from '@/pages/Transport'

interface RouteSelectorProps {
  routes: ComputedRouteItem[]
  selectedId: string
  setSelectedId: (id: string) => void
  quantity: number
}

export function RouteSelector({ routes, selectedId, setSelectedId }: RouteSelectorProps) {
  return (
    <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-5 flex flex-col h-full justify-between shadow-xl">
      
      {/* List Header */}
      <div className="px-1 flex items-center justify-between shrink-0 border-b border-white/[0.06] pb-4 mb-4">
        <h3 className="text-[12px] font-bold text-[#A8B4AF] uppercase tracking-widest flex items-center gap-1.5 font-mono-jb">
          <Sparkles size={13} className="text-[#2ECC71]" /> AI Recommended Routes
        </h3>
        <span className="text-[9px] bg-[#121D18] border border-white/[0.06] text-[#43F59A] px-2 py-0.5 rounded-full font-mono-jb font-semibold">
          {routes.length} Mandis
        </span>
      </div>

      {/* Routes List - Internally Scrollable */}
      <div className="flex-grow overflow-y-auto pr-1 pt-1 flex flex-col gap-3.5 custom-scrollbar">
        {routes.map((r, i) => {
          const isSelected = r.id === selectedId
          
          // Custom tag helper for routes
          let badgeText = "Balanced"
          let badgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20"
          if (r.id === '1') {
            badgeText = "Most Profitable"
            badgeColor = "bg-[#2ECC71]/10 text-[#43F59A] border-[#2ECC71]/20"
          } else if (r.id === '2') {
            badgeText = "Fastest Route"
            badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20"
          } else if (r.id === '3') {
            badgeText = "Optimal Weather"
            badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }

          const totalCost = Math.round(r.totalCostCalculated)
          const profitScore = r.profitScoreCalculated

          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className={`group flex flex-col p-5 rounded-[20px] border transition-all duration-300 relative shrink-0 ${
                isSelected
                  ? 'border-[#2ECC71] bg-[#121D18] shadow-[0_0_24px_rgba(46,204,113,0.06)]'
                  : 'border-white/[0.06] bg-[#0F1714] hover:border-white/10 hover:bg-[#121D18]/50'
              }`}
            >
              {/* Selected State Side Accent line */}
              {isSelected && (
                <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r bg-[#2ECC71]" />
              )}

              {/* Card Title Header */}
              <div className="flex justify-between items-start gap-4 mb-2.5">
                <div className="flex flex-col gap-1">
                  <h4 className="text-[13px] font-bold text-[#F5F7F6] group-hover:text-white transition-colors leading-tight flex items-center gap-1.5 font-mono-jb">
                    {r.name.split(',')[0]}
                    {isSelected && <ShieldCheck size={14} className="text-[#2ECC71] shrink-0 animate-pulse" />}
                  </h4>
                  <div className="flex gap-2 mt-1 items-center">
                    <span className="text-[9px] font-mono-jb text-[#A8B4AF]/60">{r.expectedArrival || '10:30 PM'} arrival</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] text-[#A8B4AF]/60">Road: {r.roadQuality}</span>
                  </div>
                </div>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 font-mono-jb ${badgeColor}`}>
                  {badgeText}
                </span>
              </div>

              {/* Route Statistics Grid - Apple/Tesla style Ticket layout */}
              <div className="grid grid-cols-3 gap-1.5 bg-[#0F1714]/80 border border-white/[0.04] p-3 rounded-2xl mt-2.5 text-center">
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#A8B4AF]/50 uppercase tracking-wider font-semibold font-mono-jb">Distance</span>
                  <span className="text-[12.5px] font-bold text-white mt-1 font-mono-jb leading-none">{r.distance} km</span>
                </div>
                <div className="flex flex-col border-l border-white/[0.06]">
                  <span className="text-[9px] text-[#A8B4AF]/50 uppercase tracking-wider font-semibold font-mono-jb">Duration</span>
                  <span className="text-[12.5px] font-bold text-white mt-1 font-mono-jb leading-none">{r.eta}</span>
                </div>
                <div className="flex flex-col border-l border-white/[0.06]">
                  <span className="text-[9px] text-[#A8B4AF]/50 uppercase tracking-wider font-semibold font-mono-jb">Log Cost</span>
                  <span className="text-[12.5px] font-black text-[#43F59A] mt-1 font-mono-jb leading-none">₹{totalCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Extra details (Confidence, rain risk) */}
              <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-white/[0.03] text-[10px]">
                <span className={`flex items-center gap-1.5 ${
                  r.weather.rainProb > 40
                    ? 'text-[#F59E0B]'
                    : 'text-[#A8B4AF]/60'
                }`}>
                  <Clock size={11} className="text-[#3B82F6]" /> {r.weather.temp}°C · Rain Risk {r.weather.rainProb}%
                </span>
                
                <span className="text-white/60 font-mono-jb font-semibold flex items-center gap-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" /> Score: <span className="text-[#43F59A] font-bold">{profitScore}</span>
                </span>
              </div>

              {/* Buttons Drawer */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.03] opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setSelectedId(r.id)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isSelected 
                      ? 'bg-[#2ECC71] hover:bg-[#28b865] text-white shadow-sm'
                      : 'bg-[#121D18] hover:bg-white/5 text-[#F5F7F6] border border-white/[0.06]'
                  }`}
                >
                  <Navigation size={10} /> {isSelected ? 'Active Route' : 'Select Route'}
                </button>
                <button
                  onClick={() => setSelectedId(r.id)}
                  className="bg-[#121D18] hover:bg-white/5 border border-white/[0.06] text-[#A8B4AF] hover:text-white px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all cursor-pointer"
                >
                  Compare
                </button>
              </div>

            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default RouteSelector
