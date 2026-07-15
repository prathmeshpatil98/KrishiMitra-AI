/**
 * KrishiMitra AI — Agricultural Transport Page
 * =============================================
 * Refactored modular transport calculator.
 */

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Route as RouteIcon, MapPin } from 'lucide-react'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'

// Subcomponents
import { RouteSelector } from '@/features/transport/components/RouteSelector'
import { CostBreakdown } from '@/features/transport/components/CostBreakdown'

interface RouteItem {
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
}

const MOCK_ROUTES: RouteItem[] = [
  { id: '1', name: 'APMC Yard, Kolhapur',        distance: 8.2,  eta: '15 min', fuelCost: 74,  tollCost: 0,   totalCost: 74,  weather: { temp: 28, desc: 'Humid Clear',    rainProb: 10 }, latitude: 16.7032, longitude: 74.2498 },
  { id: '2', name: 'Shahupuri Bhaji Market',     distance: 1.5,  eta: '5 min',  fuelCost: 14,  tollCost: 0,   totalCost: 14,  weather: { temp: 28, desc: 'Partly Cloudy', rainProb: 15 }, latitude: 16.7061, longitude: 74.2385 },
  { id: '3', name: 'Sane Guruji Veg Market',     distance: 5.4,  eta: '12 min', fuelCost: 49,  tollCost: 0,   totalCost: 49,  weather: { temp: 29, desc: 'Sunny Day',     rainProb: 5  }, latitude: 16.6811, longitude: 74.2185 },
  { id: '4', name: 'Kalamba Wholesale Market',   distance: 6.8,  eta: '14 min', fuelCost: 61,  tollCost: 0,   totalCost: 61,  weather: { temp: 28, desc: 'Clear',         rainProb: 12 }, latitude: 16.6775, longitude: 74.2255 },
  { id: '5', name: 'Sangli APMC Market',         distance: 48.0, eta: '55 min', fuelCost: 432, tollCost: 50,  totalCost: 482, weather: { temp: 30, desc: 'Sunny Hot',     rainProb: 5  }, latitude: 16.8643, longitude: 74.5642 },
  { id: '6', name: 'Miraj Market Yard',          distance: 52.0, eta: '62 min', fuelCost: 468, tollCost: 60,  totalCost: 528, weather: { temp: 31, desc: 'Sunny',         rainProb: 8  }, latitude: 16.8236, longitude: 74.6484 },
]

export function Transport() {
  const [routes, setRoutes] = useState<RouteItem[]>(MOCK_ROUTES)
  const [selectedId, setSelectedId] = useState<string>('1')
  const [quantity, setQuantity] = useState(50)

  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.TRANSPORT.ROUTES)
      .then((res) => {
        if (res.data?.data?.length) setRoutes(res.data.data)
      })
      .catch(() => {})
  }, [])

  const active = useMemo(() => routes.find((r) => r.id === selectedId) || routes[0], [routes, selectedId])
  const mapUrl = useMemo(
    () => `https://maps.google.com/maps?q=${encodeURIComponent(active.name + ', Kolhapur, Maharashtra')}&t=&z=14&ie=UTF8&iwloc=&output=embed`,
    [active]
  )

  const riskColor = useMemo(() => {
    const r = active.weather.rainProb
    if (r > 50)
      return 'border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'
    if (r > 30)
      return 'border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
    return 'border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
  }, [active])

  return (
    <div className="w-full flex flex-col bg-cream-DEFAULT dark:bg-background-dark min-h-screen">
      {/* Hero */}
      <div className="w-full py-16 relative overflow-hidden bg-gradient-to-r from-farm-green to-[#2d6a31] dark:from-[#070e08] dark:to-zinc-900 border-b border-border/10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=70')",
          }}
        />
        <div className="container-farm relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-gold-DEFAULT text-[11px] font-black uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
              <RouteIcon size={12} /> Logistical intelligence
            </p>
            <h1 className="font-display text-display text-white tracking-tight leading-none uppercase">
              Smart Transport Planner
            </h1>
            <div className="w-14 h-1 bg-gold-DEFAULT rounded-full mt-4.5 mb-4.5" />
            <p className="text-white/60 dark:text-zinc-400 text-[15px] font-medium max-w-lg leading-relaxed">
              Compare routes, calculate fuel + toll costs, check weather conditions, and find the most profitable path to market.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-farm py-14 px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {/* Quantity Cost Multiplier slider */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-6 bg-white dark:bg-zinc-900/30 p-6 rounded-3xl border border-border/60 dark:border-white/5 shadow-card"
        >
          <div className="flex-1 min-w-[280px]">
            <p className="text-[12px] font-black text-text-muted uppercase tracking-wider mb-2">
              Transit Load Quantity (Quintals)
            </p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={10}
                max={500}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 accent-farm-green dark:accent-emerald-500 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
              />
              <span className="text-[18px] font-black text-farm-green dark:text-emerald-400 shrink-0 w-20 text-right">
                {quantity} Qtl
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 border-t sm:border-t-0 sm:border-l border-border/40 dark:border-white/5 pt-4 sm:pt-0 sm:pl-6">
            <p className="text-[12px] font-black text-text-muted uppercase tracking-wider mb-1">
              Est. Transport Cost
            </p>
            <p className="text-[1.8rem] font-black text-farm-green dark:text-emerald-400">
              ₹{(active.totalCost * (1 + (quantity - 50) * 0.001)).toFixed(0)}
            </p>
          </div>
        </motion.div>

        {/* Route details splits */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <RouteSelector routes={routes} selectedId={selectedId} setSelectedId={setSelectedId} />
          </div>

          <div className="xl:col-span-2 flex flex-col gap-8">
            {/* Map wrapper */}
            <div className="rounded-3xl border border-border/60 dark:border-white/5 overflow-hidden shadow-card bg-white dark:bg-zinc-900/30 flex flex-col min-h-[350px]">
              <div className="p-4.5 border-b border-border/50 dark:border-white/5 bg-farm-green/[0.02] dark:bg-white/[0.01] flex justify-between items-center">
                <span className="text-[13.5px] font-extrabold text-farm-green dark:text-emerald-400 flex items-center gap-2">
                  <MapPin size={15} className="text-gold-DEFAULT" /> Live Transit Route Map
                </span>
                <span className="text-[12.5px] text-text-muted font-bold">
                  {active.distance} km · {active.eta}
                </span>
              </div>
              <div className="h-64 relative flex-1 bg-zinc-100 dark:bg-zinc-950">
                <iframe
                  title="transport-map"
                  src={mapUrl}
                  className="absolute inset-0 w-full h-full border-none filter dark:invert dark:hue-rotate-[180deg]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Cost card details breakdown */}
            <CostBreakdown active={active} riskColor={riskColor} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transport
