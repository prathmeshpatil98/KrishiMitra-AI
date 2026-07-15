import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, CloudSun, Volume2 } from 'lucide-react'
import { useLanguage } from '@/app/providers/LanguageProvider'

interface HeroSectionProps {
  user: any
  harvestRisk: {
    level: string
    color: string
    tip: string
  }
  rainProb: number
  temp: number
}

// Generate static config for particles once to keep render stable
const PARTICLES = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  size: Math.random() * 5 + 3,
  x: Math.random() * 90 + 5,
  y: Math.random() * 90 + 5,
  duration: Math.random() * 12 + 10,
  delay: Math.random() * 4,
  color: Math.random() > 0.5 ? 'bg-emerald-400/20' : 'bg-amber-400/15',
}))

export function HeroSection({ user, harvestRisk, rainProb, temp }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  // Mouse coordinate state normalized to [-0.5, 0.5] for parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5
      const y = (e.clientY / window.innerHeight) - 0.5
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 } 
    },
  }

  const wordRevealVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
    show: { 
      opacity: 1, 
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: 'easeOut' as const }
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#08120E] pt-32 pb-20 border-b border-white/[0.04] noise-bg"
    >
      {/* Dynamic Parallax Backdrops & Auroras */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Parallax Image Overlay */}
        <motion.div
          style={{
            x: mousePos.x * 35,
            y: mousePos.y * 35,
            backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2400&q=85')"
          }}
          className="absolute inset-0 bg-cover bg-center opacity-[0.09] scale-105 transition-transform duration-500 ease-out"
        />
        
        {/* Vibrant Layered Glowing Mesh Blobs */}
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[150px] bg-gradient-to-br from-emerald-500/12 to-teal-500/5 mix-blend-screen"
        />
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2
          }}
          className="absolute bottom-[-10%] right-[-15%] w-[55vw] h-[55vw] rounded-full blur-[170px] bg-gradient-to-br from-[#d97706]/10 to-[#2ECC71]/4 mix-blend-screen"
        />
        <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full blur-[140px] bg-emerald-700/8" />
        
        {/* Fine-grid mesh lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        {/* Floating Agricultural Seed Particles */}
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className={`absolute rounded-full ${p.color} mix-blend-screen`}
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -140, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.15, 0.75, 0.15],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Hero Content (Centered Layout) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-7"
        >
          {/* Eyebrow badge with glow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10.5px] font-black uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('hero_agent_eyebrow')}
          </motion.div>

          {/* Editorial Serif Heading with Glowing Text Gradient */}
          <motion.h1
            variants={itemVariants}
            className="text-white font-display leading-[1.05] uppercase tracking-tighter font-black text-[2.8rem] sm:text-[4rem] lg:text-[5rem] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
          >
            <motion.span variants={wordRevealVariants} className="inline-block">{t('hero_empower')}</motion.span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-[#43F59A] bg-clip-text text-transparent relative inline-block">
              <motion.span variants={wordRevealVariants} className="inline-block">{t('hero_decisions')}</motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: 'circOut' }}
                className="absolute bottom-[-2px] left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-400 to-[#43F59A] rounded-full origin-left shadow-[0_1px_8px_rgba(52,211,153,0.5)]"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 font-medium max-w-2xl leading-relaxed text-[15px] sm:text-[17px] text-center"
          >
            {t('hero_welcome_back')} <strong className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-extrabold">{user?.farmer_profile?.full_name ?? 'Pratiksha Tiwari'}</strong>. 
            {t('hero_subtitle_synthesizes')}
          </motion.p>

          {/* Climate Status Chip with soft dynamic styling */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:border-emerald-500/20 transition-colors">
              <CloudSun size={15} className="text-emerald-400 animate-pulse" />
              <span className="text-zinc-300 text-[11.5px] font-bold font-mono">
                {temp}°C · Kolhapur · {harvestRisk.level}
              </span>
              <span
                className={`w-2 h-2 rounded-full animate-ping ${
                  rainProb < 30 ? 'bg-emerald-400' : rainProb < 50 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
            </div>
          </motion.div>

          {/* Action Buttons with Advanced hover transitions & glows */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center justify-center mt-2">
            <a href="#services">
              <button className="px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-wider bg-gradient-to-r from-emerald-500 to-[#43F59A] hover:from-emerald-400 hover:to-[#53ffa7] text-[#08120E] flex items-center gap-2 group transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer">
                {t('hero_btn_services')}
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a href="#ai-advisor">
              <button className="px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-wider border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] hover:border-emerald-500/20 text-white flex items-center gap-2 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer">
                <Volume2 size={15} className="text-emerald-400 animate-pulse" />
                {t('hero_btn_talk')}
              </button>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
export default HeroSection
