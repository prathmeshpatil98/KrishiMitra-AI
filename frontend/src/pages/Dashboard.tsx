/**
 * KrishiMitra AI — Agricultural Premium Storytelling Homepage
 * ===========================================================
 * Refactored modular dashboard container using premium widgets.
 */

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'

// Feature Components
import { MarketTicker } from '@/features/dashboard/components/MarketTicker'
import { HeroSection } from '@/features/dashboard/components/HeroSection'
import { ServicesOverview } from '@/features/dashboard/components/ServicesOverview'
import { MandiExplorerWidget } from '@/features/dashboard/components/MandiExplorerWidget'
import { AIAdvisorWidget } from '@/features/dashboard/components/AIAdvisorWidget'
import { TransportWidget } from '@/features/dashboard/components/TransportWidget'
import { TestimonialSplit } from '@/features/dashboard/components/TestimonialSplit'

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */
type CropKey = 'Sugarcane' | 'Paddy' | 'Soybean'

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
interface ForecastDay {
  date: string
  temp: number
  rainProb: number
  humidity: number
  desc: string
  status: 'clear' | 'showers' | 'warning'
}
interface RouteItem {
  id: string
  name: string
  distance: number
  eta: string
  fuelCost: number
  tollCost: number
  totalCost: number
}
interface SchemeItem {
  id: string
  name: string
  icon: string
  benefits: string
  deadline: string
  tag: string
}

/* ────────────────────────────────────────────────
   Static / Fallback Data
   ──────────────────────────────────────────────── */
const MOCK_MANDIS: MandiItem[] = [
  { id: '1', name: 'APMC Yard, Kolhapur',          crop: 'Sugarcane', price: 3150, previousPrice: 3080, distance: 8.2, transportCost: 120, latitude: 16.7032, longitude: 74.2498, arrivalDate: 'Today' },
  { id: '2', name: 'Shahupuri Bhaji Market',        crop: 'Sugarcane', price: 3180, previousPrice: 3120, distance: 1.5, transportCost: 14,  latitude: 16.7061, longitude: 74.2385, arrivalDate: 'Today' },
  { id: '3', name: 'Sane Guruji Vegetable Market',  crop: 'Sugarcane', price: 3110, previousPrice: 3110, distance: 5.4, transportCost: 49,  latitude: 16.6811, longitude: 74.2185, arrivalDate: 'Yesterday' },
  { id: '4', name: 'Kalamba Wholesale Market',       crop: 'Paddy',     price: 2150, previousPrice: 2100, distance: 6.8, transportCost: 61,  latitude: 16.6775, longitude: 74.2255, arrivalDate: 'Today' },
  { id: '5', name: 'Padalkar Market, Kolhapur',     crop: 'Paddy',     price: 2100, previousPrice: 2150, distance: 4.2, transportCost: 38,  latitude: 16.6974, longitude: 74.2098, arrivalDate: 'Today' },
  { id: '6', name: 'APMC Yard, Kolhapur',           crop: 'Soybean',   price: 4450, previousPrice: 4380, distance: 8.2, transportCost: 120, latitude: 16.7032, longitude: 74.2498, arrivalDate: 'Today' },
  { id: '7', name: 'Shahupuri Bhaji Market',        crop: 'Soybean',   price: 4480, previousPrice: 4420, distance: 1.5, transportCost: 14,  latitude: 16.7061, longitude: 74.2385, arrivalDate: 'Today' },
]

const MOCK_FORECAST: ForecastDay[] = [
  { date: 'Today',     temp: 29.5, rainProb: 15, humidity: 65, desc: 'Partly Cloudy',       status: 'clear' },
  { date: 'Wed',       temp: 30.0, rainProb: 10, humidity: 60, desc: 'Sunny Day',            status: 'clear' },
  { date: 'Thu',       temp: 28.5, rainProb: 40, humidity: 75, desc: 'Light Showers',        status: 'showers' },
  { date: 'Fri',       temp: 27.0, rainProb: 65, humidity: 85, desc: 'Heavy Rain',           status: 'warning' },
  { date: 'Sat',       temp: 29.0, rainProb: 20, humidity: 70, desc: 'Scattered Clouds',     status: 'clear' },
]

const MOCK_ROUTES: RouteItem[] = [
  { id: '1', name: 'APMC Yard, Kolhapur',        distance: 8.2, eta: '15 min', fuelCost: 74,  tollCost: 0,  totalCost: 74 },
  { id: '2', name: 'Shahupuri Bhaji Market',     distance: 1.5, eta: '5 min',  fuelCost: 14,  tollCost: 0,  totalCost: 14 },
  { id: '3', name: 'Sane Guruji Veg Market',     distance: 5.4, eta: '12 min', fuelCost: 49,  tollCost: 0,  totalCost: 49 },
  { id: '4', name: 'Sangli APMC',                distance: 48,  eta: '55 min', fuelCost: 432, tollCost: 50, totalCost: 482 },
]

const SCHEMES: SchemeItem[] = [
  { id: '1', name: 'PM Kisan Samman Nidhi',   icon: '💰', benefits: '₹6,000/year in 3 direct bank installments',           deadline: 'Ongoing',         tag: 'Financial' },
  { id: '2', name: 'PM Fasal Bima Yojana',    icon: '🛡️', benefits: 'Crop insurance for drought, flood & storm damage',       deadline: 'Before sowing',   tag: 'Insurance' },
  { id: '3', name: 'SMAM Equipment Subsidy',  icon: '🚜', benefits: '40–50% subsidy on tractor, tiller & sowing drills',     deadline: 'Aug 31, 2026',    tag: 'Equipment' },
  { id: '4', name: 'Soil Health Card Scheme', icon: '🌱', benefits: 'Free soil nutrient analysis + custom fertilizer plan',   deadline: 'Seasonal',        tag: 'Soil & Water' },
]

export function Dashboard() {
  const { user } = useAuth()

  /* ── State ─────────────────────────────────── */
  const [crop, setCrop] = useState<CropKey>('Sugarcane')
  const [mandis, setMandis] = useState<MandiItem[]>(MOCK_MANDIS)
  const [forecast, setForecast] = useState<ForecastDay[]>(MOCK_FORECAST)
  const [routes, setRoutes] = useState<RouteItem[]>(MOCK_ROUTES)
  const [selectedMandiId, setSelectedMandiId] = useState('1')
  const [selectedDayIdx] = useState(0)
  const [selectedRouteId, setSelectedRouteId] = useState('1')
  const [mandiSearch, setMandiSearch] = useState('')

  /* ── Derived ───────────────────────────────── */
  // Removed local greeting calculations

  const filteredMandis = mandis.filter(
    (m) =>
      (crop === 'Sugarcane' || crop === 'Paddy' || crop === 'Soybean' ? m.crop === crop : true) &&
      m.name.toLowerCase().includes(mandiSearch.toLowerCase())
  )
  const activeMandi = mandis.find((m) => m.id === selectedMandiId) || mandis[0]
  const activeDay = forecast[selectedDayIdx]
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0]

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    activeMandi.name + ', Kolhapur, Maharashtra'
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`
  const routeMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    activeRoute.name + ', Kolhapur, Maharashtra'
  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`

  /* ── Real API fetch (with fallback) ─────────── */
  useEffect(() => {
    apiClient
      .get(API_ENDPOINTS.MARKETS.LIST)
      .then((res) => {
        if (res.data?.data?.length) setMandis(res.data.data)
      })
      .catch(() => {})

    apiClient
      .get(API_ENDPOINTS.WEATHER.FORECAST)
      .then((res) => {
        if (res.data?.data?.length) setForecast(res.data.data)
      })
      .catch(() => {})

    apiClient
      .get(API_ENDPOINTS.TRANSPORT.ROUTES)
      .then((res) => {
        if (res.data?.data?.length) setRoutes(res.data.data)
      })
      .catch(() => {})
  }, [])



  /* ── Hazard risk ─────────────────────────────── */
  const harvestRisk =
    activeDay.rainProb > 50
      ? {
          level: 'HIGH RISK',
          color: 'text-rose-400 bg-rose-950/20 border-rose-900/30',
          tip: 'Delay harvest. Soil saturation hazard.',
        }
      : activeDay.rainProb > 30
      ? {
          level: 'MEDIUM RISK',
          color: 'text-amber-400 bg-amber-950/20 border-amber-900/30',
          tip: 'Cover cargo with waterproof tarps.',
        }
      : {
          level: 'LOW RISK',
          color: 'text-[#43F59A] bg-emerald-950/10 border-[#2ECC71]/20',
          tip: 'Optimal harvest and transit conditions.',
        }

  return (
    <div className="w-full flex flex-col overflow-x-hidden bg-[#08120E] text-white">
      {/* Scroll indicator bar */}
      <div className="scroll-progress" />

      {/* §1 Hero section */}
      <HeroSection
        user={user}
        harvestRisk={harvestRisk}
        rainProb={activeDay.rainProb}
        temp={activeDay.temp}
      />

      {/* §2 Live Market Ticker */}
      <MarketTicker />

      {/* §3 Services Overview */}
      <ServicesOverview />

      {/* §4 Market Intelligence Mandi Explorer */}
      <MandiExplorerWidget
        crop={crop}
        setCrop={setCrop}
        mandis={mandis}
        mandiSearch={mandiSearch}
        setMandiSearch={setMandiSearch}
        selectedMandiId={selectedMandiId}
        setSelectedMandiId={setSelectedMandiId}
        filteredMandis={filteredMandis}
        activeMandi={activeMandi}
        mapUrl={mapUrl}
      />

      {/* §5 AI Advisor */}
      <AIAdvisorWidget />

      {/* §6 Transport Intelligence */}
      <TransportWidget
        routes={routes}
        selectedRouteId={selectedRouteId}
        setSelectedRouteId={setSelectedRouteId}
        activeRoute={activeRoute}
        routeMapUrl={routeMapUrl}
      />


      {/* §9 Schemes, Testimonial, Photo grid & final CTA */}
      <TestimonialSplit schemes={SCHEMES} />
    </div>
  )
}

export default Dashboard
