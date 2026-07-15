import { motion, AnimatePresence } from 'framer-motion'
import { Route, TrendingUp, TrendingDown, Fuel, Calendar, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/app/providers/LanguageProvider'

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

interface MandiListProps {
  filteredMandis: MandiItem[]
  selectedId: string
  setSelectedId: (id: string) => void
  isMarathi?: boolean
}

const LOCAL_CROP_NAMES: Record<string, Record<string, string>> = {
  Sugarcane: { en: 'Sugarcane', mr: 'ऊस',       hi: 'गन्ना'    },
  Paddy:     { en: 'Paddy',     mr: 'धान',       hi: 'धान'      },
  Soybean:   { en: 'Soybean',   mr: 'सोयाबीन',  hi: 'सोयाबीन'  },
  Onion:     { en: 'Onion',     mr: 'कांदा',    hi: 'प्याज़'   },
  Tomato:    { en: 'Tomato',    mr: 'टोमॅटो',   hi: 'टमाटर'    },
  Apple:     { en: 'Apple',     mr: 'सफरचंद',  hi: 'सेब'      },
}

const LOCAL_LABELS = {
  en: {
    livePrice: "Live Market Price",
    projectedRevenue: "Projected Revenue",
    projectedProfit: "Projected Profit",
    today: "Today",
    yesterday: "Yesterday",
    distance: "Distance",
    transport: "Transport",
    accuracy: "Accuracy",
    openStatus: "Open for trade",
    grossReturnTip: "Gross 50 Qtl yield",
    netReturnTip: "Net profit post transit",
  },
  mr: {
    livePrice: "थेट बाजार भाव",
    projectedRevenue: "प्रक्षेपित महसूल",
    projectedProfit: "प्रक्षेपित नफा",
    today: "आज",
    yesterday: "काल",
    distance: "अंतर",
    transport: "वाहतूक खर्च",
    accuracy: "तंतोतंतपणा",
    openStatus: "व्यवहारासाठी सुरू",
    grossReturnTip: "५० क्विंटलवर सकल उत्पन्न",
    netReturnTip: "वाहतूक खर्च वजा जाता नफा",
  },
  hi: {
    livePrice: "लाइव बाज़ार मूल्य",
    projectedRevenue: "अनुमानित आय",
    projectedProfit: "अनुमानित लाभ",
    today: "आज",
    yesterday: "कल",
    distance: "दूरी",
    transport: "परिवहन लागत",
    accuracy: "सटीकता",
    openStatus: "व्यापार के लिए खुला",
    grossReturnTip: "50 क्विंटल पर सकल आय",
    netReturnTip: "परिवहन के बाद शुद्ध लाभ",
  }
}

// Enterprise SaaS Metrics
const CROP_METRICS: Record<string, { confidence: string; roi: string }> = {
  Sugarcane: { confidence: '98%', roi: '4.5x ROI' },
  Paddy:     { confidence: '95%', roi: '3.8x ROI' },
  Soybean:   { confidence: '97%', roi: '4.2x ROI' },
}

export function MandiList({ filteredMandis, selectedId, setSelectedId }: Omit<MandiListProps, 'isMarathi'>) {
  const { language } = useLanguage()
  const lang = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en'
  const labels = LOCAL_LABELS[lang]

  return (
    <div className="flex flex-col gap-4 font-sans text-left">
      <AnimatePresence mode="popLayout">
        {filteredMandis.map((m, i) => {
          const diff = m.price - m.previousPrice
          const isActive = m.id === selectedId
          
          const translatedCrop = LOCAL_CROP_NAMES[m.crop] ? LOCAL_CROP_NAMES[m.crop][lang] : m.crop
          const translatedDate = m.arrivalDate === 'Today' ? labels.today : m.arrivalDate === 'Yesterday' ? labels.yesterday : m.arrivalDate
          
          // Crop specific metrics
          const metrics = CROP_METRICS[m.crop] || { confidence: '96%', roi: '4.0x ROI' }

          return (
            <motion.button
              key={m.id}
              layoutId={`marketMandi-${m.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22, delay: i * 0.03 }}
              onClick={() => setSelectedId(m.id)}
              className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col gap-5 w-full ${
                isActive
                  ? 'border-[#2ECC71]/40 border-l-4 border-l-[#2ECC71] bg-white/[0.02] shadow-2xl shadow-[#2ECC71]/2 scale-[1.01]'
                  : 'border-white/[0.04] bg-slate-900/10 hover:border-white/[0.1] hover:bg-slate-900/15'
              }`}
            >
              {/* Row 1: Header (Mandi name, Crop badge, Confidence Score) */}
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3">
                  <p className="font-extrabold text-white text-[15.5px] tracking-tight">
                    {m.name}
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] px-2.5 py-0.5 rounded-full font-mono">
                    {translatedCrop}
                  </span>
                </div>

                {/* Confidence Accuracy telemetry tag */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-bold font-mono">
                  <ShieldCheck size={11.5} className="text-[#43F59A]" />
                  <span>{metrics.confidence} {labels.accuracy}</span>
                </div>
              </div>

              {/* Row 2: 3-Column Financial index grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/[0.04] w-full">
                
                {/* Column 1: Live Market Price */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-widest font-mono">
                    {labels.livePrice}
                  </p>
                  <p className="text-[17px] font-black text-white mt-1">
                    ₹{m.price}/Qtl
                  </p>
                  <span
                    className={`flex items-center gap-0.5 text-[9.5px] font-bold px-2 py-0.5 rounded-full border w-fit font-mono mt-1.5 ${
                      diff >= 0
                        ? 'bg-[#2ECC71]/10 text-[#43F59A] border-[#2ECC71]/15'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/15'
                    }`}
                  >
                    {diff >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                  </span>
                </div>

                {/* Column 2: Projected Revenue (Gross) */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-widest font-mono">
                    {labels.projectedRevenue}
                  </p>
                  <p className="text-[17px] font-black text-zinc-200 mt-1">
                    ₹{(m.price * 50).toLocaleString()}
                  </p>
                  <span className="text-[10px] text-zinc-550 font-medium mt-1">
                    {labels.grossReturnTip}
                  </span>
                </div>

                {/* Column 3: Projected Profit (Net + ROI) */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-widest font-mono">
                    {labels.projectedProfit}
                  </p>
                  <p className="text-[17px] font-black text-[#43F59A] mt-1 drop-shadow-[0_0_12px_rgba(67,245,154,0.12)]">
                    ₹{(m.price * 50 - m.transportCost).toLocaleString()}
                  </p>
                  
                  {/* ROI Tag badge */}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[10px] text-zinc-500 font-medium">
                      {labels.netReturnTip}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#43F59A]/10 text-[#43F59A] rounded-md font-mono">
                      {metrics.roi}
                    </span>
                  </div>
                </div>

              </div>

              {/* Row 3: Footer details */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-4 border-t border-white/[0.04] text-[11px] font-mono text-zinc-500">
                <div className="flex flex-wrap gap-4 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Route size={12} className="text-zinc-600" /> 
                    {labels.distance}: {m.distance} km
                  </span>
                  
                  <span className="flex items-center gap-1.5">
                    <Fuel size={12} className="text-zinc-600" />
                    {labels.transport}: ₹{m.transportCost}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-zinc-655" />
                    {translatedDate}
                  </span>
                </div>

                {/* Trade Availability Beacon Status indicator */}
                <div className="flex items-center gap-1.5 text-zinc-400 font-bold uppercase tracking-wider text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-ping" />
                  {labels.openStatus}
                </div>
              </div>

            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
export default MandiList
