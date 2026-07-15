import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const TICKER_ITEMS = [
  { crop: 'Sugarcane', price: '₹3,180/Qtl', change: '+2.1%', up: true },
  { crop: 'Paddy',     price: '₹2,150/Qtl', change: '+1.8%', up: true },
  { crop: 'Soybean',   price: '₹4,480/Qtl', change: '+3.4%', up: true },
  { crop: 'Wheat',     price: '₹2,290/Qtl', change: '-0.5%', up: false },
  { crop: 'Cotton',    price: '₹6,820/Qtl', change: '+1.2%', up: true },
  { crop: 'Onion',     price: '₹1,840/Qtl', change: '-2.3%', up: false },
  { crop: 'Tomato',    price: '₹2,100/Qtl', change: '+4.1%', up: true },
  { crop: 'Maize',     price: '₹1,980/Qtl', change: '+0.9%', up: true },
]

export function MarketTicker() {
  const doubleItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="w-full bg-[#040E06] py-3.5 overflow-hidden border-y border-white/[0.04] relative z-20">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#040E06] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#040E06] to-transparent pointer-events-none z-10" />
      <div className="ticker-track">
        {doubleItems.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2.5 px-8 border-r border-white/5 last:border-0 whitespace-nowrap"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span className="text-zinc-555 text-[11px] font-black uppercase tracking-widest font-mono">{item.crop}</span>
            <span className="text-white font-extrabold text-[14px]">{item.price}</span>
            <span
              className={`flex items-center gap-0.5 text-[11px] font-black px-2 py-0.5 rounded-full ${
                item.up
                  ? 'bg-[#2ECC71]/10 text-[#43F59A] border border-[#2ECC71]/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {item.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {item.change}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
