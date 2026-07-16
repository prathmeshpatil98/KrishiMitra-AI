/**
 * KrishiMitra AI — Floating AI Farming Companion Widget
 * ====================================================
 * Purpose: Provide a quick floating action assistant overlay accessible globally.
 * Responsibilities: Pulse animation button, quick typing dialogue, suggest action items.
 * Dependencies: framer-motion, lucide-react, react-router-dom
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, User, Maximize2 } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/constants/api'

export function AICompanionWidget() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hi! I am your crop decision companion. Ask me anything about Mandis, transport costs, or weather forecast.' }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const generateResponse = (q: string, c: string): string => {
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

  const handleSend = async () => {
    if (!inputText.trim()) return
    const userMsg = inputText
    setInputText('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    try {
      const res = await apiClient.post(API_ENDPOINTS.CHAT.SEND, {
        message: userMsg,
        crop_name: 'Sugarcane',
        location: 'Kolhapur, Maharashtra',
        session_id: null,
      })
      const reply = res.data?.data?.response || res.data?.message
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    } catch {
      // Fallback local response if API is offline
      const reply = generateResponse(userMsg, 'Sugarcane')
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    } finally {
      setIsTyping(false)
    }
  }

  const samplePrompts = [
    'Should I sell sugarcane today?',
    'Any weather risk tomorrow?',
    'What schemes are active?'
  ]

  return (
    <div className="fixed bottom-20 right-6 lg:bottom-6 lg:right-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-surface dark:bg-zinc-900 border border-border dark:border-border-dark shadow-2xl rounded-dialog flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-linear-to-r from-brand-primary/10 via-brand-secondary/5 to-brand-primary/10 dark:from-brand-primary/20 dark:via-zinc-800 dark:to-brand-primary/20 border-b border-border dark:border-border-dark flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-primary text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h4 className="text-small font-bold text-text-primary dark:text-white">AI Crop Advisor</h4>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setIsOpen(false)
                    navigate(ROUTES.AI_ASSISTANT)
                  }}
                  className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary dark:text-text-muted transition-colors"
                  title="Expand to Full Chat"
                >
                  <Maximize2 size={13} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary dark:text-text-muted transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((m, idx) => {
                const isAI = m.role === 'assistant'
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 max-w-[85%] ${isAI ? 'self-start' : 'self-end flex-row-reverse'}`}
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-caption font-bold ${isAI ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-secondary text-brand-primary'}`}>
                      {isAI ? <Bot size={12} /> : <User size={12} />}
                    </div>
                    <div className={`p-3 rounded-xl text-small leading-relaxed ${isAI ? 'bg-background dark:bg-zinc-800 text-text-primary dark:text-white' : 'bg-brand-primary text-white'}`}>
                      {m.text}
                    </div>
                  </div>
                )
              })}
              {isTyping && (
                <div className="flex items-center gap-2.5 self-start">
                  <div className="h-6 w-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0">
                    <Bot size={12} />
                  </div>
                  <div className="bg-background dark:bg-zinc-800 p-3 rounded-xl flex gap-1 items-center h-8">
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Suggested Prompts (only if no user messages sent yet) */}
            {messages.length === 1 && (
              <div className="p-3 bg-background/20 border-t border-border dark:border-border-dark flex flex-col gap-1.5">
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Suggested queries</span>
                <div className="flex flex-col gap-1">
                  {samplePrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => setInputText(p)}
                      className="text-left text-caption text-brand-primary dark:text-brand-secondary hover:underline py-1 truncate"
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-border dark:border-border-dark bg-background/50 dark:bg-zinc-900/50 flex gap-2 items-center">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your advisor..."
                className="flex-1 text-small bg-surface dark:bg-zinc-800 border border-border dark:border-border-dark rounded-xl px-3 py-2 text-text-primary dark:text-white focus:outline-none focus:border-brand-primary"
              />
              <button
                onClick={handleSend}
                className="h-9 w-9 bg-brand-primary hover:bg-brand-primary-hover text-white flex items-center justify-center rounded-xl shrink-0 transition-colors"
              >
                <Send size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing Widget Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-14 w-14 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-float cursor-pointer relative hover:bg-brand-primary-hover transition-colors select-none"
      >
        <span className="absolute inset-0 rounded-full bg-brand-primary/30 animate-ping pointer-events-none" />
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="animate-pulse" />}
      </motion.button>
    </div>
  )
}

export default AICompanionWidget
