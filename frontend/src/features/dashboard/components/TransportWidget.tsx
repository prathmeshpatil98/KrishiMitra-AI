import { motion } from 'framer-motion'
import { MapPin, Route, Fuel, Milestone, Coins, Clock } from 'lucide-react'

interface RouteItem {
  id: string
  name: string
  distance: number
  eta: string
  fuelCost: number
  tollCost: number
  totalCost: number
}

interface TransportWidgetProps {
  routes: RouteItem[]
  selectedRouteId: string
  setSelectedRouteId: (id: string) => void
  activeRoute: RouteItem
  routeMapUrl: string
}

export function TransportWidget({
  routes,
  selectedRouteId,
  setSelectedRouteId,
  activeRoute,
  routeMapUrl,
}: TransportWidgetProps) {
  return (
    <section id="transport" className="w-full py-28 bg-[#08120E] border-b border-white/[0.04]">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-left"
        >
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/25 text-[#43F59A] text-[9.5px] font-black uppercase tracking-[0.2em] w-fit mb-4 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
            04 // Logistics Optimization
          </div>
          <h2 className="text-white tracking-tight leading-[1.1] text-[2.5rem] sm:text-[3.2rem] font-extrabold uppercase">
            Logistics Routing Optimizer
          </h2>
          <p className="text-zinc-400 text-[14.5px] mt-4 max-w-lg font-medium leading-relaxed">
            Configure transit matrices, analyze fuel allocations, and coordinate optimal freight routes to peak local APMC yards.
          </p>
        </motion.div>

        {/* Transport Split Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Route Listing Options (Left) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-none">
            {routes.map((r, idx) => {
              const active = r.id === selectedRouteId
              return (
                <motion.button
                  key={r.id}
                  onClick={() => setSelectedRouteId(r.id)}
                  whileHover={{ x: 2 }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[135px] ${
                    active
                      ? 'border-[#2ECC71]/40 bg-white/[0.02] shadow-xl shadow-[#2ECC71]/2'
                      : 'border-white/[0.04] bg-slate-900/10 hover:border-white/[0.1]'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-[13.5px] font-bold text-white leading-snug">
                      {r.name}
                    </p>
                    <span className="text-[10px] bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 font-mono">
                      {r.eta}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] mt-4 pt-3 border-t border-white/[0.04] text-zinc-400 font-medium">
                    <div>
                      <p className="text-zinc-550 font-bold mb-0.5 uppercase tracking-widest text-[8px] font-mono">Distance</p>
                      <p className="font-extrabold text-zinc-200 text-[12px]">
                        {r.distance} km
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-555 font-bold mb-0.5 uppercase tracking-widest text-[8px] font-mono">Fuel Cost</p>
                      <p className="font-extrabold text-zinc-200 text-[12px]">
                        ₹{r.fuelCost}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-555 font-bold mb-0.5 uppercase tracking-widest text-[8px] font-mono">Haulage</p>
                      <p className="font-extrabold text-[#43F59A] text-[12px]">
                        ₹{r.totalCost}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Column 2: Route Map & Details (Right) */}
          <div className="lg:col-span-8 rounded-[32px] border border-white/[0.06] overflow-hidden shadow-2xl bg-slate-900/15 flex flex-col justify-between min-h-[500px]">
            
            {/* Map Header */}
            <div className="p-5 border-b border-white/[0.04] bg-white/[0.01] flex justify-between items-center font-mono">
              <span className="text-[12px] font-black text-[#43F59A] uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} className="text-[#2ECC71]" /> {activeRoute.name.split(',')[0]}
              </span>
              <div className="flex items-center gap-4 text-[11.5px] text-zinc-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Route size={13} className="text-zinc-500" /> {activeRoute.distance} km
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-zinc-500" /> {activeRoute.eta}
                </span>
                <span className="text-[#43F59A] font-black">
                  ₹{activeRoute.totalCost}
                </span>
              </div>
            </div>

            {/* Map iframe */}
            <div className="flex-1 relative bg-zinc-950 min-h-[280px]">
              <iframe
                title="route-map"
                src={routeMapUrl}
                className="absolute inset-0 w-full h-full border-none filter invert hue-rotate-[180deg] opacity-[0.82]"
                loading="lazy"
              />
            </div>

            {/* Expense breakdown cards */}
            <div className="p-6 grid grid-cols-3 gap-5 bg-[#08120E]/50 border-t border-white/[0.04]">
              {[
                { label: 'Fuel Matrix', val: `₹${activeRoute.fuelCost}`, icon: Fuel, color: 'text-[#2ECC71]' },
                { label: 'Toll Charges', val: `₹${activeRoute.tollCost}`, icon: Milestone, color: 'text-zinc-400' },
                { label: 'Transit Total', val: `₹${activeRoute.totalCost}`, icon: Coins, color: 'text-[#43F59A]', highlight: true },
              ].map((expense) => {
                const IconComponent = expense.icon
                return (
                  <div
                    key={expense.label}
                    className={`p-4 rounded-2xl flex flex-col justify-center items-center gap-1.5 transition-all border ${
                      expense.highlight
                        ? 'bg-[#2ECC71]/5 border-[#2ECC71]/35 shadow-lg shadow-[#2ECC71]/2'
                        : 'bg-white/[0.02] border-white/[0.04]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${expense.color}`}>
                      <IconComponent size={14} className="stroke-[2.5]" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 font-mono">
                      {expense.label}
                    </p>
                    <p className={`text-[15px] font-extrabold ${expense.color}`}>
                      {expense.val}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default TransportWidget
