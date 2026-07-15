import { motion } from 'framer-motion'
import { Calendar, ChevronRight } from 'lucide-react'

interface SchemeItem {
  id: string
  name: string
  provider: 'Central' | 'State'
  category: string
  benefits: string
  eligibility: string
  documents: string[]
  deadline: string
  website: string
  icon: string
}

interface SchemeCardProps {
  scheme: SchemeItem
  idx: number
  active: boolean
  onClick: () => void
}

export function SchemeCard({ scheme, idx, active, onClick }: SchemeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, duration: 0.5 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="farm-service-card cursor-pointer group flex flex-col justify-between items-start glass-panel-light dark:glass-panel-dark h-full relative"
    >
      <span className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-gold-DEFAULT to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Gold badge */}
      <div className="gold-badge-circle float-el mb-6 text-2xl bg-gold-DEFAULT/10 border border-gold-DEFAULT/30 backdrop-blur-sm group-hover:bg-gold-DEFAULT group-hover:text-farm-green transition-all duration-300" style={{ animationDuration: `${3.5 + idx * 0.5}s` }}>
        <span>{scheme.icon}</span>
      </div>

      <div className="flex flex-col gap-3 flex-1 w-full">
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border w-fit ${
            scheme.provider === 'Central'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
          }`}
        >
          ✓ Eligible · {scheme.provider} Govt
        </span>
        <h3 className="text-text-primary font-extrabold text-[15.5px] leading-snug group-hover:text-gold-DEFAULT transition-colors">
          {scheme.name}
        </h3>
        <div className="gold-underline w-6 group-hover:w-10 transition-all duration-300" />
        <p className="text-text-secondary text-[12.5px] leading-relaxed font-medium line-clamp-2 mt-1">
          {scheme.benefits}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-bold mt-5 mb-3">
        <Calendar size={11} /> {scheme.deadline}
      </div>

      <div className="flex items-center gap-1 text-gold-DEFAULT text-[12.5px] font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
        {active ? 'Close Details' : 'View Details'}{' '}
        <ChevronRight
          size={13}
          className={`mt-0.5 transition-transform duration-200 ${active ? 'rotate-90' : ''}`}
        />
      </div>
    </motion.div>
  )
}
export default SchemeCard
