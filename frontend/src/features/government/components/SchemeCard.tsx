import { motion } from 'framer-motion'
import { Calendar, ChevronRight, Bookmark, ArrowRightLeft, Star } from 'lucide-react'
import { SchemeItem } from '@/pages/Government'

interface SchemeCardProps {
  scheme: SchemeItem
  idx: number
  active: boolean
  onClick: () => void
}

const CATEGORY_LABEL_MAP: Record<string, string> = {
  'Financial Subsidies': 'Income Support',
  'Crop Insurance': 'Risk Protection',
  'Equipment': 'Farm Mechanization',
  'Soil & Water': 'Natural Resource Programs'
}

export function SchemeCard({ scheme, idx, active, onClick }: SchemeCardProps) {
  
  // Custom mock values to fit the high-fidelity enterprise target requirements
  const eligibilityScore = 98 - (idx * 2)
  const aiMatchPct = 95 + (idx % 3)
  const processingTime = idx % 2 === 0 ? '14 Days' : '7 Days'
  const confidenceScore = 96 - (idx * 1.5)
  const priorityBadge = idx === 0 ? 'High Priority' : 'Standard'

  // Extract a clean benefit label
  let benefitLabel = "₹6,000 / Year"
  if (scheme.id === '2') benefitLabel = "Crop Coverage"
  if (scheme.id === '3') benefitLabel = "40–50% Subsidy"
  if (scheme.id === '4') benefitLabel = "Nutrient Analysis"
  if (scheme.id === '5') benefitLabel = "60% Solar Pump"
  if (scheme.id === '6') benefitLabel = "₹5,000 / Hectare"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, duration: 0.5 }}
      whileHover={{ y: -3 }}
      className={`relative cursor-pointer group flex flex-col justify-between p-5 rounded-[24px] border transition-all duration-300 h-full overflow-hidden ${
        active 
          ? 'bg-[#16221C] border-[#2ECC71] shadow-[0_0_24px_rgba(46,204,113,0.08)]' 
          : 'bg-[#101915] border-white/[0.06] hover:border-white/10 hover:bg-[#16221C]/50 shadow-lg'
      }`}
      onClick={onClick}
    >
      
      {/* Animated border line */}
      <span className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#2ECC71] to-[#43F59A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Card Header */}
      <div className="flex justify-between items-start gap-4 mb-3.5 w-full shrink-0">
        
        {/* Emblem/Icon */}
        <div className="w-11 h-11 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-2xl group-hover:bg-[#2ECC71]/10 group-hover:border-[#2ECC71]/20 transition-all duration-300">
          <span>{scheme.icon}</span>
        </div>

        {/* Badges Column */}
        <div className="flex flex-col gap-1.5 items-end">
          <span
            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              scheme.provider === 'Central'
                ? 'bg-blue-500/10 text-[#3B82F6] border-blue-500/20'
                : 'bg-amber-500/10 text-[#F4B740] border-amber-500/20'
            }`}
          >
            {scheme.provider} Govt
          </span>
          <span className="text-[9px] bg-[#2ECC71]/10 text-[#43F59A] border border-[#2ECC71]/25 px-2 py-0.5 rounded-full font-bold">
            AI Verified
          </span>
        </div>

      </div>

      {/* Scheme Title & Details */}
      <div className="flex flex-col gap-2 flex-grow w-full">
        
        <div className="flex justify-between items-baseline gap-2">
          <span className="text-[9.5px] text-[#A8B4AF]/60 uppercase tracking-widest font-mono-jb">
            {CATEGORY_LABEL_MAP[scheme.category] || scheme.category}
          </span>
          {priorityBadge === 'High Priority' && (
            <span className="text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase font-bold font-mono-jb">
              High
            </span>
          )}
        </div>

        <h3 className="text-[#F8FAF8] font-extrabold text-[15px] leading-snug group-hover:text-[#43F59A] transition-colors font-sans">
          {scheme.name}
        </h3>
        
        <p className="text-[#A8B4AF] text-[12px] leading-relaxed font-light line-clamp-2 mt-1">
          {scheme.benefits}
        </p>

        {/* Premium Grid Statistics - Apple Style */}
        <div className="grid grid-cols-3 gap-2 bg-[#08120E]/50 border border-white/[0.04] p-3 rounded-2xl mt-4 text-center">
          <div className="flex flex-col">
            <span className="text-[8.5px] text-[#A8B4AF]/50 uppercase tracking-wider font-semibold font-mono-jb">Benefit</span>
            <span className="text-[12.5px] font-black text-white mt-1 font-mono-jb leading-none">{benefitLabel}</span>
          </div>
          <div className="flex flex-col border-l border-white/[0.06]">
            <span className="text-[8.5px] text-[#A8B4AF]/50 uppercase tracking-wider font-semibold font-mono-jb">AI Match</span>
            <span className="text-[12.5px] font-bold text-[#43F59A] mt-1 font-mono-jb leading-none">{aiMatchPct}%</span>
          </div>
          <div className="flex flex-col border-l border-white/[0.06]">
            <span className="text-[8.5px] text-[#A8B4AF]/50 uppercase tracking-wider font-semibold font-mono-jb">Proc. Time</span>
            <span className="text-[12.5px] font-bold text-white mt-1 font-mono-jb leading-none">{processingTime}</span>
          </div>
        </div>

      </div>

      {/* Footer Info & Details link */}
      <div className="flex justify-between items-center mt-5 pt-3.5 border-t border-white/[0.03] w-full text-[10px] text-[#A8B4AF]/60 font-mono-jb shrink-0">
        <span className="flex items-center gap-1">
          <Calendar size={11} className="text-[#3B82F6]" /> {scheme.deadline.split(' - ')[0]}
        </span>
        <span className="flex items-center gap-1 font-semibold text-white/70">
          <Star size={9} className="text-yellow-400 fill-yellow-400" /> Score: {eligibilityScore} · Conf: {confidenceScore}%
        </span>
      </div>

      {/* Button drawer: View Details / Open Scheme & Actions */}
      <div className="flex gap-2 mt-4 pt-3.5 border-t border-white/[0.03] w-full shrink-0 items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 ${
            active 
              ? 'bg-[#2ECC71] text-white'
              : 'bg-[#16221C] border border-white/[0.06] text-white hover:bg-white/5'
          }`}
        >
          {active ? 'Close Program' : 'Open Scheme'} 
          <ChevronRight size={12} className={`transition-transform ${active ? 'rotate-90' : ''}`} />
        </button>

        <button 
          onClick={(e) => e.stopPropagation()} 
          className="w-8 h-8 rounded-xl bg-[#16221C] border border-white/[0.06] flex items-center justify-center hover:bg-white/5 text-[#A8B4AF] hover:text-white"
        >
          <Bookmark size={12} />
        </button>

        <button 
          onClick={(e) => e.stopPropagation()} 
          className="w-8 h-8 rounded-xl bg-[#16221C] border border-white/[0.06] flex items-center justify-center hover:bg-white/5 text-[#A8B4AF] hover:text-white"
        >
          <ArrowRightLeft size={12} />
        </button>

      </div>

    </motion.div>
  )
}

export default SchemeCard
