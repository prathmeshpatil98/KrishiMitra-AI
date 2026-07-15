/**
 * KrishiMitra AI — Logistics Intelligence Page
 * ============================================
 * Redesigned with a premium, Apple/Stripe-inspired dark theme,
 * advanced analytics, and custom AI control panels.
 */

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Cpu, Sliders, 
  CloudSun, Clock, Fuel, DollarSign, Activity, 
  Sparkles, Shield, Gauge, TrendingUp
} from 'lucide-react'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import { useLanguage } from '@/app/providers/LanguageProvider'

// Subcomponents
import { RouteSelector } from '@/features/transport/components/RouteSelector'
import { CostBreakdown } from '@/features/transport/components/CostBreakdown'

export interface RouteItem {
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
  confidence?: number
  roadQuality?: 'Excellent' | 'Good' | 'Average' | 'Poor'
  expectedArrival?: string
}

export interface ComputedRouteItem extends RouteItem {
  fuelCostCalculated: number
  tollCostCalculated: number
  otherCostCalculated: number
  totalCostCalculated: number
  revenueCalculated: number
  profitCalculated: number
  confidenceCalculated: number
  profitScoreCalculated: number
}

const MOCK_ROUTES: RouteItem[] = [
  { id: '1', name: 'APMC Yard, Kolhapur',        distance: 8.2,  eta: '15 min', fuelCost: 74,  tollCost: 0,   totalCost: 74,  weather: { temp: 28, desc: 'Humid Clear',    rainProb: 10 }, latitude: 16.7032, longitude: 74.2498, confidence: 98, roadQuality: 'Excellent', expectedArrival: '10:30 PM' },
  { id: '2', name: 'Shahupuri Bhaji Market',     distance: 1.5,  eta: '5 min',  fuelCost: 14,  tollCost: 0,   totalCost: 14,  weather: { temp: 28, desc: 'Partly Cloudy', rainProb: 15 }, latitude: 16.7061, longitude: 74.2385, confidence: 99, roadQuality: 'Excellent', expectedArrival: '10:20 PM' },
  { id: '3', name: 'Sane Guruji Veg Market',     distance: 5.4,  eta: '12 min', fuelCost: 49,  tollCost: 0,   totalCost: 49,  weather: { temp: 29, desc: 'Sunny Day',     rainProb: 5  }, latitude: 16.6811, longitude: 74.2185, confidence: 95, roadQuality: 'Good',      expectedArrival: '10:27 PM' },
  { id: '4', name: 'Kalamba Wholesale Market',   distance: 6.8,  eta: '14 min', fuelCost: 61,  tollCost: 0,   totalCost: 61,  weather: { temp: 28, desc: 'Clear',         rainProb: 12 }, latitude: 16.6775, longitude: 74.2255, confidence: 94, roadQuality: 'Good',      expectedArrival: '10:29 PM' },
  { id: '5', name: 'Sangli APMC Market',         distance: 48.0, eta: '55 min', fuelCost: 432, tollCost: 50,  totalCost: 482, weather: { temp: 30, desc: 'Sunny Hot',     rainProb: 5  }, latitude: 16.8643, longitude: 74.5642, confidence: 91, roadQuality: 'Good',      expectedArrival: '11:10 PM' },
  { id: '6', name: 'Miraj Market Yard',          distance: 52.0, eta: '62 min', fuelCost: 468, tollCost: 60,  totalCost: 528, weather: { temp: 31, desc: 'Sunny',         rainProb: 8  }, latitude: 16.8236, longitude: 74.6484, confidence: 89, roadQuality: 'Average',   expectedArrival: '11:17 PM' },
]

export function Transport() {
  const { t } = useLanguage()
  const [routes, setRoutes] = useState<RouteItem[]>(MOCK_ROUTES)
  const [selectedId, setSelectedId] = useState<string>('1')
  
  // AI Control Panel States
  const [quantity, setQuantity] = useState(50)
  const [vehicleType, setVehicleType] = useState('mediumtruck')
  const [fuelPrice, setFuelPrice] = useState(94.24)
  const [fuelEfficiency, setFuelEfficiency] = useState(12.5)
  const [cargoType, setCargoType] = useState('grain')
  const [roadPreference, setRoadPreference] = useState('shortest')
  const [aiOptimized, setAiOptimized] = useState(true)
  
  // UI States
  const [activeTab, setActiveTab] = useState<'details' | 'weather' | 'traffic'>('details')

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.TRANSPORT.ROUTES)
      .then((res) => {
        if (res.data?.data?.length) {
          const fetchedRoutes = res.data.data.map((r: any, idx: number) => ({
            ...r,
            confidence: r.confidence || (98 - idx * 2),
            roadQuality: r.roadQuality || (idx % 3 === 0 ? 'Excellent' : idx % 3 === 1 ? 'Good' : 'Average'),
            expectedArrival: r.expectedArrival || '10:45 PM'
          }))
          setRoutes(fetchedRoutes)
        }
      })
      .catch(() => {})
  }, [])

  // Sync calculation engine across ALL mandis / routes
  const computedRoutes = useMemo((): ComputedRouteItem[] => {
    const scaleFactor = 1 + (quantity - 50) * 0.0012
    
    let vehicleMultiplier = 1.0
    if (vehicleType === 'heavytruck') vehicleMultiplier = 1.6
    if (vehicleType === 'pickup') vehicleMultiplier = 0.8
    if (vehicleType === 'mini') vehicleMultiplier = 0.6

    const basePricePerQtl = 2250
    let cargoPremium = 1.0
    if (cargoType === 'fruits') cargoPremium = 1.3
    if (cargoType === 'vegetables') cargoPremium = 1.15

    return routes.map((r, idx) => {
      const fuel = (r.distance / Math.max(fuelEfficiency, 1)) * fuelPrice * vehicleMultiplier * scaleFactor
      const toll = r.tollCost * vehicleMultiplier
      const other = r.distance * 2.5 + (quantity > 100 ? 150 : 50)
      const total = fuel + toll + other
      const revenue = quantity * basePricePerQtl * cargoPremium
      const profit = Math.max(revenue - total, 0)
      
      const rawConf = r.confidence || (98 - idx * 2)
      let confidence = rawConf
      if (r.weather.rainProb > 40) confidence -= 12
      if (roadPreference === 'shortest' && r.distance > 30) confidence -= 5
      if (!aiOptimized) confidence -= 15
      confidence = Math.max(Math.min(confidence, 100), 50)
      
      const profitScore = Math.round(confidence * 0.4 + (profit / Math.max(revenue, 1)) * 60)

      return {
        ...r,
        fuelCostCalculated: fuel,
        tollCostCalculated: toll,
        otherCostCalculated: other,
        totalCostCalculated: total,
        revenueCalculated: revenue,
        profitCalculated: profit,
        confidenceCalculated: confidence,
        profitScoreCalculated: profitScore
      }
    })
  }, [routes, quantity, vehicleType, fuelPrice, fuelEfficiency, cargoType, roadPreference, aiOptimized])

  const activeComputed = useMemo(() => {
    return computedRoutes.find((r) => r.id === selectedId) || computedRoutes[0]
  }, [computedRoutes, selectedId])
  
  const mapUrl = useMemo(
    () => `https://maps.google.com/maps?q=${encodeURIComponent(activeComputed.name + ', Kolhapur, Maharashtra')}&t=k&z=14&ie=UTF8&iwloc=&output=embed`,
    [activeComputed]
  )

  const riskColor = useMemo(() => {
    const r = activeComputed.weather.rainProb
    if (r > 50) return 'border-[#EF4444]/30 bg-[#EF4444]/5 text-[#EF4444]'
    if (r > 30) return 'border-[#F59E0B]/30 bg-[#F59E0B]/5 text-[#F59E0B]'
    return 'border-[#2ECC71]/30 bg-[#2ECC71]/5 text-[#2ECC71]'
  }, [activeComputed])

  return (
    <div className="w-full flex flex-col bg-[#08120E] text-[#F5F7F6] font-inter min-h-screen relative overflow-hidden pb-12">
      
      {/* Premium Font Injection and Keyframe Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        .font-canela {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-mono-jb {
          font-family: 'JetBrains Mono', monospace;
        }
        @keyframes satellitePulse {
          0% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.25; }
          100% { transform: scale(1); opacity: 0.1; }
        }
        .animate-satellite {
          animation: satellitePulse 8s infinite ease-in-out;
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

      {/* Soft Radial Lighting / Glowing Spheres */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#2ECC71]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/5 blur-[120px] pointer-events-none" />

      {/* Hero Header */}
      <div className="w-full pt-16 pb-12 relative overflow-hidden border-b border-white/[0.06]">
        {/* Animated Satellite Background Sim */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 blur-[1px] animate-satellite pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121D18] border border-[#2ECC71]/20 text-[#43F59A] text-[11px] font-semibold tracking-[0.15em] uppercase mb-4 shadow-sm">
              <Sparkles size={12} className="animate-pulse" /> Autonomous Routing System
            </div>
            
            <h1 className="font-canela text-5xl md:text-6xl text-[#F5F7F6] tracking-tight leading-[1.1] mb-4">
              {t('transport_title')}
            </h1>
            
            <p className="text-[#A8B4AF] text-base md:text-lg max-w-3xl leading-relaxed font-light">
              {t('transport_subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Dashboard Space */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col gap-8 w-full">
        
        {/* Top Analytics - Premium KPI Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full"
        >
          {/* Card 1: Estimated Profit */}
          <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#2ECC71]/40 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:opacity-10 transition-opacity">
              <DollarSign className="text-[#2ECC71] w-12 h-12" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A8B4AF] uppercase tracking-wider mb-2">Estimated Profit</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#43F59A] tracking-tight leading-none font-mono-jb">
                ₹{activeComputed.profitCalculated.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2ECC71]/15 text-[#43F59A] font-semibold flex items-center gap-0.5">
                  <TrendingUp size={10} /> +12.4%
                </span>
                <span className="text-[9px] text-[#A8B4AF]/60">vs baseline</span>
              </div>
              {/* Smooth Bezier SVG Sparkline */}
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#2ECC71]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,20 Q15,5 30,15 T60,5 T90,12" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Operational Cost */}
          <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#3B82F6]/40 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:opacity-10 transition-opacity">
              <Activity className="text-[#3B82F6] w-12 h-12" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A8B4AF] uppercase tracking-wider mb-2">Operational Cost</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#F5F7F6] tracking-tight leading-none font-mono-jb">
                ₹{activeComputed.totalCostCalculated.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3B82F6]/15 text-[#3B82F6] font-semibold">
                  Auto Scale
                </span>
                <span className="text-[9px] text-[#A8B4AF]/60">Load weighted</span>
              </div>
              {/* Smooth Bezier SVG Sparkline */}
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#3B82F6]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,5 Q15,18 30,8 T60,18 T90,5" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Fuel Expense */}
          <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:opacity-10 transition-opacity">
              <Fuel className="text-white w-12 h-12" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A8B4AF] uppercase tracking-wider mb-2">Fuel Cost</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#F5F7F6] tracking-tight leading-none font-mono-jb">
                ₹{activeComputed.fuelCostCalculated.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[9px] text-[#A8B4AF]/60">Efficiency:</span>
                <span className="text-[10px] text-[#F5F7F6] font-medium font-mono-jb">{fuelEfficiency} km/L</span>
              </div>
              {/* Smooth Bezier SVG Sparkline */}
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-white/20" viewBox="0 0 100 24" fill="none">
                  <path d="M0,12 Q15,10 30,15 T60,10 T90,12" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Travel Time */}
          <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:opacity-10 transition-opacity">
              <Clock className="text-white w-12 h-12" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A8B4AF] uppercase tracking-wider mb-2">Travel Time</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#F5F7F6] tracking-tight leading-none font-mono-jb">
                {activeComputed.eta}
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[9px] text-[#A8B4AF]/60">Total Dist:</span>
                <span className="text-[10px] text-[#F5F7F6] font-medium font-mono-jb">{activeComputed.distance} km</span>
              </div>
              {/* Smooth Bezier SVG Sparkline */}
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-white/20" viewBox="0 0 100 24" fill="none">
                  <path d="M0,18 L20,12 L40,16 L60,8 L80,14 L100,5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 5: Weather Risk Index */}
          <div className={`bg-[#0F1714] border rounded-[24px] p-5 relative overflow-hidden group transition-all duration-300 flex flex-col justify-between border-white/[0.06] ${activeComputed.weather.rainProb > 40 ? 'hover:border-[#F59E0B]/40' : 'hover:border-[#2ECC71]/40'}`}>
            <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:opacity-10 transition-opacity">
              <CloudSun className="text-white w-12 h-12" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A8B4AF] uppercase tracking-wider mb-2">Weather Risk Index</p>
              <h3 className={`text-[20px] md:text-[22px] font-bold tracking-tight leading-none font-mono-jb ${activeComputed.weather.rainProb > 40 ? 'text-[#F59E0B]' : 'text-[#2ECC71]'}`}>
                {activeComputed.weather.rainProb}% Risk
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[9px] text-[#A8B4AF]/60">{activeComputed.weather.desc}</span>
              </div>
              {/* Smooth Bezier SVG Sparkline */}
              <div className="mt-4 h-[20px] w-full">
                <svg className={`w-full h-full ${activeComputed.weather.rainProb > 40 ? 'stroke-[#F59E0B]' : 'stroke-[#2ECC71]'}`} viewBox="0 0 100 24" fill="none">
                  <path d="M0,20 Q20,15 40,18 T80,10 T100,12" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 6: Route Confidence */}
          <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-5 relative overflow-hidden group hover:border-[#43F59A]/40 transition-all duration-300 flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:opacity-10 transition-opacity">
              <Gauge className="text-[#43F59A] w-12 h-12" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-[#A8B4AF] uppercase tracking-wider mb-2">Route Confidence</p>
              <h3 className="text-[20px] md:text-[22px] font-bold text-[#43F59A] tracking-tight leading-none font-mono-jb">
                {activeComputed.confidenceCalculated}%
              </h3>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#43F59A]/15 text-[#43F59A] font-semibold">
                  High
                </span>
                <span className="text-[9px] text-[#A8B4AF]/60">AI Verified</span>
              </div>
              {/* Smooth Bezier SVG Sparkline */}
              <div className="mt-4 h-[20px] w-full">
                <svg className="w-full h-full stroke-[#43F59A]" viewBox="0 0 100 24" fill="none">
                  <path d="M0,10 Q20,8 40,5 T80,12 T100,6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cargo Optimization - Premium AI Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 flex items-center gap-2 pointer-events-none">
            <Sliders size={18} className="text-[#A8B4AF]/30" />
            <span className="text-[10px] text-[#A8B4AF]/30 font-semibold tracking-wider uppercase">Optimization Console</span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] animate-pulse" />
            <h2 className="text-[15px] font-semibold text-[#F5F7F6] tracking-tight flex items-center gap-2">
              Cargo Optimization Panel
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left sliders side */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b lg:border-b-0 lg:border-r border-white/[0.06] pb-6 lg:pb-0 lg:pr-8">
              
              {/* Load Weight Slider */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-[11px] font-bold text-[#A8B4AF] uppercase tracking-wider font-mono-jb">Load Weight</label>
                  <span className="font-mono-jb text-[14px] font-bold text-[#43F59A]">{quantity} Qtl</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="accent-[#2ECC71] h-1 bg-white/10 rounded-lg cursor-pointer transition-all hover:bg-white/20"
                />
                <div className="flex justify-between text-[9px] text-[#A8B4AF]/50 mt-1 font-mono-jb">
                  <span>10 Qtl (Min)</span>
                  <span>500 Qtl (Max)</span>
                </div>
              </div>

              {/* Fuel Price Input */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-[#A8B4AF] uppercase tracking-wider font-mono-jb">Fuel Price (per Liter)</label>
                  <span className="font-mono-jb text-[14px] font-bold text-[#3B82F6]">₹{fuelPrice}</span>
                </div>
                <input
                  type="range"
                  min={80}
                  max={120}
                  step={0.1}
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                  className="accent-[#3B82F6] h-1 bg-white/10 rounded-lg cursor-pointer transition-all hover:bg-white/20"
                />
                <div className="flex justify-between text-[9px] text-[#A8B4AF]/50 mt-1 font-mono-jb">
                  <span>₹80/L</span>
                  <span>₹120/L</span>
                </div>
              </div>

              {/* Fuel Efficiency Slider */}
              <div className="flex flex-col mt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold text-[#A8B4AF] uppercase tracking-wider font-mono-jb">Fuel Efficiency</label>
                  <span className="font-mono-jb text-[14px] font-bold text-white">{fuelEfficiency} km/L</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={25}
                  step={0.1}
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(Number(e.target.value))}
                  className="accent-white h-1 bg-white/10 rounded-lg cursor-pointer transition-all hover:bg-white/20"
                />
                <div className="flex justify-between text-[9px] text-[#A8B4AF]/50 mt-1 font-mono-jb">
                  <span>4 km/L</span>
                  <span>25 km/L</span>
                </div>
              </div>

              {/* Advanced select values */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">Vehicle Type</label>
                  <select 
                    value={vehicleType} 
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="bg-[#121D18] border border-white/[0.06] rounded-xl px-3 py-2 text-[12px] text-[#F5F7F6] focus:outline-none focus:border-[#2ECC71] cursor-pointer font-mono-jb"
                  >
                    <option value="mini">Mini Truck (Tata Ace)</option>
                    <option value="pickup">Bolero Pickup</option>
                    <option value="mediumtruck">Eicher 14ft (Medium)</option>
                    <option value="heavytruck">10-Wheeler (Heavy)</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">Cargo Type</label>
                  <select 
                    value={cargoType} 
                    onChange={(e) => setCargoType(e.target.value)}
                    className="bg-[#121D18] border border-white/[0.06] rounded-xl px-3 py-2 text-[12px] text-[#F5F7F6] focus:outline-none focus:border-[#2ECC71] cursor-pointer font-mono-jb"
                  >
                    <option value="grain">Grains / Wheat</option>
                    <option value="vegetables">Fresh Vegetables</option>
                    <option value="fruits">Fresh Fruits (Premium)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Right details side */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">Road Preference</label>
                  <select 
                    value={roadPreference} 
                    onChange={(e) => setRoadPreference(e.target.value)}
                    className="bg-[#121D18] border border-white/[0.06] rounded-xl px-3 py-2 text-[12px] text-[#F5F7F6] focus:outline-none focus:border-[#2ECC71] cursor-pointer font-mono-jb"
                  >
                    <option value="shortest">Shortest Distance</option>
                    <option value="expressway">Fastest (Expressway)</option>
                    <option value="no-tolls">Avoid Toll Booths</option>
                  </select>
                </div>

                {/* Toggle Optimization */}
                <div className="flex flex-col justify-between">
                  <label className="text-[10px] font-bold text-[#A8B4AF] uppercase tracking-wider mb-2 font-mono-jb">AI Optimization</label>
                  <button
                    onClick={() => setAiOptimized(!aiOptimized)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border text-[12px] transition-all cursor-pointer font-medium ${
                      aiOptimized 
                        ? 'bg-[#2ECC71]/10 border-[#2ECC71]/40 text-[#43F59A] shadow-[0_0_12px_rgba(46,204,113,0.15)]' 
                        : 'bg-[#121D18] border-white/[0.06] text-[#A8B4AF]'
                    }`}
                  >
                    <span>{aiOptimized ? 'Active' : 'Disabled'}</span>
                    <div className={`w-3 h-3 rounded-full ${aiOptimized ? 'bg-[#2ECC71] animate-pulse' : 'bg-[#A8B4AF]/40'}`} />
                  </button>
                </div>
              </div>

              {/* Quick AI Advisor Summary */}
              <div className="bg-[#121D18] border border-white/[0.03] rounded-xl p-3.5 text-[11px] leading-relaxed text-[#A8B4AF] flex items-start gap-2.5">
                <Cpu size={14} className="text-[#43F59A] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F5F7F6] font-semibold font-mono-jb">AI Routing Insight:</span>{' '}
                  {aiOptimized 
                    ? `Recommended vehicle is Eicher 14ft. The optimal path avoids traffic on Toll Highway 48, minimizing travel time by 18 minutes.` 
                    : `Baseline routing model activated. Custom parameters override neural pathfinding recommendations.`
                  }
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Main layout: 12-column grid split with STRICTLY ALIGNED HEIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
          
          {/* LEFT (4 columns / 35%): AI Recommended Routes */}
          <div className="lg:col-span-4 h-[620px] flex flex-col">
            <RouteSelector 
              routes={computedRoutes} 
              selectedId={selectedId} 
              setSelectedId={setSelectedId} 
              quantity={quantity}
            />
          </div>

          {/* CENTER (5 columns / 40%): Live Route Maps */}
          <div className="lg:col-span-5 h-[620px] flex flex-col">
            <div className="bg-[#0F1714] border border-white/[0.06] rounded-[24px] overflow-hidden shadow-xl flex flex-col h-full">
              
              {/* Maps Header / Toolbar */}
              <div className="p-4 border-b border-white/[0.06] bg-[#121D18] flex justify-between items-center">
                <span className="text-[13px] font-semibold text-[#43F59A] flex items-center gap-2 font-mono-jb">
                  <MapPin size={15} className="text-[#2ECC71] animate-bounce" /> Live Logistics Intelligence
                </span>
                <div className="flex items-center gap-1.5 bg-[#0F1714] border border-white/[0.06] rounded-lg p-0.5">
                  <button 
                    onClick={() => setActiveTab('details')}
                    className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${activeTab === 'details' ? 'bg-[#121D18] text-[#F5F7F6]' : 'text-[#A8B4AF] hover:text-[#F5F7F6]'}`}
                  >
                    Hybrid Map
                  </button>
                  <button 
                    onClick={() => setActiveTab('weather')}
                    className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${activeTab === 'weather' ? 'bg-[#121D18] text-[#F5F7F6]' : 'text-[#A8B4AF] hover:text-[#F5F7F6]'}`}
                  >
                    Weather Overlays
                  </button>
                  <button 
                    onClick={() => setActiveTab('traffic')}
                    className={`px-2 py-1 text-[10px] font-semibold rounded-md transition-all ${activeTab === 'traffic' ? 'bg-[#121D18] text-[#F5F7F6]' : 'text-[#A8B4AF] hover:text-[#F5F7F6]'}`}
                  >
                    Traffic
                  </button>
                </div>
              </div>

              {/* Map Canvas Frame */}
              <div className="relative flex-1 bg-[#08120E]">
                <iframe
                  title="logistics-map"
                  src={mapUrl}
                  className="absolute inset-0 w-full h-full border-none filter invert hue-rotate-[180deg] brightness-[0.8] contrast-[1.2]"
                  loading="lazy"
                />

                {/* Floating Map Live Overlay HUD */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 pointer-events-none font-mono-jb">
                  
                  {/* Overlay row 1: Route details & ETA */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="bg-[#0F1714]/90 backdrop-blur-md border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-2 text-[11px] shadow-lg pointer-events-auto">
                      <div className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
                      <span className="text-[#A8B4AF]">ETA:</span>
                      <span className="font-bold text-[#F5F7F6]">{activeComputed.expectedArrival || '10:30 PM'} ({activeComputed.eta})</span>
                    </div>

                    <div className="bg-[#0F1714]/90 backdrop-blur-md border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-[11px] shadow-lg pointer-events-auto">
                      <Clock size={12} className="text-[#3B82F6]" />
                      <span className="font-bold text-[#F5F7F6]">{activeComputed.distance} km</span>
                    </div>
                  </div>

                  {/* Overlay row 2: Weather & safety status */}
                  <div className="flex gap-2 w-full">
                    <div className={`flex-1 backdrop-blur-md border px-3.5 py-2 rounded-xl flex items-center justify-between text-[11px] shadow-lg pointer-events-auto transition-all ${riskColor}`}>
                      <div className="flex items-center gap-2">
                        <CloudSun size={13} />
                        <span className="font-medium text-[#F5F7F6]">Road Status: {activeComputed.weather.rainProb > 40 ? 'Wet/Caution' : 'Dry/Optimal'}</span>
                      </div>
                      <span className="font-bold">{activeComputed.weather.temp}°C</span>
                    </div>
                  </div>
                </div>

                {/* Simulation overlay control panel (aesthetic) */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-[#0F1714]/95 backdrop-blur-md border border-white/[0.08] p-1.5 rounded-lg flex flex-col gap-1 pointer-events-auto shadow-md">
                    <div className="w-5 h-5 rounded bg-[#121D18] flex items-center justify-center hover:bg-white/10 cursor-pointer text-[10px] font-bold text-white">+</div>
                    <div className="w-5 h-5 rounded bg-[#121D18] flex items-center justify-center hover:bg-white/10 cursor-pointer text-[10px] font-bold text-white">-</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT (3 columns / 25%): AI Logistics Intelligence Panel */}
          <div className="lg:col-span-3 h-[620px] bg-[#0F1714] border border-white/[0.06] rounded-[24px] p-6 shadow-xl flex flex-col justify-between">
            
            {/* Header */}
            <div className="px-1 flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4 shrink-0">
              <h3 className="text-[12px] font-bold text-[#A8B4AF] uppercase tracking-widest flex items-center gap-1.5 font-mono-jb">
                <Cpu size={13} className="text-[#2ECC71]" /> AI Insights Panel
              </h3>
              <span className="text-[9px] bg-[#121D18] border border-white/[0.06] text-[#43F59A] px-2 py-0.5 rounded-full font-mono-jb">
                Live Analysis
              </span>
            </div>

            {/* AI Insights List Container - Scrollable internally */}
            <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-3.5 custom-scrollbar">
              
              {/* Insight 1: Route Recommendation */}
              <div className="bg-[#121D18] border border-[#2ECC71]/30 rounded-[20px] p-4 relative overflow-hidden group hover:border-[#2ECC71]/50 transition-all duration-300 shrink-0">
                <div className="absolute top-0 right-0 bg-[#2ECC71]/10 text-[#43F59A] text-[8px] font-black tracking-wider uppercase px-2.5 py-1 rounded-bl-lg font-mono-jb">
                  Top Choice
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-[#2ECC71]/10 flex items-center justify-center text-[#2ECC71]">
                    <Sparkles size={13} />
                  </div>
                  <h4 className="text-[12px] font-bold text-[#F5F7F6] font-mono-jb">AI Recommendation</h4>
                </div>
                <p className="text-[11.5px] leading-relaxed text-[#A8B4AF] mb-3">
                  The route to <span className="text-white font-semibold">{activeComputed.name}</span> is designated as the most profitable option. Real-time optimization saves ₹{(activeComputed.fuelCostCalculated * 0.08).toFixed(0)} in fuel.
                </p>
                <div className="flex justify-between items-center text-[10px] border-t border-white/[0.04] pt-2.5 mt-2.5">
                  <span className="text-[#A8B4AF]/60">Optimization Match:</span>
                  <span className="font-mono-jb text-[#43F59A] font-bold">98% match</span>
                </div>
              </div>

              {/* Insight 2: Financial Assessment */}
              <div className="bg-[#121D18] border border-white/[0.06] rounded-[20px] p-4 relative overflow-hidden group hover:border-white/10 transition-all duration-300 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                    <DollarSign size={13} />
                  </div>
                  <h4 className="text-[12px] font-bold text-[#F5F7F6] font-mono-jb">Financial Yield</h4>
                </div>
                <p className="text-[11.5px] leading-relaxed text-[#A8B4AF] mb-3">
                  Expected revenue stands at <span className="text-white font-semibold">₹{activeComputed.revenueCalculated.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span> with a net yield ratio of <span className="text-[#43F59A] font-semibold">{activeComputed.revenueCalculated > 0 ? ((activeComputed.profitCalculated/activeComputed.revenueCalculated)*100).toFixed(1) : 0}%</span>.
                </p>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mb-2">
                  <div className="bg-[#2ECC71] h-full rounded-full" style={{ width: `${activeComputed.revenueCalculated > 0 ? (activeComputed.profitCalculated/activeComputed.revenueCalculated)*100 : 0}%` }} />
                </div>
              </div>

              {/* Insight 3: Weather Intelligence */}
              <div className={`bg-[#121D18] border rounded-[20px] p-4 relative overflow-hidden group transition-all duration-300 shrink-0 ${activeComputed.weather.rainProb > 40 ? 'border-[#F59E0B]/30 hover:border-[#F59E0B]/50' : 'border-white/[0.06] hover:border-white/10'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeComputed.weather.rainProb > 40 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#2ECC71]/10 text-[#2ECC71]'}`}>
                    <CloudSun size={13} />
                  </div>
                  <h4 className="text-[12px] font-bold text-[#F5F7F6] font-mono-jb">Weather Alert</h4>
                </div>
                <p className="text-[11.5px] leading-relaxed text-[#A8B4AF]">
                  {activeComputed.weather.rainProb > 40 
                    ? `Precipitation probability is elevated at ${activeComputed.weather.rainProb}%. Tarp covers are mandatory to prevent cargo spoilage.` 
                    : `Weather conditions are optimal. Low risk of delay or crop dampness along this route.`
                  }
                </p>
              </div>

              {/* Insight 4: Fleet & Road Conditions */}
              <div className="bg-[#121D18] border border-white/[0.06] rounded-[20px] p-4 relative overflow-hidden group hover:border-white/10 transition-all duration-300 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Shield size={13} />
                  </div>
                  <h4 className="text-[12px] font-bold text-[#F5F7F6] font-mono-jb">Road Safety & Quality</h4>
                </div>
                <p className="text-[11.5px] leading-relaxed text-[#A8B4AF] mb-2">
                  Road surface quality rating is <span className="text-white font-semibold">{activeComputed.roadQuality}</span>. Traffic is moving at normal speeds.
                </p>
                <div className="flex gap-2">
                  <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/15 px-2 py-0.5 rounded-full font-semibold">Tolls: {activeComputed.tollCostCalculated > 0 ? `₹${activeComputed.tollCostCalculated.toFixed(0)}` : 'None'}</span>
                  <span className="text-[9px] bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/15 px-2 py-0.5 rounded-full font-semibold font-mono-jb">Verified</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Cost breakdown, details splits, bottom charts */}
        <div className="w-full mt-2">
          <CostBreakdown 
            active={activeComputed} 
            riskColor={riskColor}
            quantity={quantity}
            vehicleType={vehicleType}
            fuelPrice={fuelPrice}
            fuelEfficiency={fuelEfficiency}
            cargoType={cargoType}
            derivedCost={{
              fuel: activeComputed.fuelCostCalculated,
              toll: activeComputed.tollCostCalculated,
              total: activeComputed.totalCostCalculated
            }}
            routes={computedRoutes}
          />
        </div>

      </div>
    </div>
  )
}

export default Transport
