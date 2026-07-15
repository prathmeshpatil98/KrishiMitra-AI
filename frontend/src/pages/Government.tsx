/**
 * KrishiMitra AI — Agricultural Government Schemes Page
 * ======================================================
 * Redesigned with a premium, Apple/Stripe-inspired dark theme,
 * government intelligence widgets, and interactive success analytics.
 */

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Shield, Cpu, 
  TrendingUp, Award, Clock, FileCheck
} from 'lucide-react'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts'

// Subcomponents
import { SchemeCard } from '@/features/government/components/SchemeCard'
import { EligibilityForm } from '@/features/government/components/EligibilityForm'

export interface SchemeItem {
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

const MOCK_SCHEMES: SchemeItem[] = [
  { id: '1', name: 'PM Kisan Samman Nidhi',   icon: '💰', provider: 'Central', category: 'Financial Subsidies', benefits: '₹6,000 per year in three equal installments of ₹2,000 via direct bank transfer.', eligibility: 'Small and marginal landholder farmer families with cultivable land holdings.', documents: ['Aadhaar Card', 'Land Ownership Certificate (Khasra/Khatauni)', 'Bank Account Details', 'Mobile Number'], deadline: 'Ongoing - Direct Portal', website: 'https://pmkisan.gov.in' },
  { id: '2', name: 'PM Fasal Bima Yojana',    icon: '🛡️', provider: 'Central', category: 'Crop Insurance',     benefits: 'Comprehensive crop insurance against drought, flood, storm, and post-harvest losses.', eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.', documents: ['Aadhaar Card', 'Land Record / Rent Agreement', 'Bank Passbook', 'Crop Sowing Declaration'], deadline: 'Before sowing season', website: 'https://pmfby.gov.in' },
  { id: '3', name: 'SMAM Equipment Subsidy',  icon: '🚜', provider: 'Central', category: 'Equipment',          benefits: '40–50% subsidy on purchase of tractors, tillers, sowing drills, and sprayers.', eligibility: 'All farmers with valid land records. SC/ST farmers get additional 5% benefit.', documents: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Quotation from Authorized Dealer'], deadline: 'August 31, 2026', website: 'https://agrimachinery.nic.in' },
  { id: '4', name: 'Soil Health Card Scheme', icon: '🌱', provider: 'Central', category: 'Soil & Water',       benefits: 'Free soil nutrient analysis and customized fertilizer recommendation report.', eligibility: 'All farmers. One card per 2.5 acres of agricultural land every 2 years.', documents: ['Aadhaar Card', 'Land Records', 'Contact with Krishi Vigyan Kendra'], deadline: 'Seasonal collection', website: 'https://soilhealth.dac.gov.in' },
  { id: '5', name: 'PM Kusum Solar Pump',     icon: '☀️', provider: 'Central', category: 'Equipment',          benefits: '60% subsidy on solar pump installation for irrigation (3–7.5 HP range).', eligibility: 'Farmers with existing electricity connection and valid land records.', documents: ['Aadhaar Card', 'Land Records', 'Electricity Bill', 'Bank Account'], deadline: 'Rolling applications', website: 'https://mnre.gov.in' },
  { id: '6', name: 'Maharashtra Shetkari Sahayata', icon: '🌾', provider: 'State', category: 'Financial Subsidies', benefits: '₹5,000 per hectare one-time assistance for drought-affected farmers in Maharashtra.', eligibility: 'Maharashtra farmers in drought-declared tehsils with land below 2 hectares.', documents: ['7/12 Land Extract', 'Aadhaar Card', 'Bank Account', 'Talathi Certificate'], deadline: 'Seasonal/Drought declaration', website: 'https://mahadbt.maharashtra.gov.in' },
]

const CATEGORIES = ['All', 'Financial Subsidies', 'Crop Insurance', 'Equipment', 'Soil & Water']

// Category display mapping for Apple/Stripe visual copy
const CATEGORY_MAP: Record<string, string> = {
  'All': 'All Programs',
  'Financial Subsidies': 'Income Support',
  'Crop Insurance': 'Risk Protection',
  'Equipment': 'Farm Mechanization',
  'Soil & Water': 'Natural Resource Programs'
}

export function Government() {
  const { t } = useLanguage()
  const [schemes, setSchemes] = useState<SchemeItem[]>(MOCK_SCHEMES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>('1')
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({})

  // Extra Mock UI State Filters
  const [providerFilter, setProviderFilter] = useState<'All' | 'Central' | 'State'>('All')
  const [farmerType, setFarmerType] = useState('All')
  const [landSize, setLandSize] = useState('All')
  const [aiRecommended, setAiRecommended] = useState(true)

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.GOVERNMENT.SCHEMES)
      .then((res) => {
        if (res.data?.data?.length) setSchemes(res.data.data)
      })
      .catch(() => {})
  }, [])

  // Keep filtering logic functional as expected
  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.benefits.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory
      
      const matchProvider = providerFilter === 'All' || s.provider === providerFilter
      
      return matchSearch && matchCat && matchProvider
    })
  }, [schemes, searchQuery, selectedCategory, providerFilter])

  const expanded = useMemo(() => schemes.find((s) => s.id === expandedId), [schemes, expandedId])

  function toggleDoc(key: string) {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Count ready/pending docs
  const totalDocs = useMemo(() => {
    const set = new Set<string>()
    schemes.forEach((s) => s.documents.forEach((d) => set.add(d)))
    return Array.from(set)
  }, [schemes])

  const pendingDocsCount = useMemo(() => {
    let pending = 0
    totalDocs.forEach((d) => {
      // Aadhaar, PAN, Bank are pre-verified, others might be checked/unchecked
      if (d.includes('Land') || d.includes('Income') || d.includes('Quotation') || d.includes('Rent')) {
        const docKey = expanded ? `${expanded.id}-${d}` : ''
        if (docKey && !checkedDocs[docKey]) {
          pending++
        }
      }
    })
    return Math.max(pending, 2)
  }, [expanded, checkedDocs, totalDocs])

  // Charts Mock Data
  const monthlyTrendsData = [
    { month: 'Jan', Applications: 12 },
    { month: 'Feb', Applications: 18 },
    { month: 'Mar', Applications: 15 },
    { month: 'Apr', Applications: 29 },
    { month: 'May', Applications: 38 },
    { month: 'Jun', Applications: 45 },
    { month: 'Jul', Applications: 52 },
  ]

  const popularSchemesData = schemes.map((s, idx) => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    Benefits: idx % 2 === 0 ? 6000 : 15000 + idx * 5000,
    Match: 90 + (idx * 2) % 10
  }))

  const distributionData = [
    { name: 'Income Support', value: 45, color: '#2ECC71' },
    { name: 'Risk Protection', value: 25, color: '#3B82F6' },
    { name: 'Farm Mechanization', value: 20, color: '#F4B740' },
    { name: 'Resource Programs', value: 10, color: '#A8B4AF' },
  ]

  return (
    <div className="w-full flex flex-col bg-[#08120E] text-[#F8FAF8] font-inter min-h-screen relative overflow-hidden pb-12">
      
      {/* Premium Font Injection and Keyframe Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        .font-canela {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-mono-jb {
          font-family: 'JetBrains Mono', monospace;
        }
        @keyframes subtleGlow {
          0% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.08); opacity: 0.22; }
          100% { transform: scale(1); opacity: 0.1; }
        }
        .animate-light-glow {
          animation: subtleGlow 10s infinite ease-in-out;
        }
        
        /* Custom Scrollbars */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}} />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Radial Glow Lights */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#2ECC71]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

      {/* Hero Header with Government Emblem Watermark */}
      <div className="w-full pt-16 pb-14 relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-[#101915]/50 to-transparent">
        
        {/* Emblem Watermark SVG */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 opacity-[0.03] text-white pointer-events-none select-none">
          <svg width="340" height="340" viewBox="0 0 100 100" fill="currentColor">
            {/* Ashoka Chakra style clean vector symbol */}
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.8" fill="none" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line 
                key={i} 
                x1="50" 
                y1="50" 
                x2={(50 + 38 * Math.cos((i * 15 * Math.PI) / 180)).toString()} 
                y2={(50 + 38 * Math.sin((i * 15 * Math.PI) / 180)).toString()} 
                stroke="currentColor" 
                strokeWidth="0.8" 
              />
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 h-7 px-3.5 rounded-full bg-[#101915] border border-[#2ECC71]/30 text-[#43F59A] text-[10px] font-bold tracking-[0.12em] uppercase mb-4 shadow-sm font-mono-jb leading-none select-none">
              <Shield size={11} className="text-[#F4B740]" /> AADHAAR KYC PRE-VERIFIED STATUS
            </div>
            
            <h1 className="font-canela text-5xl md:text-6xl text-[#F8FAF8] tracking-tight leading-[1.1] mb-4">
              {t('gov_title')}
            </h1>
            
            <p className="text-[#A8B4AF] text-base md:text-lg max-w-3xl leading-relaxed font-light">
              {t('gov_subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col gap-8 w-full">
        
        {/* Top Dashboard: KPI Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full"
        >
          {/* KPI 1: Eligible Schemes */}
          <div className="bg-[#101915] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#2ECC71]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">Eligible Schemes</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#43F59A] tracking-tight leading-none font-mono-jb">
                {filtered.length} Programs
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2ECC71]/15 text-[#43F59A] font-semibold flex items-center gap-0.5 font-mono-jb">
                  <TrendingUp size={10} /> AI Verified
                </span>
              </div>
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#2ECC71]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,20 Q15,5 30,15 T60,5 T90,12" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 2: Estimated Annual Benefits */}
          <div className="bg-[#101915] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#3B82F6]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb font-sans">Est. Annual Benefits</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-white tracking-tight leading-none font-mono-jb">
                ₹86,500
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/15 text-[#3B82F6] font-semibold">
                  Max Yield
                </span>
              </div>
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#3B82F6]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,5 Q15,18 30,8 T60,18 T90,5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 3: Application Success Rate */}
          <div className="bg-[#101915] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#F4B740]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">Success Rate</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#F4B740] tracking-tight leading-none font-mono-jb">
                94.8%
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[9px] text-[#A8B4AF]/60">
                <Award size={11} className="text-[#F4B740]" /> High approval speed
              </div>
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#F4B740]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,15 Q20,5 40,10 T80,5 T100,8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 4: Pending Documents */}
          <div className="bg-[#101915] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#EF4444]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">Pending Documents</p>
              <h3 className={`text-[20px] md:text-[22px] font-bold tracking-tight leading-none font-mono-jb ${pendingDocsCount > 0 ? 'text-[#EF4444]' : 'text-[#2ECC71]'}`}>
                {pendingDocsCount} Docs
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[9px] text-[#A8B4AF]/60">
                <Clock size={11} /> Verification active
              </div>
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#EF4444]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,18 L20,12 L40,16 L60,8 L80,14 L100,5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 5: Applications Submitted */}
          <div className="bg-[#101915] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">Submitted Apps</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-white tracking-tight leading-none font-mono-jb">
                3 Submitted
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5 text-[9px] text-[#A8B4AF]/60">
                <FileCheck size={11} className="text-[#2ECC71]" /> Direct DB Transfer
              </div>
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-white/20" viewBox="0 0 100 24" fill="none">
                  <path d="M0,12 Q15,10 30,15 T60,10 T90,12" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* KPI 6: AI Eligibility Score */}
          <div className="bg-[#101915] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#43F59A]/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">AI Eligibility Score</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#43F59A] tracking-tight leading-none font-mono-jb">
                98 / 100
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#43F59A]/15 text-[#43F59A] font-semibold font-mono-jb">
                  High Match
                </span>
              </div>
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#43F59A]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,10 Q20,8 40,5 T80,12 T100,6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search & Sticky Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="sticky top-[64px] z-30 flex flex-wrap gap-4 items-center justify-between bg-[#101915]/90 backdrop-blur-md p-4.5 rounded-[24px] border border-white/[0.06] shadow-2xl"
        >
          {/* Left: Category filter buttons with mapped labels */}
          <div className="flex gap-1.5 p-1 bg-[#08120E] rounded-xl border border-white/[0.06] flex-wrap items-center">
            {CATEGORIES.map((c) => {
              const active = selectedCategory === c
              return (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCategory(c)
                    const target = schemes.find((s) => c === 'All' || s.category === c)
                    if (target) setExpandedId(target.id)
                  }}
                  className={`px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer relative ${
                    active ? 'text-white' : 'text-[#A8B4AF] hover:text-[#F8FAF8]'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="govSchemeTab"
                      className="absolute inset-0 bg-[#2ECC71]/15 border border-[#2ECC71]/30 rounded-lg z-[0]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{CATEGORY_MAP[c]}</span>
                </button>
              )
            })}
          </div>

          {/* Right: Premium filters grid */}
          <div className="flex items-center gap-3.5 flex-wrap w-full lg:w-auto">
            {/* Global Search */}
            <div className="relative flex-1 lg:w-56">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B4AF] pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search benefit schemes..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-[#08120E] border border-white/[0.06] text-[13px] text-white placeholder:text-[#A8B4AF]/60 focus:outline-none focus:border-[#2ECC71] transition-all font-mono-jb"
              />
            </div>

            {/* Provider Filter */}
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value as any)}
              className="h-10 bg-[#08120E] border border-white/[0.06] rounded-xl px-3 py-1.5 text-[12px] text-[#F8FAF8] focus:outline-none focus:border-[#2ECC71] cursor-pointer font-mono-jb"
            >
              <option value="All">All Providers</option>
              <option value="Central">Central Govt</option>
              <option value="State">State Govt</option>
            </select>

            {/* Farmer Type */}
            <select
              value={farmerType}
              onChange={(e) => setFarmerType(e.target.value)}
              className="h-10 bg-[#08120E] border border-white/[0.06] rounded-xl px-3 py-1.5 text-[12px] text-[#F8FAF8] focus:outline-none focus:border-[#2ECC71] cursor-pointer font-mono-jb"
            >
              <option value="All">Small & Marginal</option>
              <option value="Tenant">Tenant Farmers</option>
              <option value="Large">Large Landholders</option>
            </select>

            {/* Land Size */}
            <select
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
              className="h-10 bg-[#08120E] border border-white/[0.06] rounded-xl px-3 py-1.5 text-[12px] text-[#F8FAF8] focus:outline-none focus:border-[#2ECC71] cursor-pointer font-mono-jb"
            >
              <option value="All">All Sizes</option>
              <option value="1">Under 1 Hectare</option>
              <option value="2">1–2 Hectares</option>
              <option value="3">Over 2 Hectares</option>
            </select>

            {/* AI Recommended Toggle */}
            <button
              onClick={() => setAiRecommended(!aiRecommended)}
              className={`h-10 flex items-center justify-between px-3.5 py-1.5 rounded-xl border text-[12px] transition-all cursor-pointer font-semibold font-mono-jb ${
                aiRecommended 
                  ? 'bg-[#2ECC71]/10 border-[#2ECC71]/40 text-[#43F59A] shadow-[0_0_12px_rgba(46,204,113,0.1)]' 
                  : 'bg-[#08120E] border-white/[0.06] text-[#A8B4AF]'
              }`}
            >
              <span>AI Target</span>
              <div className={`w-1.5 h-1.5 rounded-full ml-2 ${aiRecommended ? 'bg-[#2ECC71] animate-pulse' : 'bg-[#A8B4AF]/40'}`} />
            </button>
          </div>

        </motion.div>

        {/* Schemes Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full relative">
          
          {/* LEFT (8 columns): Redesigned Cards List */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {filtered.map((s, idx) => (
              <SchemeCard
                key={s.id}
                scheme={s}
                idx={idx}
                active={s.id === expandedId}
                onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              />
            ))}
          </div>

          {/* RIGHT (4 columns): AI Scheme Intelligence details panel */}
          <div className="lg:col-span-4 sticky top-[128px] flex flex-col z-20">
            <EligibilityForm
              expanded={expanded}
              setExpandedId={setExpandedId}
              checkedDocs={checkedDocs}
              toggleDoc={toggleDoc}
            />
          </div>

        </div>

        {/* Bottom Section: Application Success Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#101915] border border-white/[0.06] rounded-[24px] p-6 shadow-xl w-full mt-4 flex flex-col gap-6"
        >
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
            <h3 className="text-[13px] font-bold text-[#F8FAF8] uppercase tracking-wider flex items-center gap-2 font-mono-jb">
              <Cpu size={14} className="text-[#2ECC71]" /> Application Success Analytics
            </h3>
            <span className="text-[9px] text-[#A8B4AF]/50 font-mono-jb">Live Scheme Yield Dashboard</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Chart 1: Monthly Trends (Area Chart - 5 columns) */}
            <div className="lg:col-span-5 h-[230px] flex flex-col justify-between">
              <span className="text-[11px] text-[#A8B4AF] font-semibold mb-2.5 block font-mono-jb">Monthly Application Volume</span>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2ECC71" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#A8B4AF" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#A8B4AF" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#101915', 
                        borderColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#F8FAF8'
                      }}
                    />
                    <Area type="monotone" dataKey="Applications" stroke="#2ECC71" fillOpacity={1} fill="url(#colorApps)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Popular Schemes Matching (Bar Chart - 4 columns) */}
            <div className="lg:col-span-4 h-[230px] flex flex-col justify-between">
              <span className="text-[11px] text-[#A8B4AF] font-semibold mb-2.5 block font-mono-jb">Top Scheme Eligibility Score</span>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularSchemesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#A8B4AF" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#A8B4AF" fontSize={8} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#101915', 
                        borderColor: 'rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#F8FAF8'
                      }}
                    />
                    <Bar dataKey="Match" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Distribution (Pie Chart - 3 columns) */}
            <div className="lg:col-span-3 h-[230px] flex flex-col justify-between">
              <span className="text-[11px] text-[#A8B4AF] font-semibold mb-1 block font-mono-jb">Benefit Distribution Ratio</span>
              
              <div className="flex items-center gap-4 flex-1">
                <div className="h-[100px] w-[100px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={22}
                        outerRadius={38}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1.5 flex-grow font-mono-jb">
                  {distributionData.slice(0, 3).map((d) => (
                    <div key={d.name} className="flex flex-col">
                      <div className="flex items-center gap-1.5 text-[9px] text-[#A8B4AF] font-sans">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="truncate leading-none">{d.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-white pl-3.5 leading-none mt-0.5">
                        {d.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Government
