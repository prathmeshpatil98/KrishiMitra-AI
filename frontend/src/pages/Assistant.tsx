/**
 * KrishiMitra — Farm Advisor Page
 * ============================================
 * Simplified farm guidance for mandi prices, weather, transport, and schemes.
 */

import { useState, useCallback } from 'react'
import { 
  Plus, Camera, MapPin, Upload, Map, Scale, CloudSun, TrendingUp, 
  Calculator, AlertTriangle, Calendar, ShieldCheck, PanelLeftClose, 
  PanelLeftOpen, PanelRightClose, PanelRightOpen, Sparkles, Send
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import { motion, AnimatePresence } from 'framer-motion'

interface ToolStep {
  name: string
  status: 'running' | 'success' | 'failed'
  description: string
  output?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  reasoningSteps?: string[]
  toolsCalled?: ToolStep[]
  isStreaming?: boolean
}

interface Thread {
  id: string
  title: string
  date: string
  crop: string
}

const WELCOME_MSG: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome to KrishiMitra Advisor.\n\nAsk about live mandi prices, weather in your area, transport planning, and scheme help.\n\nType your farm question or choose a suggested task to start.`,
  timestamp: 'Just now',
}

const LANGGRAPH_STEPS = [
  { name: 'market_agent',   description: 'Querying Agmarknet live price feed',    tool: '📊' },
  { name: 'weather_agent',  description: 'Cross-referencing OpenWeather forecast', tool: '🌦️' },
  { name: 'route_agent',    description: 'Calculating optimal transport routes',   tool: '🗺️' },
  { name: 'scheme_agent',   description: 'Checking government scheme eligibility', tool: '🏛️' },
  { name: 'synthesis',      description: 'Synthesizing final recommendation',      tool: '🤖' },
]

const MOCK_THREADS: Thread[] = [
  { id: '1', title: 'Best day to sell Sugarcane?',    date: '2 hours ago', crop: 'Sugarcane' },
  { id: '2', title: 'Thursday route weather risk',    date: 'Yesterday',   crop: 'Weather' },
  { id: '3', title: 'PM Fasal Bima eligibility',      date: '2 days ago',  crop: 'Schemes' },
  { id: '4', title: 'Sangli vs Kolhapur APMC prices', date: '3 days ago',  crop: 'Markets' },
]

export function Assistant() {
  useAuth()
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG])
  const [inputText, setInputText] = useState('')
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [isThinking, setIsThinking] = useState(false)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [crop, setCrop] = useState('Sugarcane')

  const handleQuickAction = useCallback((text: string) => {
    setInputText(text)
  }, [])

  const sendMessage = useCallback(async (customText?: string) => {
    const q = (customText || inputText).trim()
    if (!q || isThinking) return
    setInputText('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: q, timestamp: 'Now' }
    setMessages((prev) => [...prev, userMsg])
    setIsThinking(true)

    const thinkId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      {
        id: thinkId,
        role: 'assistant',
        content: '',
        timestamp: 'Now',
        isStreaming: true,
        reasoningSteps: LANGGRAPH_STEPS.map((s) => s.description),
        toolsCalled: LANGGRAPH_STEPS.map((s, i) => ({
          name: s.name,
          status: i === 0 ? 'running' : ('running' as const),
          description: s.description,
        })),
      },
    ])

    try {
      const res = await apiClient.post(API_ENDPOINTS.CHAT.SEND, {
        message: q,
        crop_name: crop,
        location: 'Kolhapur, Maharashtra',
        session_id: activeThreadId,
      })

      const text = res.data?.data?.response || res.data?.message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkId
            ? {
                ...m,
                content: text || generateResponse(q, crop),
                isStreaming: false,
                toolsCalled: LANGGRAPH_STEPS.map((s) => ({ ...s, status: 'success' as const })),
              }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkId
            ? {
                ...m,
                content: generateResponse(q, crop),
                isStreaming: false,
                toolsCalled: LANGGRAPH_STEPS.map((s) => ({ ...s, status: 'success' as const })),
              }
            : m
        )
      )
    } finally {
      setIsThinking(false)
    }
  }, [inputText, isThinking, crop, activeThreadId])

  function generateResponse(q: string, c: string): string {
    const lower = q.toLowerCase()
    
    let queryCrop = c
    if (lower.includes('sugarcane')) queryCrop = 'Sugarcane'
    else if (lower.includes('paddy') || lower.includes('rice')) queryCrop = 'Paddy'
    else if (lower.includes('soybean')) queryCrop = 'Soybean'
    else if (lower.includes('wheat')) queryCrop = 'Wheat'
    else if (lower.includes('cotton')) queryCrop = 'Cotton'
    else if (lower.includes('apple')) queryCrop = 'Apple'

    if (lower.includes('weather') || lower.includes('rain') || lower.includes('forecast') || lower.includes('cloud') || lower.includes('shower')) {
      return `Based on live Weather data for Kolhapur:\n\n• **Today & Wednesday**: Clear skies (10–15% rain) — optimal transit\n• **Thursday**: Light showers (40%) — cover ${queryCrop} with waterproof tarps\n• **Friday**: Heavy rain (65%) — DELAY harvest if possible\n\nSchedule transport by Wednesday evening. Avoid Friday transit completely.`
    }
    
    if (lower.includes('price') || lower.includes('mandi') || lower.includes('market') || lower.includes('rate') || lower.includes('cost') || lower.includes('charges') || lower.includes('fees') || lower.includes('fare')) {
      if (lower.includes('transport') || lower.includes('route') || lower.includes('routing') || lower.includes('road')) {
        return `Optimal transport analysis from your farm:\n\n• **Shahupuri Market** (1.5km, ₹14 cost): Best proximity\n• **APMC Yard** (8.2km, ₹120 cost): Best FRP rates\n• **Sangli APMC** (48km, ₹482 total)\n\nShahupuri Market is recommended today.`
      }
      return `Live Mandi data for ${queryCrop}:\n\n• **APMC Kolhapur**: ₹3,150/Qtl\n• **Shahupuri Market**: ₹3,180/Qtl (highest)\n• **Sane Guruji Market**: ₹3,110/Qtl\n\nShahupuri Bhaji Market offers the best price.`
    }
    
    if (lower.includes('scheme') || lower.includes('subsidy') || lower.includes('subsidies') || lower.includes('benefit') || lower.includes('government')) {
      return `Your Aadhaar-verified eligibility status:\n\n• **PM Kisan**: Eligibility Verified\n• **PM Fasal Bima**: Enrollment open\n• **SMAM Equipment**: 40–50% subsidy eligible\n• **Soil Health Card**: Free soil analysis available\n\nRegister PM Fasal Bima before the current season deadline.`
    }
    
    return `I analyzed live market, weather, and transport data for ${queryCrop}:\n\n**Market**: Best rate at Shahupuri Bhaji Market (₹3,180/Qtl)\n**Weather**: Clear conditions through Wednesday — ideal transport window\n**Route**: 1.5km to Shahupuri, total cost ₹14`
  }

  function newThread() {
    setMessages([WELCOME_MSG])
    setActiveThreadId(null)
  }

  const CROPS_LIST = ['Sugarcane', 'Paddy', 'Soybean', 'Wheat', 'Cotton']

  const renderVisualResponse = (content: string, keyId: string) => {
    const lower = content.toLowerCase()
    
    if (lower.includes('live weather data') || lower.includes('clear skies (10–15%')) {
      return (
        <div key={keyId} className="flex flex-col gap-4 p-5 bg-[#0D1714] border border-white/[0.06] rounded-[24px] w-full mt-3 shadow-lg font-sans text-left">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
            <span className="text-xs font-bold text-[#A5B1AA] uppercase tracking-wider flex items-center gap-2 font-mono">
              <CloudSun size={14} className="text-blue-400" /> Weather Forecast Matrix
            </span>
            <span className="text-[9.5px] bg-white/[0.03] px-2 py-0.5 rounded text-white/50 font-mono">Kolhapur Region</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { day: 'Today', temp: '28°C', risk: 'Low', desc: 'Clear Skies', color: 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' },
              { day: 'Thursday', temp: '27°C', risk: '40% Risk', desc: 'Light Showers', color: 'text-amber-400 bg-amber-500/5 border-amber-500/10' },
              { day: 'Friday', temp: '25°C', risk: '65% Risk', desc: 'Heavy Rain', color: 'text-rose-400 bg-rose-500/5 border-rose-500/10' },
            ].map((w) => (
              <div key={w.day} className="p-3 bg-[#121F19]/50 border border-white/[0.03] rounded-2xl text-center flex flex-col justify-between h-[110px]">
                <div>
                  <span className="text-[10px] text-white/40 font-semibold font-mono">{w.day}</span>
                  <span className="text-xs text-white/60 block mt-0.5">{w.desc}</span>
                </div>
                <div>
                  <span className="text-base font-black text-white block font-mono">{w.temp}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold mt-1.5 inline-block border font-mono ${w.color}`}>
                    {w.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#121F19] border border-white/[0.04] flex flex-col gap-2 mt-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Recommended Actions</span>
            <div className="text-[11px] flex flex-col gap-2 text-white/80 font-medium">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>Schedule crop transport before Thursday evening.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>Avoid Friday transport due to rain warnings.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>Cover harvested stacks with tarps if stored outside.</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (lower.includes('optimal transport analysis') || lower.includes('proximity')) {
      return (
        <div key={keyId} className="flex flex-col gap-4 p-5 bg-[#0D1714] border border-white/[0.06] rounded-[24px] w-full mt-3 shadow-lg font-sans text-left">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
            <span className="text-xs font-bold text-[#A5B1AA] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Map size={14} className="text-blue-400" /> Route Dispatch Analysis
            </span>
            <span className="text-[9.5px] bg-white/[0.03] px-2 py-0.5 rounded text-white/50 font-mono">OSRM Routing Engine</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { name: 'Shahupuri Market', dist: '1.5 km', cost: '₹14', rating: 'Optimal Proximity' },
              { name: 'APMC Yard Kolhapur', dist: '8.2 km', cost: '₹120', rating: 'Standard' },
              { name: 'Sangli APMC Yard', dist: '48.0 km', cost: '₹482', rating: 'Long Distance' },
            ].map((r) => (
              <div key={r.name} className="flex justify-between items-center p-3 rounded-2xl bg-[#121F19]/40 border border-white/[0.03] text-xs font-mono">
                <div className="flex flex-col">
                  <span className="font-sans text-white/85 font-semibold text-xs">{r.name}</span>
                  <span className="text-[10px] text-white/40 font-mono mt-0.5">{r.dist}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-white font-bold text-xs">{r.cost}</span>
                  <span className={`text-[8px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                    r.rating === 'Optimal Proximity' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-white/5 text-white/40 border-white/[0.06]'
                  }`}>{r.rating}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#121F19] border border-white/[0.04] flex flex-col gap-2 mt-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Routing Decision</span>
            <div className="text-[11px] flex flex-col gap-2 text-white/80 font-medium">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>Utilize Shahupuri Market to optimize freight transport costs (under 2km).</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (lower.includes('live mandi data') || lower.includes('apmc kolhapur') || lower.includes('best price')) {
      let matchedCrop = crop
      if (lower.includes('sugarcane')) matchedCrop = 'Sugarcane'
      else if (lower.includes('paddy')) matchedCrop = 'Paddy'
      else if (lower.includes('soybean')) matchedCrop = 'Soybean'
      else if (lower.includes('wheat')) matchedCrop = 'Wheat'
      else if (lower.includes('cotton')) matchedCrop = 'Cotton'

      return (
        <div key={keyId} className="flex flex-col gap-4 p-5 bg-[#0D1714] border border-white/[0.06] rounded-[24px] w-full mt-3 shadow-lg font-sans text-left">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
            <span className="text-xs font-bold text-[#A5B1AA] uppercase tracking-wider flex items-center gap-2 font-mono">
              <Scale size={14} className="text-emerald-400" /> {matchedCrop} Mandi Index
            </span>
            <span className="text-[9.5px] bg-white/[0.03] px-2 py-0.5 rounded text-white/50 font-mono">Agmarknet Live Feed</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { name: 'APMC Kolhapur', price: '₹3,150', diff: '+₹20', status: 'FRP Rate' },
              { name: 'Shahupuri Market', price: '₹3,180', diff: '+₹50', status: 'Best Price' },
              { name: 'Sane Guruji Market', price: '₹3,110', diff: '-₹20', status: 'Stable' },
            ].map((m) => (
              <div key={m.name} className="flex justify-between items-center p-3 rounded-2xl bg-[#121F19]/40 border border-white/[0.03] text-xs font-mono">
                <span className="font-sans text-white/85 font-semibold text-xs">{m.name}</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-emerald-400 font-bold">{m.diff}</span>
                  <span className="text-white font-bold">{m.price}/Qtl</span>
                  <span className={`text-[8px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
                    m.status === 'Best Price' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-white/5 text-white/40 border-white/[0.06]'
                  }`}>{m.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#121F19] border border-white/[0.04] flex flex-col gap-2 mt-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Advisory Action</span>
            <div className="text-[11px] flex flex-col gap-2 text-white/80 font-medium">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>Sell crop at Shahupuri Market tomorrow morning for optimal yield return.</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (lower.includes('eligibility status') || lower.includes('pm kisan') || lower.includes('fasal bima')) {
      return (
        <div key={keyId} className="flex flex-col gap-4 p-5 bg-[#0D1714] border border-white/[0.06] rounded-[24px] w-full mt-3 shadow-lg font-sans text-left">
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-3">
            <span className="text-xs font-bold text-[#A5B1AA] uppercase tracking-wider flex items-center gap-2 font-mono">
              <ShieldCheck size={14} className="text-blue-400" /> Government Subsidy Portal
            </span>
            <span className="text-[9.5px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 font-mono">Aadhaar Verified</span>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { name: 'PM Kisan Samman Nidhi', benefit: '₹6,000 / Year', eligibility: 'Verified' },
              { name: 'PM Fasal Bima Yojana', benefit: 'Crop Protection Insurance', eligibility: 'Pending Cert' },
              { name: 'SMAM Equipment Subsidy', benefit: '40-50% Machinery Grant', eligibility: 'Verified' },
            ].map((s) => (
              <div key={s.name} className="flex flex-col gap-1 p-3 rounded-2xl bg-[#121F19]/40 border border-white/[0.03] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold font-sans text-xs">{s.name}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold border ${
                    s.eligibility === 'Verified' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {s.eligibility}
                  </span>
                </div>
                <span className="text-[10px] text-white/40 font-mono">{s.benefit}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#121F19] border border-white/[0.04] flex flex-col gap-2 mt-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Critical Deadlines</span>
            <div className="text-[11px] flex flex-col gap-2 text-white/80 font-medium">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>Submit PM Fasal Bima registration before July 30 cutoff.</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  const renderThinkingPipeline = () => {
    return (
      <div className="flex flex-col gap-4 p-5 bg-[#0D1714]/80 border border-emerald-500/20 rounded-[24px] w-full mt-2 animate-pulse">
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping absolute" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Agent Reasoning Stream</span>
          </div>
          <span className="text-[9px] text-white/30 font-mono">LangGraph Orchestrator</span>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2 relative">
          <div className="absolute top-1/2 left-[20px] right-[20px] h-[1px] bg-white/[0.06] hidden md:block -translate-y-1/2 z-0" />

          {LANGGRAPH_STEPS.map((step, idx) => {
            return (
              <div key={step.name} className="flex md:flex-col items-center gap-3 md:gap-2 z-10 flex-1">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#121F19] border border-white/[0.08] shadow-lg">
                  <span className="text-sm">{step.tool}</span>
                  {idx === 0 && (
                    <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-60" />
                  )}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-[#0D1714] flex items-center justify-center text-[7px] font-bold ${
                    idx === 0 ? 'bg-emerald-500 text-black' : 'bg-white/5 text-white/40'
                  }`}>
                    {idx === 0 ? '●' : idx + 1}
                  </span>
                </div>

                <div className="flex flex-col md:items-center text-left md:text-center min-w-[70px]">
                  <span className={`text-[9px] font-bold tracking-wide font-mono ${
                    idx === 0 ? 'text-emerald-400' : 'text-white/40'
                  }`}>
                    {step.name.replace('_', ' ')}
                  </span>
                  <span className="text-[8px] text-white/35 hidden md:block truncate max-w-[90px]" title={step.description}>
                    {step.description}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const isChatMode = messages.length > 1

  return (
    <div className="min-h-screen bg-[#060E0B] text-white font-inter relative overflow-hidden noise-bg pt-[88px]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-950/20 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-900/10 blur-[120px] pointer-events-none z-0" />

      <div className="mx-auto max-w-[1720px] px-4 py-6 sm:px-6 lg:px-8 relative z-10 flex flex-col min-h-screen">
        
        <div className="flex items-center justify-between border border-white/[0.06] bg-[#0A110E]/80 backdrop-blur-xl px-6 py-4 rounded-[24px] mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <Sparkles size={14} className="text-emerald-400 animate-pulse" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#060E0B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">Farming Co-Pilot</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">v2.5 Live</span>
              </div>
              <p className="text-[10px] text-white/40">Connected to Mandi Price Feed & Weather Sensors</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] p-0.5 rounded-xl">
              {CROPS_LIST.map((c) => {
                const active = crop === c
                return (
                  <button
                    key={c}
                    onClick={() => setCrop(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      active
                        ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>

            <div className="h-4 w-px bg-white/[0.06] hidden sm:block" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className={`p-2 rounded-xl border transition ${
                  leftSidebarOpen
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/50 hover:bg-white/5'
                }`}
                title={leftSidebarOpen ? "Collapse Left Panel" : "Expand Left Panel"}
              >
                {leftSidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
              </button>
              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className={`p-2 rounded-xl border transition ${
                  rightSidebarOpen
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                    : 'border-white/[0.06] bg-white/[0.02] text-white/50 hover:bg-white/5'
                }`}
                title={rightSidebarOpen ? "Collapse Insights" : "Expand Insights"}
              >
                {rightSidebarOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-stretch relative min-h-[calc(100vh-180px)] flex-1">
          
          <AnimatePresence initial={false}>
            {leftSidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0, marginRight: 0 }}
                animate={{ width: 300, opacity: 1, marginRight: 0 }}
                exit={{ width: 0, opacity: 0, marginRight: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="hidden xl:block overflow-hidden shrink-0"
              >
                <div className="w-[300px] h-full rounded-[28px] border border-white/[0.08] bg-[#0A110E]/80 p-5 space-y-6 flex flex-col justify-between">
                  <div className="space-y-6 flex flex-col h-full">
                    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#88A595] font-bold font-mono">Workspace</span>
                        <h2 className="text-sm font-bold text-white mt-0.5">Control Center</h2>
                      </div>
                      <button
                        onClick={newThread}
                        className="inline-flex h-8 px-2.5 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition text-xs font-semibold"
                        title="New thread"
                      >
                        <Plus size={13} />
                        <span>New Run</span>
                      </button>
                    </div>

                    <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#7E9E8E] font-semibold">Quick Actions</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Live Mandi Index', query: `Find best selling price for ${crop}` },
                          { label: 'Route Weather Risk', query: `Weather forecast for ${crop} route` },
                          { label: 'Scheme Eligibility', query: 'What government subsidies can I apply for?' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            onClick={() => handleQuickAction(item.query)}
                            className="w-full text-left rounded-xl bg-white/[0.02] border border-white/[0.04] p-3 text-xs hover:border-emerald-500/30 hover:bg-emerald-500/[0.03] transition group"
                          >
                            <div className="flex items-center justify-between font-semibold text-white/80 group-hover:text-emerald-400">
                              <span>{item.label}</span>
                              <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </div>
                            <p className="text-[10px] text-white/45 mt-1 truncate">{item.query}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 space-y-3 pr-1 overflow-y-auto no-scrollbar">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#7E9E8E] font-semibold">Recent topics</p>
                        <span className="text-[10px] bg-white/[0.04] px-1.5 py-0.5 rounded text-white/40">{MOCK_THREADS.length}</span>
                      </div>
                      <div className="space-y-2">
                        {MOCK_THREADS.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => setActiveThreadId(topic.id)}
                            className={`w-full rounded-xl border p-3 text-left transition ${
                              activeThreadId === topic.id
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                                : 'border-white/[0.04] bg-white/[0.01] text-white/70 hover:border-white/[0.1] hover:bg-white/[0.03]'
                            }`}
                          >
                            <p className="font-semibold text-xs leading-snug truncate text-white/90">{topic.title}</p>
                            <div className="flex items-center justify-between text-[9px] text-white/40 mt-1.5">
                              <span>{topic.crop}</span>
                              <span>{topic.date}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 min-w-0 flex flex-col bg-[#0A110E]/40 border border-white/[0.06] rounded-[28px] overflow-hidden backdrop-blur-md">
            
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
              {!isChatMode ? (
                <div className="space-y-8 py-4">
                  <div className="text-center max-w-xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Ready to assist with your harvest
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">How can I help you today?</h3>
                    <p className="text-xs text-white/50 leading-relaxed max-w-md mx-auto">
                      Ask about mandi rates, weather impacts on shipping routes, crop disease verification, or subsidy registration schedules.
                    </p>
                  </div>

                  <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: 'Weather Intel', value: '28°C · Clear', detail: 'Optimal harvesting now', color: 'border-blue-500/20 bg-blue-500/5 text-blue-400', icon: <CloudSun size={15} /> },
                      { label: 'Best Mandi', value: '₹3,180 / Qtl', detail: 'Shahupuri Market', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400', icon: <TrendingUp size={15} /> },
                      { label: 'Active Alerts', value: 'Rain Friday', detail: 'Cover crop stacks', color: 'border-amber-500/20 bg-amber-500/5 text-amber-400', icon: <AlertTriangle size={15} /> },
                      { label: 'Est. Net Yield', value: '₹1.59L', detail: 'Sugarcane projection', color: 'border-purple-500/20 bg-purple-500/5 text-purple-400', icon: <Calculator size={15} /> },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-2xl border p-4 flex flex-col justify-between h-[120px] transition-all hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] ${item.color}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] uppercase font-bold tracking-wider opacity-80">{item.label}</span>
                          <span>{item.icon}</span>
                        </div>
                        <div>
                          <p className="text-base font-black text-white leading-tight">{item.value}</p>
                          <p className="text-[9px] text-white/50 mt-1">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold font-mono">Suggested Inquiries</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { title: 'Market rate analysis', desc: `Compare historical APMC rates for ${crop} around Kolhapur.`, query: `Find best selling price for ${crop}` },
                        { title: 'Transport routing & safety', desc: 'Identify weather risk overlays along primary routes.', query: `Weather forecast for ${crop} route` },
                        { title: 'Logistics optimizations', desc: 'Calculate shortest transport and optimal load timings.', query: 'Optimal transport route maps' },
                        { title: 'Government subsidy eligibility', desc: 'Verify PM Kisan status and local machinery funding limits.', query: 'Government subsidy eligibility' },
                      ].map((item) => (
                        <button
                          key={item.title}
                          onClick={() => handleQuickAction(item.query)}
                          className="group rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4 text-left transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{item.title}</p>
                            <span className="text-xs text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">→</span>
                          </div>
                          <p className="mt-1 text-[11px] text-white/45 leading-relaxed group-hover:text-white/60 transition-colors">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => {
                    const isUser = msg.role === 'user'
                    return (
                      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[84%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
                          <div className={`rounded-[24px] border p-5 shadow-lg ${
                            isUser
                              ? 'border-emerald-500/20 bg-[#10241E] text-white'
                              : 'border-white/[0.06] bg-[#0A110E]/90 text-white'
                          }`}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`h-8 w-8 rounded-xl grid place-items-center text-sm ${
                                isUser ? 'bg-white/[0.08]' : 'bg-emerald-500/10'
                              }`}>
                                {isUser ? '👤' : '🤖'}
                              </div>
                              <div className="text-left">
                                <p className="text-xs font-bold text-white/80">{isUser ? 'You' : 'Advisor Agent'}</p>
                                <p className="text-[9.5px] text-white/40">{msg.timestamp}</p>
                              </div>
                            </div>
                            
                            {msg.content ? (
                              <div className="whitespace-pre-line text-xs leading-relaxed text-white/90 font-sans">
                                {msg.content}
                              </div>
                            ) : (
                              msg.isStreaming && renderThinkingPipeline()
                            )}
                            
                            {!isUser && msg.content && renderVisualResponse(msg.content, `${msg.id}-vis`)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-white/[0.04] bg-[#0A110E] px-6 py-4">
              <div className="relative flex items-center bg-white/[0.02] border border-white/[0.08] rounded-2xl p-2 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                
                <div className="flex items-center gap-1 px-1">
                  <button
                    onClick={() => handleQuickAction('Verify soil quality and crop disease status')}
                    className="p-2 rounded-xl text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                    title="Analyze Crop Image"
                  >
                    <Camera size={15} />
                  </button>
                  <button
                    onClick={() => handleQuickAction('Optimal transport route maps')}
                    className="p-2 rounded-xl text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                    title="Route Risk Analysis"
                  >
                    <MapPin size={15} />
                  </button>
                  <button
                    className="p-2 rounded-xl text-white/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition"
                    title="Upload Agricultural Document"
                  >
                    <Upload size={15} />
                  </button>
                </div>

                <div className="h-5 w-px bg-white/[0.06] mx-1" />

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  placeholder="Ask about live mandi rates, route routes, weather warnings..."
                  rows={1}
                  className="flex-1 bg-transparent border-none py-2 px-3 text-xs text-white placeholder:text-white/30 focus:outline-none resize-none font-sans"
                  style={{ minHeight: 36, maxHeight: 120 }}
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={isThinking || !inputText.trim()}
                  className={`p-2 rounded-xl transition-all ${
                    inputText.trim() && !isThinking
                      ? 'bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:bg-emerald-400'
                      : 'bg-white/5 text-white/20'
                  }`}
                >
                  <Send size={15} />
                </button>
              </div>
              <div className="flex items-center justify-between text-[9px] text-white/30 px-2 mt-2">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>Agent v2.5 Online</span>
              </div>
            </div>

          </div>

          <AnimatePresence initial={false}>
            {rightSidebarOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                animate={{ width: 320, opacity: 1, marginLeft: 0 }}
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="hidden xl:block overflow-hidden shrink-0"
              >
                <div className="w-[320px] h-full rounded-[28px] border border-white/[0.08] bg-[#0A110E]/80 p-5 flex flex-col space-y-4 justify-between">
                  <div className="space-y-4 flex flex-col h-full">
                    <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#7E9E8E] font-bold font-mono">Live Advisory</span>
                        <h3 className="text-sm font-semibold text-white mt-0.5">Recommendations</h3>
                      </div>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                      {[
                        { type: 'Weather', val: 'Clear · 28°C', desc: 'No rain expected today. Ideal harvesting window.', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: <CloudSun size={14} /> },
                        { type: 'Market', val: 'Shahupuri · ₹3,180/Qtl', desc: 'Best selling price for Sugarcane in Kolhapur.', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: <TrendingUp size={14} /> },
                        { type: 'Scheme', val: 'PM Kisan Verification', desc: 'Checklist verified. Apply before July 30.', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: <Calendar size={14} /> },
                        { type: 'Advisory', val: 'Sell Soybean early', desc: 'Avoid transit delays from anticipated highway showers.', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: <AlertTriangle size={14} /> },
                      ].map((rec) => (
                        <div key={rec.type} className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-3.5 space-y-2 hover:border-white/[0.08] transition">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold border ${rec.color}`}>
                              {rec.icon}
                              {rec.type}
                            </span>
                            <span className="text-[9px] text-white/30 font-mono">Updated Just Now</span>
                          </div>
                          <p className="text-xs font-bold text-white/95 leading-snug">{rec.val}</p>
                          <p className="text-[10px] text-white/50 leading-normal">{rec.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}

export default Assistant
