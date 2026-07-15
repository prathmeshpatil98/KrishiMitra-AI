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

  const handleSend = () => {
    if (!inputText.trim()) return
    const userMsg = inputText
    setInputText('')
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setIsTyping(true)

    // Simulate AI thinking and reply
    setTimeout(() => {
      setIsTyping(false)
      let reply = 'I recommend selling Sugarcane in Kolhapur Mandi for a net profit of ₹3,52,000. Price is at ₹3,150/Qtl, and the route is weather safe!'
      if (userMsg.toLowerCase().includes('weather')) {
        reply = 'Weather forecast shows clear driving conditions today, but light showers are expected on Wednesday.'
      } else if (userMsg.toLowerCase().includes('scheme') || userMsg.toLowerCase().includes('subsidy')) {
        reply = 'You are eligible for PM-Kisan Samman Nidhi and PMFBY weather insurance. Sowing crop insurance applications are active.'
      }
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    }, 1500)
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
