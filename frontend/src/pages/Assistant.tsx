/**
 * KrishiMitra AI — Premium AI Assistant Chat Interface
 * ====================================================
 * Design: Minimal, high-end Stripe/Linear aesthetic with reasoning timelines,
 * markdown parsing, typing simulators, tool status code viewers, and suggested prompts.
 */

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  MessageSquare,
  HelpCircle,
  Menu,
  Terminal
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'

// Types
interface ToolExecution {
  name: string
  status: 'running' | 'success' | 'failed'
  inputs: Record<string, any>
  outputs?: Record<string, any>
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  reasoningSteps?: string[]
  toolsCalled?: ToolExecution[]
  isStreaming?: boolean
}

interface Thread {
  id: string
  title: string
  date: string
}

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Welcome to KrishiMitra AI Assistant! 🌾\n\nI am connected to live market databases, OpenWeather forecasts, and transportation routing maps.\n\nAsk me anything about selling crops, transport estimates, mandi price comparisons, or government subsidies.`,
      timestamp: 'Just now'
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [expandedToolIndex, setExpandedToolIndex] = useState<string | null>(null)
  
  const [threads, setThreads] = useState<Thread[]>([
    { id: '1', title: 'Wheat Profit optimization Ujjain', date: 'Today' },
    { id: '2', title: 'Paddy crop insurance deadline', date: 'Yesterday' }
  ])
  const [activeThreadId, setActiveThreadId] = useState('1')

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  // Suggested Prompts
  const suggestedPrompts = [
    "Where should I sell my wheat near Indore to maximize profit?",
    "Check weather risk for crop transport tomorrow.",
    "Show active government schemes for potato farming in MP."
  ]

  // Custom regex markdown-to-HTML parser that renders bold, bullet points, headers, and hyperlinks cleanly
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      let trimmed = line.trim()
      
      // Headers
      if (trimmed.startsWith('## ')) {
        return <h3 key={idx} className="text-h3 font-black text-text-primary dark:text-white mt-4 mb-2">{trimmed.replace('## ', '')}</h3>
      }
      if (trimmed.startsWith('* **')) {
        // Bullet with bold prefix
        const match = trimmed.match(/^\*\s+\*\*(.*?)\*\*:\s*(.*)/)
        if (match) {
          return (
            <div key={idx} className="flex gap-2 text-small text-text-secondary dark:text-text-muted ml-2 py-0.5">
              <span className="text-brand-primary">•</span>
              <span><strong>{match[1]}:</strong> {match[2]}</span>
            </div>
          )
        }
      }
      if (trimmed.startsWith('* ')) {
        return (
          <div key={idx} className="flex gap-2 text-small text-text-secondary dark:text-text-muted ml-2 py-0.5">
            <span className="text-brand-primary">•</span>
            <span>{trimmed.replace('* ', '')}</span>
          </div>
        )
      }
      if (trimmed.startsWith('- ')) {
        return (
          <div key={idx} className="flex gap-2 text-small text-text-secondary dark:text-text-muted ml-2 py-0.5">
            <span className="text-brand-primary">•</span>
            <span>{trimmed.replace('- ', '')}</span>
          </div>
        )
      }

      // Handle raw inline bold words like **Ujjain Mandi**
      const boldPattern = /\*\*(.*?)\*\*/g
      if (boldPattern.test(trimmed)) {
        const parts = trimmed.split(boldPattern)
        return (
          <p key={idx} className="text-small text-text-secondary dark:text-text-muted py-1 leading-relaxed">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-text-primary dark:text-white font-bold">{part}</strong> : part)}
          </p>
        )
      }

      if (trimmed === '') {
        return <div key={idx} className="h-2" />
      }

      return <p key={idx} className="text-small text-text-secondary dark:text-text-muted py-0.5 leading-relaxed">{trimmed}</p>
    })
  }

  // Handle message submission with mock streaming response
  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return

    // 1. Append User Message
    const userMessageId = `user-${Date.now()}`
    setMessages(prev => [...prev, {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }])
    setInputText('')
    setIsThinking(true)

    // 2. Simulate LangGraph Node Reasoning and Tool Executions Timeline
    await new Promise(resolve => setTimeout(resolve, 800))
    const steps = [
      "Planner Agent activated: Parsing crop 'Wheat' & state 'Madhya Pradesh'...",
      "Weather API tool: Lat 22.71, Lng 75.85 called successfully",
      "Agmarknet Mandis list price lookup: wheat trends retrieved",
      "Google Maps Distance Matrix: route cost calculations computed",
      "Profit Margin ranking calculated: Indore Mandi vs Ujjain Mandi",
      "consensus reached in Decision Agent. Formulating response..."
    ]

    const tools: ToolExecution[] = [
      { name: 'get_weather', status: 'success', inputs: { latitude: 22.7196, longitude: 75.8577 }, outputs: { temp: 29.5, rain_prob: 0.15, status: 'Clear' } },
      { name: 'get_market_prices', status: 'success', inputs: { crop_name: 'Wheat', state: 'Madhya Pradesh' }, outputs: { markets: [{ name: 'Ujjain Mandi', price: 2510.0 }, { name: 'Indore Mandi', price: 2450.0 }] } },
      { name: 'calculate_distance', status: 'success', inputs: { origin: 'Indore', dest: 'Ujjain' }, outputs: { distance_km: 45.8, travel_time: '1h', total_cost: 469.30 } }
    ]

    // Append Assistant Placeholder message
    const assistantMessageId = `assistant-${Date.now()}`
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasoningSteps: steps,
      toolsCalled: tools,
      isStreaming: true
    }])
    setIsThinking(false)

    // 3. Simulate Streaming Response
    const finalContent = `## 🌾 Crop Sale Recommendation: **Wheat** (100.0 Quintals)

* **Best Market**: Ujjain Mandi
* **Expected Net Profit**: ₹2,44,010.70
* **Best Selling Day**: Friday
* **Weather Risk Advice**: Weather is ideal for transit and harvest.

### 💡 Analysis & Reasoning:
Selling in Ujjain Mandi yields the highest net profit of Rs. 2,44,010.70 after accounting for transport costs (Rs. 469.30) and labor loading fees. The weather risk is LOW.

### 📋 Recommended Schemes:
- **PM Kisan Samman Nidhi**: Rs. 6000 per year (Website: [Click Here](https://pmkisan.gov.in))
- **Pradhan Mantri Fasal Bima Yojana (PMFBY)**: Insurance coverage against weather risks (Website: [Click Here](https://pmfby.gov.in))`

    let currentLength = 0
    const interval = setInterval(() => {
      currentLength += Math.min(10, finalContent.length - currentLength)
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMessageId) {
          return {
            ...m,
            content: finalContent.substring(0, currentLength),
            isStreaming: currentLength < finalContent.length
          }
        }
        return m
      }))

      if (currentLength >= finalContent.length) {
        clearInterval(interval)
      }
    }, 40)
  }

  return (
    <div className="flex h-[calc(100vh-140px)] border border-border-primary/5 rounded-card overflow-hidden bg-background-primary dark:bg-zinc-950 relative">
      
      {/* ── Left Sidebar (Thread History) ───────────────────────────────────────── */}
      <div className={`w-80 border-r border-border-primary/5 bg-background-secondary/5 dark:bg-zinc-900/50 flex-col gap-4 p-4 md:flex ${isSidebarOpen ? 'flex absolute inset-y-0 left-0 z-50 bg-background-primary dark:bg-zinc-950 shadow-2xl' : 'hidden'}`}>
        <div className="flex justify-between items-center pb-2 border-b border-border-primary/5">
          <h2 className="font-black text-text-primary dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-brand-primary" /> Chat Sessions
          </h2>
          {isSidebarOpen && (
            <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)} className="md:hidden">
              Close
            </Button>
          )}
        </div>

        <Button variant="outline" className="w-full justify-start gap-2 bg-background-primary dark:bg-zinc-950" onClick={() => {
          setMessages([
            { id: 'welcome', role: 'assistant', content: 'Ready for new advisory optimization questions.', timestamp: 'Now' }
          ])
          const newThread = { id: String(Date.now()), title: 'New chat session', date: 'Just now' }
          setThreads([newThread, ...threads])
          setActiveThreadId(newThread.id)
          setIsSidebarOpen(false)
        }}>
          <Plus size={16} /> New Chat
        </Button>

        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1">
          {threads.map((thread) => (
            <div 
              key={thread.id} 
              onClick={() => {
                setActiveThreadId(thread.id)
                setIsSidebarOpen(false)
              }}
              className={`p-3 rounded-xl flex items-start gap-3 cursor-pointer border transition-all text-small ${activeThreadId === thread.id ? 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary font-semibold' : 'border-transparent hover:bg-border-primary/2 text-text-secondary dark:text-text-muted'}`}
            >
              <MessageSquare size={16} className="shrink-0 mt-0.5 text-text-muted" />
              <div className="flex-1 truncate leading-tight">{thread.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Main Chat Area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full bg-background-primary dark:bg-zinc-950">
        
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-primary/5 md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </Button>
          <span className="font-bold text-text-primary dark:text-white text-small">AI Advisor Sandbox</span>
          <div className="w-8" /> {/* offset spacer */}
        </div>

        {/* Message Feed container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-4 items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Avatar Icon */}
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/10">
                    <Bot size={16} />
                  </div>
                )}

                {/* Message Body Bubble */}
                <div className={`flex flex-col gap-2 max-w-[85%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Reasoning Timeline (collapsible timeline before markdown message) */}
                  {message.role === 'assistant' && message.reasoningSteps && (
                    <div className="w-full border border-border-primary/5 rounded-xl bg-background-secondary/2 p-3 flex flex-col gap-2 mb-2 shadow-inner">
                      <div className="flex justify-between items-center text-caption font-bold text-text-secondary dark:text-text-muted uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Terminal size={14} className="text-brand-primary animate-pulse" /> Reasoning & Agent Tools Timeline</span>
                        <Badge variant="success" className="text-[9px] px-1 py-0.5">COMPLETED</Badge>
                      </div>
                      <div className="flex flex-col gap-1.5 pl-1.5 border-l border-brand-primary/20 mt-1">
                        {message.reasoningSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-[11px] text-text-secondary dark:text-text-muted">
                            <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="font-mono">{step}</span>
                          </div>
                        ))}
                      </div>

                      {/* Decoupled Tool Executions JSON Status */}
                      {message.toolsCalled && (
                        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border-primary/5">
                          {message.toolsCalled.map((tool, tIdx) => {
                            const uniqueToolKey = `${message.id}-tool-${tIdx}`
                            const isExpanded = expandedToolIndex === uniqueToolKey
                            return (
                              <div key={tIdx} className="w-full flex flex-col">
                                <div 
                                  onClick={() => setExpandedToolIndex(isExpanded ? null : uniqueToolKey)}
                                  className="flex justify-between items-center p-2 rounded-lg bg-border-primary/5 border border-border-primary/5 hover:bg-border-primary/10 transition-colors cursor-pointer text-caption font-mono"
                                >
                                  <span className="flex items-center gap-1.5">
                                    <Terminal size={12} className="text-text-muted" /> tool: <strong>{tool.name}</strong>
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-emerald-500 font-bold uppercase">{tool.status}</span>
                                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                  </div>
                                </div>
                                {isExpanded && (
                                  <pre className="p-3 bg-zinc-900 text-zinc-100 rounded-lg text-[10px] font-mono mt-1 overflow-x-auto border border-zinc-800">
                                    {JSON.stringify({ arguments: tool.inputs, response: tool.outputs }, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text/Content bubble */}
                  <div className={`p-4 rounded-card border shadow-xs ${message.role === 'user' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-background-secondary/2 border-border-primary/5 text-text-primary dark:text-white'}`}>
                    {message.role === 'user' ? (
                      <p className="text-small leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {renderMarkdown(message.content)}
                        {message.isStreaming && (
                          <div className="inline-flex gap-1 items-center mt-2">
                            <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce" />
                            <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="h-1.5 w-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-text-secondary dark:text-text-muted mt-1 select-none">
                    {message.timestamp}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-border-primary/10 flex items-center justify-center shrink-0 border border-border-primary/5">
                    <User size={16} className="text-text-primary dark:text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Thinking / Loading Animation bubble */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 items-start"
              >
                <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/10">
                  <Bot size={16} />
                </div>
                <div className="flex flex-col gap-1.5 max-w-[85%]">
                  <div className="p-4 rounded-card border border-border-primary/5 bg-background-secondary/2 text-text-secondary flex items-center gap-3">
                    <Clock size={16} className="text-brand-primary animate-spin" />
                    <span className="text-small font-medium animate-pulse">Running agent reasoning graph nodes...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Prompts Section (only display if messages count is low/initial welcome) */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-border-primary/5 flex flex-col gap-2 bg-background-secondary/1 flex-wrap md:flex-row justify-center select-none">
            {suggestedPrompts.map((prompt, idx) => (
              <div 
                key={idx}
                onClick={() => handleSend(prompt)}
                className="p-3 border border-border-primary/5 rounded-xl hover:border-brand-primary/30 hover:bg-brand-primary/2 hover:text-brand-primary cursor-pointer text-caption text-text-secondary dark:text-text-muted transition-all text-center flex items-center gap-1.5 md:max-w-xs"
              >
                <HelpCircle size={14} className="shrink-0" />
                <span className="truncate">{prompt}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Chat Input Panel ────────────────────────────────────────────────── */}
        <div className="p-4 border-t border-border-primary/5 bg-background-secondary/1">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleSend(inputText)
            }}
            className="flex gap-2 max-w-5xl mx-auto items-center"
          >
            <div className="flex-1 relative">
              <Input
                placeholder="Ask KrishiMitra AI..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isThinking}
                className="pr-12 py-6 bg-background-primary dark:bg-zinc-950 focus:border-brand-primary"
              />
              <div className="absolute right-3 top-3.5 text-text-muted">
                <Sparkles size={18} className="animate-pulse text-brand-primary/40" />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={!inputText.trim() || isThinking}
              className="bg-brand-primary hover:bg-brand-primary/95 text-white h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
            >
              <Send size={18} />
            </Button>
          </form>
          <div className="text-[10px] text-center text-text-secondary dark:text-text-muted mt-2">
            KrishiMitra AI optimizes profits dynamically. Verify critical mandi logistics schedules.
          </div>
        </div>

      </div>
    </div>
  )
}
