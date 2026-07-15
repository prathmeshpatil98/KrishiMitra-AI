import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const TICKER_ITEMS = [
  { crop: 'Sugarcane', price: '₹3,180/Qtl', change: '+2.1%', up: true,  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { crop: 'Paddy',     price: '₹2,150/Qtl', change: '+1.8%', up: true,  color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  { crop: 'Soybean',   price: '₹4,480/Qtl', change: '+3.4%', up: true,  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { crop: 'Wheat',     price: '₹2,290/Qtl', change: '-0.5%', up: false, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { crop: 'Cotton',    price: '₹6,820/Qtl', change: '+1.2%', up: true,  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { crop: 'Onion',     price: '₹1,840/Qtl', change: '-2.3%', up: false, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { crop: 'Tomato',    price: '₹2,100/Qtl', change: '+4.1%', up: true,  color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { crop: 'Maize',     price: '₹1,980/Qtl', change: '+0.9%', up: true,  color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
]

export function MarketTicker() {
  const doubleItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="w-full py-3.5 overflow-hidden border-y border-white/[0.04] relative z-20"
      style={{ background: 'linear-gradient(90deg, #060E09 0%, #04110A 50%, #060E09 100%)' }}
    >
      {/* Edge fades */}
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#060E09] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#060E09] to-transparent pointer-events-none z-10" />

      {/* Live badge */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest font-mono">Live</span>
      </div>

      <div className="ticker-track">
        {doubleItems.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2.5 px-8 border-r border-white/5 last:border-0 whitespace-nowrap"
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest font-mono">{item.crop}</span>
            <span className="text-white font-extrabold text-[13.5px]">{item.price}</span>
            <span className={`flex items-center gap-0.5 text-[10.5px] font-black px-2 py-0.5 rounded-full border ${item.color}`}>
              {item.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {item.change}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
