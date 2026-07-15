/**
 * KrishiMitra AI — Agricultural Government Schemes Page
 * ======================================================
 * Refactored modular portal tracking Aadhaar eligibility criteria.
 */

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Landmark, Search } from 'lucide-react'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'

// Subcomponents
import { SchemeCard } from '@/features/government/components/SchemeCard'
import { EligibilityForm } from '@/features/government/components/EligibilityForm'

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

const MOCK_SCHEMES: SchemeItem[] = [
  { id: '1', name: 'PM Kisan Samman Nidhi',   icon: '💰', provider: 'Central', category: 'Financial Subsidies', benefits: '₹6,000 per year in three equal installments of ₹2,000 via direct bank transfer.', eligibility: 'Small and marginal landholder farmer families with cultivable land holdings.', documents: ['Aadhaar Card', 'Land Ownership Certificate (Khasra/Khatauni)', 'Bank Account Details', 'Mobile Number'], deadline: 'Ongoing - Direct Portal', website: 'https://pmkisan.gov.in' },
  { id: '2', name: 'PM Fasal Bima Yojana',    icon: '🛡️', provider: 'Central', category: 'Crop Insurance',     benefits: 'Comprehensive crop insurance against drought, flood, storm, and post-harvest losses.', eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.', documents: ['Aadhaar Card', 'Land Record / Rent Agreement', 'Bank Passbook', 'Crop Sowing Declaration'], deadline: 'Before sowing season', website: 'https://pmfby.gov.in' },
  { id: '3', name: 'SMAM Equipment Subsidy',  icon: '🚜', provider: 'Central', category: 'Equipment',          benefits: '40–50% subsidy on purchase of tractors, tillers, sowing drills, and sprayers.', eligibility: 'All farmers with valid land records. SC/ST farmers get additional 5% benefit.', documents: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Quotation from Authorized Dealer'], deadline: 'August 31, 2026', website: 'https://agrimachinery.nic.in' },
  { id: '4', name: 'Soil Health Card Scheme', icon: '🌱', provider: 'Central', category: 'Soil & Water',       benefits: 'Free soil nutrient analysis and customized fertilizer recommendation report.', eligibility: 'All farmers. One card per 2.5 acres of agricultural land every 2 years.', documents: ['Aadhaar Card', 'Land Records', 'Contact with Krishi Vigyan Kendra'], deadline: 'Seasonal collection', website: 'https://soilhealth.dac.gov.in' },
  { id: '5', name: 'PM Kusum Solar Pump',     icon: '☀️', provider: 'Central', category: 'Equipment',          benefits: '60% subsidy on solar pump installation for irrigation (3–7.5 HP range).', eligibility: 'Farmers with existing electricity connection and valid land records.', documents: ['Aadhaar Card', 'Land Records', 'Electricity Bill', 'Bank Account'], deadline: 'Rolling applications', website: 'https://mnre.gov.in' },
  { id: '6', name: 'Maharashtra Shetkari Sahayata', icon: '🌾', provider: 'State', category: 'Financial Subsidies', benefits: '₹5,000 per hectare one-time assistance for drought-affected farmers in Maharashtra.', eligibility: 'Maharashtra farmers in drought-declared tehsils with land below 2 hectares.', documents: ['7/12 Land Extract', 'Aadhaar Card', 'Bank Account', 'Talathi Certificate'], deadline: 'Seasonal/Drought declaration', website: 'https://mahadbt.maharashtra.gov.in' },
]

const CATEGORIES = ['All', 'Financial Subsidies', 'Crop Insurance', 'Equipment', 'Soil & Water']

export function Government() {
  const [schemes, setSchemes] = useState<SchemeItem[]>(MOCK_SCHEMES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>('1')
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({})

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.GOVERNMENT.SCHEMES)
      .then((res) => {
        if (res.data?.data?.length) setSchemes(res.data.data)
      })
      .catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    return schemes.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.benefits.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCat = selectedCategory === 'All' || s.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [schemes, searchQuery, selectedCategory])

  const expanded = schemes.find((s) => s.id === expandedId)

  function toggleDoc(key: string) {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="w-full flex flex-col bg-cream-DEFAULT dark:bg-background-dark min-h-screen">
      {/* Hero */}
      <div className="w-full py-16 relative overflow-hidden bg-gradient-to-r from-farm-green to-[#2d6a31] dark:from-[#070e08] dark:to-zinc-900 border-b border-border/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=1400&q=70')",
          }}
        />
        <div className="container-farm relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-gold-DEFAULT text-[11px] font-black uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
              <Landmark size={12} /> Aadhaar KYC Pre-Verified Status
            </p>
            <h1 className="font-display text-display text-white tracking-tight leading-none uppercase">
              Welfare Subsidies
            </h1>
            <div className="w-14 h-1 bg-gold-DEFAULT rounded-full mt-4.5 mb-4.5" />
            <p className="text-white/60 dark:text-zinc-400 text-[15px] font-medium max-w-lg leading-relaxed">
              Browse central and Maharashtra state agricultural schemes. Your Aadhaar KYC has pre-verified your eligibility.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-farm py-14 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-zinc-900/40 p-4.5 rounded-2xl border border-border/60 dark:border-white/5 shadow-card"
        >
          <div className="flex gap-1.5 p-1 bg-cream-DEFAULT/80 dark:bg-zinc-900 rounded-xl relative border border-border/40 dark:border-white/5 flex-wrap">
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
                  className={`px-5 py-2 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer relative ${
                    active ? 'text-white' : 'text-text-muted hover:text-text-primary dark:hover:text-zinc-200'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="govSchemeTab"
                      className="absolute inset-0 bg-farm-green dark:bg-emerald-600 rounded-xl z-[-1]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  {c}
                </button>
              )
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search welfare schemes..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-cream-DEFAULT/85 dark:bg-zinc-900 border border-border/50 dark:border-white/5 text-[13.5px] text-text-primary dark:text-zinc-100 placeholder:text-text-muted focus:outline-none focus:border-farm-green focus:ring-1 focus:ring-farm-green dark:focus:ring-emerald-500 transition-all font-medium"
            />
          </div>
        </motion.div>

        {/* Schemes splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List layout */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          {/* Expanded Drawer info panel */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <EligibilityForm
              expanded={expanded}
              setExpandedId={setExpandedId}
              checkedDocs={checkedDocs}
              toggleDoc={toggleDoc}
            />

            {/* General metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: `${filtered.length}`, label: 'Available Schemes', icon: '📋' },
                { val: `${filtered.length}`, label: "You're Eligible", icon: '✅' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="farm-service-card text-center items-center py-6 glass-panel-light dark:glass-panel-dark"
                >
                  <span className="text-3xl mb-1.5">{s.icon}</span>
                  <p className="text-text-primary font-black text-[26px] leading-none">
                    {s.val}
                  </p>
                  <p className="text-text-secondary text-[11px] font-black uppercase tracking-wider mt-2.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Government
/**/
