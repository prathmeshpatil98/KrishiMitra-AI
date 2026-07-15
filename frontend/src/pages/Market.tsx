import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft, ArrowUpDown, Bell, Zap, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import { ROUTES } from '@/constants/routes'
import { useLanguage } from '@/app/providers/LanguageProvider'

// Subcomponents
import { PriceChart } from '@/features/market/components/PriceChart'
import { MandiList } from '@/features/market/components/MandiList'

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

const MOCK: MandiItem[] = [
  // Crops
  { id: '1', name: 'APMC Yard, Kolhapur',         crop: 'Sugarcane', price: 3150, previousPrice: 3080, distance: 8.2, transportCost: 120, latitude: 16.7032, longitude: 74.2498, arrivalDate: 'Today' },
  { id: '2', name: 'Shahupuri Bhaji Market',       crop: 'Sugarcane', price: 3180, previousPrice: 3120, distance: 1.5, transportCost: 14,  latitude: 16.7061, longitude: 74.2385, arrivalDate: 'Today' },
  { id: '3', name: 'Sane Guruji Vegetable Market', crop: 'Sugarcane', price: 3110, previousPrice: 3110, distance: 5.4, transportCost: 49,  latitude: 16.6811, longitude: 74.2185, arrivalDate: 'Yesterday' },
  { id: '4', name: 'Kalamba Wholesale Market',     crop: 'Paddy',     price: 2150, previousPrice: 2100, distance: 6.8, transportCost: 61,  latitude: 16.6775, longitude: 74.2255, arrivalDate: 'Today' },
  { id: '5', name: 'Padalkar Market, Kolhapur',   crop: 'Paddy',     price: 2100, previousPrice: 2150, distance: 4.2, transportCost: 38,  latitude: 16.6974, longitude: 74.2098, arrivalDate: 'Today' },
  { id: '6', name: 'APMC Yard, Kolhapur',          crop: 'Soybean',   price: 4450, previousPrice: 4380, distance: 8.2, transportCost: 120, latitude: 16.7032, longitude: 74.2498, arrivalDate: 'Today' },
  { id: '7', name: 'Shahupuri Bhaji Market',       crop: 'Soybean',   price: 4480, previousPrice: 4420, distance: 1.5, transportCost: 14,  latitude: 16.7061, longitude: 74.2385, arrivalDate: 'Today' },
  
  // Vegetables
  { id: '8', name: 'APMC Onion Yard, Lasalgaon',   crop: 'Onion',     price: 1850, previousPrice: 1800, distance: 345, transportCost: 4800, latitude: 20.1432, longitude: 74.2231, arrivalDate: 'Today' },
  { id: '9', name: 'Narayangaon Tomato Market',    crop: 'Tomato',    price: 2200, previousPrice: 2280, distance: 275, transportCost: 3900, latitude: 19.1121, longitude: 73.9785, arrivalDate: 'Today' },
  
  // Fruits
  { id: '10', name: 'APMC Vashi Market, Mumbai',    crop: 'Apple',     price: 7800, previousPrice: 7650, distance: 385, transportCost: 5400, latitude: 19.0732, longitude: 73.0082, arrivalDate: 'Today' },
]

const HIST_SUGARCANE = [2960, 3010, 3060, 3110, 3150]
const HIST_PADDY = [1980, 2030, 2080, 2120, 2150]
const HIST_SOYBEAN = [4250, 4310, 4370, 4420, 4480]
const HIST_ONION = [1720, 1750, 1780, 1820, 1850]
const HIST_TOMATO = [2400, 2350, 2300, 2250, 2200]
const HIST_APPLE = [7400, 7500, 7600, 7700, 7800]

const TRANSLATIONS = {
  en: {
    eyebrow: "Western Maharashtra Node",
    title: "Market Intelligence",
    subtitle: "Real-time western Maharashtra APMC rates, freight routes, and projected margins.",
    searchPlaceholder: "Search markets or commodities...",
    all: "All",
    sugarcane: "Sugarcane",
    paddy: "Paddy",
    soybean: "Soybean",
    onion: "Onion",
    tomato: "Tomato",
    apple: "Apple",
    distance: "Transit Distance",
    tollCost: "Transport Cost",
    sellingPrice: "Live Market Price",
    netProfit: "Projected Profit",
    netReturnTip: "Net return on 50 Qtl payload",
    rateTrend: "Price Index Trend",
    fiveWeekOverview: "5-Week historical overview",
    backButton: "Dashboard",
    sortBy: "Index Sort",
    sortProfit: "Projected Profit",
    sortPrice: "Live Price",
    sortDistance: "Physical Distance",
    alertText: "Lasalgaon onion rates surging (+4.6% delta) due to export changes. Check logistics options.",
    logisticsIntel: "Logistics Intelligence",
    aiInsightTitle: "AI Logistics Advisory",
    aiInsightDesc: "Route optimal. High density transit recommended. Cover cargo payloads to prevent moisture.",
  },
  mr: {
    eyebrow: "पश्चिम महाराष्ट्र विभाग",
    title: "बाजार बुद्धिमत्ता",
    subtitle: "पश्चिम महाराष्ट्रातील थेट बाजार समिती दर, वाहतूक खर्च आणि अंदाजे निव्वळ नफा.",
    searchPlaceholder: "बाजार किंवा पीक शोधा...",
    all: "सर्व",
    sugarcane: "ऊस",
    paddy: "धान",
    soybean: "सोयाबीन",
    onion: "कांदा",
    tomato: "टोमॅटो",
    apple: "सफरचंद",
    distance: "वाहतूक अंतर",
    tollCost: "वाहतूक खर्च",
    sellingPrice: "थेट बाजार भाव",
    netProfit: "प्रक्षेपित नफा",
    netReturnTip: "५० क्विंटल उत्पन्नावर निव्वळ नफा",
    rateTrend: "दर कल (Trend)",
    fiveWeekOverview: "५-आठवड्यांचे ऐतिहासिक दर",
    backButton: "डॅशबोर्ड",
    sortBy: "क्रमवारी",
    sortProfit: "प्रक्षेपित नफा",
    sortPrice: "थेट दर",
    sortDistance: "कमी अंतर",
    alertText: "लासलगाव कांदा दर वधारले (+४.६% बदल). वाहतूक मार्ग तपासा.",
    logisticsIntel: "लॉजिस्टिक्स बुद्धिमत्ता",
    aiInsightTitle: "एआय वाहतूक सल्ला",
    aiInsightDesc: "वाहतूक मार्ग सुयोग्य आहे. इंधन खर्च किमान राखण्यासाठी वेग नियंत्रित ठेवा.",
  },
  hi: {
    eyebrow: "पश्चिम महाराष्ट्र नोड",
    title: "बाज़ार बुद्धिमत्ता",
    subtitle: "पश्चिम महाराष्ट्र के लाइव एपीएमसी भाव, माल ढुलाई और अनुमानित मार्जिन।",
    searchPlaceholder: "बाज़ार या फसल खोजें...",
    all: "सभी",
    sugarcane: "गन्ना",
    paddy: "धान",
    soybean: "सोयाबीन",
    onion: "प्याज़",
    tomato: "टमाटर",
    apple: "सेब",
    distance: "परिवहन दूरी",
    tollCost: "परिवहन लागत",
    sellingPrice: "लाइव बाज़ार मूल्य",
    netProfit: "अनुमानित लाभ",
    netReturnTip: "50 क्विंटल पर शुद्ध लाभ",
    rateTrend: "मूल्य सूचकांक रुझान",
    fiveWeekOverview: "5-सप्ताह का ऐतिहासिक अवलोकन",
    backButton: "डैशबोर्ड",
    sortBy: "क्रमबद्ध",
    sortProfit: "अनुमानित लाभ",
    sortPrice: "लाइव मूल्य",
    sortDistance: "भौतिक दूरी",
    alertText: "लासलगांव प्याज़ दरें बढ़ रही हैं (+4.6% डेल्टा)। लॉजिस्टिक्स विकल्प जांचें।",
    logisticsIntel: "लॉजिस्टिक्स इंटेलिजेंस",
    aiInsightTitle: "एआई लॉजिस्टिक्स सलाह",
    aiInsightDesc: "रूट अनुकूलतम है। उच्च घनत्व पारगमन अनुशंसित। नमी रोकने के लिए कार्गो ढकें।",
  }
}

const CATEGORIES = [
  { id: 'all', label: { en: 'All Commodities', mr: 'सर्व पिके फळे भाज्या', hi: 'सभी वस्तुएं' } },
  { id: 'crop', label: { en: 'Field Crops', mr: 'शेती पिके', hi: 'फसलें' } },
  { id: 'vegetable', label: { en: 'Vegetables', mr: 'भाज्या', hi: 'सब्जियां' } },
  { id: 'fruit', label: { en: 'Fruits', mr: 'फळे', hi: 'फल' } },
]

const CROP_CATEGORIES: Record<string, 'crop' | 'vegetable' | 'fruit'> = {
  Sugarcane: 'crop',
  Paddy:     'crop',
  Soybean:   'crop',
  Onion:     'vegetable',
  Tomato:    'vegetable',
  Apple:     'fruit',
}

type SortKey = 'profit' | 'price' | 'distance'

export function Market() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [mandis, setMandis] = useState<MandiItem[]>(MOCK)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Categorized states
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCrop, setSelectedCrop] = useState<string>('All')
  const [selectedId, setSelectedId] = useState<string>('1')
  
  // Sort state
  const [sortBy, setSortBy] = useState<SortKey>('profit')

  // Derive translations from global language context
  const t = language === 'mr' ? TRANSLATIONS.mr : language === 'hi' ? TRANSLATIONS.hi : TRANSLATIONS.en

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.MARKETS.LIST)
      .then((res) => {
        if (res.data?.data?.length) setMandis(res.data.data)
      })
      .catch(() => {})
  }, [])

  // Structured sub-commodity list filter based on selectedCategory
  const categoryCommodities = useMemo(() => {
    if (selectedCategory === 'crop') return ['All', 'Sugarcane', 'Paddy', 'Soybean']
    if (selectedCategory === 'vegetable') return ['All', 'Onion', 'Tomato']
    if (selectedCategory === 'fruit') return ['All', 'Apple']
    return ['All', 'Sugarcane', 'Paddy', 'Soybean', 'Onion', 'Tomato', 'Apple']
  }, [selectedCategory])

  const filtered = useMemo(() => {
    return mandis
      .filter((m) => {
        const matchSearch =
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.crop.toLowerCase().includes(searchQuery.toLowerCase())
          
        const cropCategory = CROP_CATEGORIES[m.crop]
        const matchCategory = selectedCategory === 'all' || cropCategory === selectedCategory
        const matchCrop = selectedCrop === 'All' || m.crop === selectedCrop

        return matchSearch && matchCategory && matchCrop
      })
      .sort((a, b) => {
        if (sortBy === 'price') return b.price - a.price
        if (sortBy === 'distance') return a.distance - b.distance
        const profitA = a.price * 50 - a.transportCost
        const profitB = b.price * 50 - b.transportCost
        return profitB - profitA
      })
  }, [mandis, searchQuery, selectedCategory, selectedCrop, sortBy])

  const active = useMemo(() => {
    return filtered.find((m) => m.id === selectedId) || filtered[0] || mandis[0]
  }, [filtered, mandis, selectedId])
  
  const mapUrl = useMemo(
    () => `https://maps.google.com/maps?q=${encodeURIComponent(active.name + ', Kolhapur, Maharashtra')}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
    [active]
  )

  const activeHistPrices = useMemo(() => {
    if (active.crop === 'Paddy') return HIST_PADDY
    if (active.crop === 'Soybean') return HIST_SOYBEAN
    if (active.crop === 'Onion') return HIST_ONION
    if (active.crop === 'Tomato') return HIST_TOMATO
    if (active.crop === 'Apple') return HIST_APPLE
    return HIST_SUGARCANE
  }, [active])

  return (
    <div className="w-full flex flex-col bg-[#08120E] text-white min-h-screen font-sans relative overflow-x-hidden pb-24">
      
      {/* Specular Ambient Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[160px] bg-gradient-to-b from-[#2ECC71]/4 to-transparent pointer-events-none select-none z-0" />

      {/* Page Header */}
      <div className="w-full py-20 border-b border-white/[0.04] relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="flex justify-between items-center mb-10">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.05] text-zinc-400 hover:text-white text-[12.5px] font-bold transition-all cursor-pointer shadow-lg shadow-black/10"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              {t.backButton}
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <p className="text-[#43F59A] text-[10px] font-black uppercase tracking-[0.25em] mb-4 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 bg-[#43F59A] rounded-full animate-pulse" />
              {t.eyebrow}
            </p>
            <h1 className="text-white tracking-tight leading-[1.05] text-[3.2rem] sm:text-[4.2rem] font-extrabold uppercase bg-gradient-to-r from-white via-white to-zinc-550 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-zinc-400 text-[15.5px] font-medium max-w-lg leading-relaxed mt-4">
              {t.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 py-12 flex flex-col gap-6 relative z-10">
        
        {/* Live Broadcast Notice */}
        <div className="w-full py-4 px-5 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 text-amber-400/90 text-[12px] font-medium flex items-center gap-3.5 backdrop-blur-md">
          <Bell size={14} className="shrink-0 animate-bounce text-amber-400" />
          <span className="tracking-wide">{t.alertText}</span>
        </div>

        {/* Structured Filters and Controls panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5 bg-white/[0.01] border border-white/[0.04] p-6 rounded-3xl backdrop-blur-3xl shadow-2xl relative"
        >
          {/* Row 1: Category selections */}
          <div className="flex flex-wrap gap-5 items-center justify-between w-full">
            <div className="flex gap-1.5 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl flex-wrap">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setSelectedCrop('All')
                    }}
                    className={`px-5 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer relative ${
                      active ? 'text-[#08120E]' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="mktCategoryTab"
                        className="absolute inset-0 bg-[#43F59A] rounded-lg z-[-1]"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                    {language === 'mr' ? cat.label.mr : language === 'hi' ? cat.label.hi : cat.label.en}
                  </button>
                )
               })}
             </div>

            {/* Sorting & Search */}
            <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
              {/* Index Sorting Trigger */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  {t.sortBy}
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    className="appearance-none bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-2.5 pr-9 text-[12.5px] font-bold text-white focus:outline-none focus:border-[#2ECC71] cursor-pointer"
                  >
                    <option value="profit" className="bg-[#08120E] text-white">{t.sortProfit}</option>
                    <option value="price" className="bg-[#08120E] text-white">{t.sortPrice}</option>
                    <option value="distance" className="bg-[#08120E] text-white">{t.sortDistance}</option>
                  </select>
                  <ArrowUpDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full h-10.5 pl-10 pr-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#2ECC71] transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Sub-commodity filters (Structured crops, fruits, vegetables list) */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.04] w-full">
            {categoryCommodities.map((c) => {
              const active = selectedCrop === c
              const translated = 
                c === 'All' ? t.all :
                c === 'Sugarcane' ? t.sugarcane :
                c === 'Paddy' ? t.paddy :
                c === 'Soybean' ? t.soybean :
                c === 'Onion' ? t.onion :
                c === 'Tomato' ? t.tomato :
                t.apple
              return (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCrop(c)
                    const target = filtered.find((m) => c === 'All' || m.crop === c)
                    if (target) setSelectedId(target.id)
                  }}
                  className={`px-4 py-2 rounded-full text-[12.5px] font-bold border transition-all cursor-pointer ${
                    active 
                      ? 'border-[#2ECC71]/35 bg-[#2ECC71]/10 text-[#43F59A] shadow-md shadow-[#2ECC71]/2'
                      : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/5 text-zinc-400'
                  }`}
                >
                  {translated}
                </button>
              )
            })}
          </div>

        </motion.div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Market Streams list (Left) */}
          <div className="xl:col-span-8">
            <MandiList
              filteredMandis={filtered}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>

          {/* Column 2: Detailed Route Analytics & pricing Trend (Right) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Logistics Intelligence Panel */}
            <div className="rounded-[32px] border border-white/[0.05] overflow-hidden shadow-2xl bg-white/[0.01] flex flex-col min-h-[420px] backdrop-blur-2xl">
              
              <div className="p-5 border-b border-white/[0.04] bg-white/[0.01] flex justify-between items-center font-mono">
                <span className="text-[12px] font-black text-[#43F59A] uppercase tracking-wider flex items-center gap-2">
                  <Compass size={14} className="text-[#2ECC71]" /> {t.logisticsIntel}
                </span>
                <span className="text-[11.5px] text-zinc-500 font-bold">
                  {active?.name ? active.name.split(',')[0] : ''}
                </span>
              </div>

              {/* iframe Container */}
              <div className="h-56 relative bg-zinc-950">
                <iframe
                  title="mandi-map"
                  src={mapUrl}
                  className="absolute inset-0 w-full h-full border-none filter invert hue-rotate-[180deg] opacity-[0.82]"
                  loading="lazy"
                />
                
                {/* Live tracking overlay badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08120E]/80 backdrop-blur-md border border-white/[0.06] text-white text-[9.5px] font-black uppercase tracking-wider font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-ping" />
                  Live Sync
                </div>
              </div>

              {/* Advanced route breakdown table */}
              <div className="p-5 flex flex-col gap-3 bg-[#08120E]/50 border-t border-white/[0.04]">
                {[
                  [t.distance, active?.distance ? `${active.distance} km` : '--'],
                  [t.tollCost, active?.transportCost ? `₹${active.transportCost}` : '--'],
                  [t.sellingPrice, active?.price ? `₹${active.price}/Qtl` : '--'],
                  [t.netProfit, active?.price ? `₹${(active.price * 50 - active.transportCost).toLocaleString()}` : '--'],
                ].map(([k, v]) => {
                  const isHighlight = k === t.netProfit
                  return (
                    <div
                      key={k}
                      className="flex justify-between border-b border-white/[0.04] pb-2 last:border-0 last:pb-0 text-[12.5px] font-medium text-zinc-400"
                    >
                      <span className="text-zinc-500">{k}</span>
                      <span
                        className={`font-mono font-bold ${
                          isHighlight
                            ? 'text-[#43F59A] text-[13.5px] drop-shadow-[0_0_15px_rgba(67,245,154,0.15)]'
                            : 'text-zinc-200'
                        }`}
                      >
                        {v}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* AI Logistics Insights Card (World-Class SaaS element) */}
              <div className="mx-5 mb-5 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.01] flex gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center text-[#43F59A] shrink-0 mt-0.5">
                  <Zap size={14} className="animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-[#43F59A] font-mono">
                    {t.aiInsightTitle}
                  </h4>
                  <p className="text-[11.5px] text-zinc-400 mt-1 leading-relaxed font-medium">
                    {t.aiInsightDesc}
                  </p>
                </div>
              </div>

            </div>

            {/* Historical prices trend index chart */}
            {active && (
              <div className="flex-1">
                <PriceChart
                  prices={activeHistPrices}
                  cropName={
                    active.crop === 'Sugarcane' ? t.sugarcane :
                    active.crop === 'Paddy' ? t.paddy :
                    active.crop === 'Soybean' ? t.soybean :
                    active.crop === 'Onion' ? t.onion :
                    active.crop === 'Tomato' ? t.tomato :
                    t.apple
                  }
                  mandiName={active.name.split(',')[0]}
                />
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Market
