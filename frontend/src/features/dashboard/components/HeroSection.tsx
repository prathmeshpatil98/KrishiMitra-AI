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
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 18 } },
  }

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#08120E] pt-32 pb-20 border-b border-white/[0.04]"
    >
      {/* Dynamic Parallax Backdrops & Auroras */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Parallax Image Overlay */}
        <motion.div
          style={{
            x: mousePos.x * 25,
            y: mousePos.y * 25,
            backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2400&q=85')"
          }}
          className="absolute inset-0 bg-cover bg-center opacity-[0.08] scale-105"
        />
        {/* Specular Ambient Glows */}
        <div className="absolute top-[20%] left-[25%] w-[600px] h-[600px] rounded-full blur-[140px] bg-[#2ECC71]/8" />
        <div className="absolute bottom-[20%] right-[25%] w-[600px] h-[600px] rounded-full blur-[140px] bg-[#43F59A]/6" />
        
        {/* Fine-grid mesh lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Hero Content (Centered Layout) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-7"
        >
          {/* Eyebrow badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] text-[10.5px] font-black uppercase tracking-[0.2em]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
            Autonomous Agriculture Agent
          </motion.div>

          {/* Editorial Serif Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-white font-display leading-[1.05] uppercase tracking-tighter font-black text-[2.8rem] sm:text-[4rem] lg:text-[4.8rem]"
          >
            Empower Your<br />
            <span className="text-[#43F59A] relative inline-block">
              Farming  Decisions
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: 'circOut' }}
                className="absolute bottom-[-2px] left-0 right-0 h-[2.5px] bg-[#43F59A] rounded-full origin-left"
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 font-medium max-w-2xl leading-relaxed text-[15px] sm:text-[17px] text-center"
          >
            Welcome back, <strong className="text-white font-extrabold">{user?.farmer_profile?.full_name ?? 'Pratiksha Tiwari'}</strong>. 
            KrishiMitra synthesizes real time APMC Mandi feeds, soil parameters and climate matrix indices to help optimize your harvest profit yields.
          </motion.p>

          {/* Climate Status Chip */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-lg">
              <CloudSun size={15} className="text-[#43F59A] animate-pulse" />
              <span className="text-zinc-300 text-[11.5px] font-bold font-mono">
                {temp}°C · Kolhapur · {harvestRisk.level}
              </span>
              <span
                className={`w-2 h-2 rounded-full animate-ping ${
                  rainProb < 30 ? 'bg-[#2ECC71]' : rainProb < 50 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center justify-center mt-2">
            <a href="#services">
              <button className="px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-wider bg-[#2ECC71] hover:bg-[#2ECC71]/90 text-[#08120E] flex items-center gap-2 group transition-all duration-300 hover:shadow-lg hover:shadow-[#2ECC71]/10">
                {t('hero_btn_services')}
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a href="#ai-advisor">
              <button className="px-6 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-wider border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] text-white flex items-center gap-2 transition-all">
                <Volume2 size={15} className="text-[#43F59A] animate-pulse" />
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
