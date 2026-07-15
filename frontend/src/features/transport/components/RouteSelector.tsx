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

interface RouteSelectorProps {
  routes: RouteItem[]
  selectedId: string
  setSelectedId: (id: string) => void
}

export function RouteSelector({ routes, selectedId, setSelectedId }: RouteSelectorProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <p className="text-[12px] font-black text-text-muted uppercase tracking-widest px-1">
        Available Routes
      </p>
      {routes.map((r, i) => {
        const active = r.id === selectedId
        return (
          <motion.button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 150, damping: 18, delay: i * 0.08 }}
            whileHover={{ x: 3 }}
            className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
              active
                ? 'border-farm-green dark:border-emerald-500/50 bg-farm-green/[0.03] dark:bg-emerald-500/[0.02] shadow-sm'
                : 'border-border/60 dark:border-white/5 bg-white dark:bg-zinc-900/40 hover:border-farm-green/30 dark:hover:border-emerald-500/20'
            }`}
          >
            <div className="flex justify-between items-start mb-3.5">
              <p className="text-[14px] font-extrabold text-text-primary dark:text-zinc-100 leading-tight">
                {r.name}
              </p>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  active
                    ? 'bg-farm-green text-white border-transparent shadow-sm'
                    : 'bg-farm-green/10 text-farm-green border-farm-green/10 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/10'
                }`}
              >
                {r.eta}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[12px] pt-1 border-t border-border/20 dark:border-white/5 mt-3.5 pt-3.5">
              <div>
                <p className="text-text-muted font-medium mb-0.5">Distance</p>
                <p className="font-extrabold text-text-primary dark:text-zinc-200">{r.distance} km</p>
              </div>
              <div>
                <p className="text-text-muted font-medium mb-0.5">Fuel</p>
                <p className="font-extrabold text-text-primary dark:text-zinc-200">₹{r.fuelCost}</p>
              </div>
              <div>
                <p className="text-text-muted font-medium mb-0.5">Total</p>
                <p className="font-black text-farm-green dark:text-emerald-400">₹{r.totalCost}</p>
              </div>
            </div>

            <div
              className={`mt-3.5 pt-3 border-t border-border/20 dark:border-white/5 text-[11px] font-black uppercase tracking-wider ${
                r.weather.rainProb > 50
                  ? 'text-rose-600 dark:text-rose-400'
                  : r.weather.rainProb > 30
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {r.weather.temp}°C · {r.weather.desc} · {r.weather.rainProb}% rain risk
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
export default RouteSelector
