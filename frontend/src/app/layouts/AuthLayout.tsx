/**
 * KrishiMitra AI — Premium Greenery Combo Auth Layout
 * ====================================================
 * Redesigned from first principles to match professional agritech design language.
 * Features:
 * - Natural Forest Green (#040E06) and Deep Moss Green theme base
 * - Ambient sunlit harvest gold (#D4AF37) and organic emerald auroras
 * - Floating golden dust particles (representing sunlit crop spores)
 * - 3D Mouse Parallax interactive panels with detailed sparkline guides
 */

import { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Sprout, Sparkles, CloudRain, ShieldCheck } from 'lucide-react'

// Generate deterministic positions for golden crop dust/spore particles
const DUST_PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: Math.floor(Math.random() * 3.5) + 1.5,
  left: Math.floor(Math.random() * 100),
  delay: Math.random() * 6,
  duration: Math.random() * 14 + 10,
}))

export function AuthLayout() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { stiffness: 45, damping: 20 }
  const parallaxX = useSpring(mouseX, springConfig)
  const parallaxY = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const { clientX, clientY } = e
      const width = window.innerWidth
      const height = window.innerHeight
      const x = (clientX / width) - 0.5
      const y = (clientY / height) - 0.5
      setCoords({ x, y })
      
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div
      ref={containerRef}
      className="flex min-h-screen bg-[#040E06] text-white select-none relative overflow-hidden font-sans"
    >
      {/* ── Background Cinematic FX (Unified Greenery & Harvest Gold theme) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Base dark forest background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#08220f] via-[#040e06] to-[#010502] opacity-100" />

        {/* Ambient Organic Spotlights */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            x: parallaxX.get() * 60,
            y: parallaxY.get() * 60,
          }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] bg-emerald-800"
        />
        <motion.div
          animate={{
            scale: [1.08, 1, 1.08],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            x: parallaxX.get() * -75,
            y: parallaxY.get() * -75,
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[650px] h-[650px] rounded-full blur-[140px] bg-amber-700/80"
        />

        {/* Floating Harvest Dust Particles */}
        {DUST_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-amber-400/20 rounded-full blur-[0.3px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              bottom: '-5%',
            }}
            animate={{
              y: ['0vh', '-110vh'],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          />
        ))}

        {/* Satellite Coordinate Grid layer */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        {/* Shimmering grain noise texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Subtle vignette shadow */}
        <div className="absolute inset-0 bg-vignette pointer-events-none" />
      </div>

      {/* ── Left Branding Panel (Cinematic AI Workspace Showcase) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-white/[0.04] z-10"
        style={{ perspective: 1000 }}
      >
        {/* Animated Topographic curves */}
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 800 800"
          fill="none"
          className="absolute inset-0 opacity-[0.04] stroke-white pointer-events-none"
          style={{
            x: parallaxX.get() * -20,
            y: parallaxY.get() * -20,
          }}
        >
          <path d="M-100 200 C 150 150, 450 350, 900 250" strokeWidth="1.2" className="animate-topo-flow" style={{ animationDuration: '35s' }} />
          <path d="M-100 350 C 200 300, 400 500, 900 400" strokeWidth="1.2" className="animate-topo-flow" style={{ animationDuration: '45s' }} />
          <path d="M-100 500 C 250 450, 500 650, 900 550" strokeWidth="1.2" className="animate-topo-flow" style={{ animationDuration: '40s' }} />
        </motion.svg>

        {/* Logo Header */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-900/30 border border-emerald-800/40 backdrop-blur-md shadow-lg"
          >
            <Sprout className="text-gold-DEFAULT" size={22} />
          </motion.div>
          <div>
            <div className="text-[14px] font-black text-white leading-none tracking-wider uppercase">KrishiMitra AI</div>
            <div className="text-[9px] text-zinc-555 font-extrabold uppercase tracking-widest mt-1">Farming Intelligence Platform</div>
          </div>
        </div>

        {/* Center content: Hero Header & Parallax Cards stack */}
        <div className="my-auto py-4 flex flex-col gap-10 items-start w-full">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
              className="text-[2.6rem] font-display text-white leading-[1.0] uppercase tracking-tighter max-w-lg font-black"
            >
              Empower Your<br />
              <span className="text-gold-DEFAULT relative inline-block">
                Farming Decisions
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8, ease: 'circOut' }}
                  className="absolute bottom-[-4px] left-0 right-0 h-[2.5px] bg-gold-DEFAULT rounded-full origin-left"
                />
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-zinc-400 text-[14.5px] leading-relaxed max-w-md font-medium mt-5"
            >
              Hyper-local agricultural intelligence dashboards. Live price feeds, crop safety gauges, and government subsidies verified instantly.
            </motion.p>
          </div>

          {/* Layered Parallax UI Mockup Workspace */}
          <div className="relative w-full max-w-[440px] h-[310px] mt-4 flex items-center justify-center">
            {/* Layer 1: Core Dashboard Window */}
            <motion.div
              style={{
                x: parallaxX.get() * 35,
                y: parallaxY.get() * 35,
                rotateY: coords.x * 12,
                rotateX: coords.y * -12,
              }}
              className="absolute w-full bg-slate-900/35 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl z-20 transition-all duration-200"
            >
              {/* Browser window top bar */}
              <div className="px-4 py-3 bg-zinc-950/90 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-6 bg-zinc-950/60 border border-white/5 rounded-md py-0.5 text-[9px] text-zinc-555 font-mono text-center tracking-wider">
                  krishimitra.ai/intelligence
                </div>
                <div className="w-6" />
              </div>

              {/* Mock Window body */}
              <div className="p-5 flex flex-col gap-4 bg-zinc-950/15">
                {/* Price sparkline with grid coordinates */}
                <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest">Live Mandi Index</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[15px] font-black text-white">₹3,180/Qtl</span>
                      <span className="text-[8.5px] font-black text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.2 rounded">
                        +2.1%
                      </span>
                    </div>
                  </div>
                  {/* Chart sparkline */}
                  <div className="w-20 h-7 relative">
                    <svg width="100%" height="100%" viewBox="0 0 80 32" fill="none">
                      <line x1="60" y1="0" x2="60" y2="32" stroke="rgba(245,158,11,0.25)" strokeWidth="1" strokeDasharray="2 2" />
                      <path
                        d="M0 24 Q10 18 20 20 T40 10 T60 14 T80 4"
                        stroke="#F59E0B"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="60" cy="14" r="3.5" fill="#F59E0B" className="animate-pulse" />
                      <circle cx="60" cy="14" r="1.5" fill="#FFFFFF" />
                      <path
                        d="M0 24 Q10 18 20 20 T40 10 T60 14 T80 4 L80 32 L0 32 Z"
                        fill="url(#sparklineGrad)"
                        opacity="0.15"
                      />
                      <defs>
                        <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* AI Advisor dialogue snippet */}
                <div className="flex flex-col gap-3">
                  {/* User Question */}
                  <div className="self-end bg-zinc-900/50 border border-white/[0.04] rounded-xl rounded-tr-none px-3 py-2 max-w-[80%] text-[10.5px] text-zinc-350 font-medium shadow-sm">
                    Verify transport transit window.
                  </div>
                  {/* Advisor Response */}
                  <div className="self-start bg-emerald-500/10 border border-emerald-500/20 rounded-xl rounded-tl-none px-3 py-2 max-w-[90%] text-[11px] text-zinc-300 font-medium flex items-start gap-1.5 shadow-sm">
                    <Sparkles size={11} className="text-gold-DEFAULT mt-0.5 shrink-0 animate-pulse" />
                    <div>
                      Optimal: Clear routes & low rain risks predicted. Net yield maximized.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Layer 2: Floating Climate Widget (Overlaps Bottom Right) */}
            <motion.div
              style={{
                x: parallaxX.get() * 55 + 90,
                y: parallaxY.get() * 55 + 130,
              }}
              className="absolute p-4 bg-slate-900/70 border border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-2xl z-30 flex items-center gap-3 w-52"
            >
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                <CloudRain size={16} className="animate-bounce" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-555 font-extrabold uppercase">Weather Node</span>
                <span className="text-[12.5px] font-black text-white">15% Rain Prob</span>
                <span className="text-[8.5px] text-zinc-400 font-bold">Kolhapur · Low Risk</span>
              </div>
            </motion.div>

            {/* Layer 3: Floating Aadhaar Verified Badge (Overlaps Top Right) */}
            <motion.div
              style={{
                x: parallaxX.get() * -20 + 120,
                y: parallaxY.get() * -20 - 110,
              }}
              className="absolute p-2.5 px-3.5 bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl rounded-full shadow-2xl z-10 flex items-center gap-2 w-48"
            >
              <ShieldCheck size={14} className="text-emerald-400 animate-pulse" />
              <span className="text-[9.5px] font-black text-white uppercase tracking-wider">Aadhaar Verified</span>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-zinc-650 text-[10px] font-extrabold uppercase tracking-widest border-t border-white/5 pt-4">
          © 2026 KrishiMitra AI. Built for Indian Farmers.
        </div>
      </div>

      {/* ── Right Form Panel (Cinematic Floating Portal) ── */}
      <div
        className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 relative z-10"
      >
        {/* Mobile Header Branding */}
        <div className="mb-8 flex lg:hidden items-center gap-3 relative z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-green shadow-lg">
            <Sprout className="text-gold-DEFAULT" size={20} />
          </div>
          <div>
            <span className="text-[16px] font-black text-white uppercase tracking-wide block leading-none">
              KrishiMitra AI
            </span>
            <span className="text-[8.5px] text-text-muted font-bold block uppercase tracking-widest mt-1">
              Farming Intelligence
            </span>
          </div>
        </div>

        {/* Glassmorphism Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-slate-900/35 border border-white/[0.08] backdrop-blur-2xl p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Speck of light inside the card */}
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}

export default AuthLayout
