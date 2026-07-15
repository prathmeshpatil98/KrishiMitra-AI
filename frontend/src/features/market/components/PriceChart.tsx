import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import { useLanguage } from '@/app/providers/LanguageProvider'

interface PriceChartProps {
  prices: number[]
  cropName: string
  mandiName?: string
}

const LOCAL_LABELS = {
  en: {
    rateTrend: "Rate Trend",
    subLabel: "Interactive historical rates",
    rate: "Rate",
    week: "Week",
    footerText: "FRP support rates trending upward · Agmarknet verified",
  },
  mr: {
    rateTrend: "दर कल (Trend)",
    subLabel: "ऐतिहासिक बाजार भावाचा आलेख",
    rate: "बाजार भाव",
    week: "आठवडा",
    footerText: "FRP आधारभूत किंमती वधारत आहेत · एगमार्कनेट प्रमाणित",
  },
  hi: {
    rateTrend: "दर रुझान (Trend)",
    subLabel: "ऐतिहासिक बाजार भावों का ग्राफ़",
    rate: "बाजार भाव",
    week: "सप्ताह",
    footerText: "FRP आधारभूत दरें बढ़ रही हैं · एगमार्कनेट प्रमाणित",
  }
}

export function PriceChart({ prices, cropName, mandiName }: PriceChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const { language } = useLanguage()
  const lang = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en'
  const labels = LOCAL_LABELS[lang]

  const cW = 500
  const cH = 180
  const padX = 40
  const padY = 35

  // Calculate dynamic boundaries
  const minP = Math.min(...prices) * 0.98
  const maxP = Math.max(...prices) * 1.02
  const range = maxP - minP

  const pts = prices.map((p, i) => {
    const x = padX + i * ((cW - padX * 2) / (prices.length - 1))
    const y = cH - padY - ((p - minP) / range) * (cH - padY * 2)
    return { x, y, price: p, label: language === 'mr' ? `${labels.week} ${i + 1}` : language === 'hi' ? `${labels.week} ${i + 1}` : `Week ${i + 1}` }
  })

  const poly = pts.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="rounded-[32px] border border-white/[0.05] bg-white/[0.01] shadow-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group font-sans">
      
      {/* Background radial highlight */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-radial-glow select-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(46,204,113,0.015) 0%, transparent 60%)',
        }}
      />

      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-[#43F59A]" />
          </div>
          <div>
            <p className="text-[14px] font-extrabold text-white">
              {cropName} {labels.rateTrend}
            </p>
            <p className="text-[11px] text-zinc-500 font-medium">{mandiName ? mandiName : labels.subLabel}</p>
          </div>
        </div>

        {hoveredIdx !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-right"
          >
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">{labels.rate}</p>
            <p className="text-[15px] font-black text-[#43F59A]">
              ₹{pts[hoveredIdx].price}/Qtl
            </p>
          </motion.div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 flex items-center justify-center py-4">
        <svg viewBox={`0 0 ${cW} ${cH}`} className="w-full overflow-visible select-none">
          <defs>
            <linearGradient id="mktGradientDarkGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
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

          {/* Fill under the curve */}
          <path
            d={`M ${pts[0].x} ${cH - padY} L ${poly} L ${pts[pts.length - 1].x} ${cH - padY} Z`}
            fill="url(#mktGradientDarkGlow)"
          />

          {/* Path Line */}
          <motion.polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={poly}
            className="text-[#43F59A]"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Vertical Hover Guideline */}
          {hoveredIdx !== null && (
            <line
              x1={pts[hoveredIdx].x}
              y1={padY}
              x2={pts[hoveredIdx].x}
              y2={cH - padY}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="text-[#43F59A]/30"
            />
          )}

          {/* Interactive coordinates */}
          {pts.map((p, i) => {
            const isHovered = hoveredIdx === i
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 7.5 : 4.5}
                  fill="currentColor"
                  stroke="#08120E"
                  strokeWidth="2.5"
                  className="text-[#43F59A] transition-all duration-150 shadow-md"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="18"
                  fill="transparent"
                  className="hover:fill-[#2ECC71]/5"
                />
                <text
                  x={p.x}
                  y={cH - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="currentColor"
                  className="text-zinc-500 font-mono"
                >
                  W{i + 1}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <p className="text-[11px] text-zinc-500 text-center mt-2 font-bold uppercase tracking-wider font-mono border-t border-white/[0.04] pt-3">
        {labels.footerText}
      </p>
    </div>
  )
}
export default PriceChart
