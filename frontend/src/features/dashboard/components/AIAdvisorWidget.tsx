import { motion } from 'framer-motion'
import { Bot, ChevronRight, TrendingUp, CloudSun, Compass, ShieldAlert, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useLanguage } from '@/app/providers/LanguageProvider'

export function AIAdvisorWidget() {
  const { t } = useLanguage()

  const FEATURE_CARDS = [
    {
      title: t('ai_advisor_live_price'),
      desc: t('ai_advisor_live_desc'),
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      icon: TrendingUp,
    },
    {
      title: t('ai_advisor_climate_title'),
      desc: t('ai_advisor_climate_desc'),
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      icon: CloudSun,
    },
    {
      title: t('ai_advisor_subsidy_title'),
      desc: t('ai_advisor_subsidy_desc'),
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      icon: ShieldAlert,
    },
    {
      title: t('ai_advisor_trilingual_title'),
      desc: t('ai_advisor_trilingual_desc'),
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      icon: Zap,
    },
  ]

  const FLOATING_MODULES = [
    {
      icon: TrendingUp,
      label: t('market_title'),
      value: 'Sugarcane: +4.2%',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      pos: 'top-10 left-6',
      bob: [0, -7, 0],
      dur: 5,
    },
    {
      icon: Compass,
      label: t('transport_est_cost'),
      value: '₹120 / optimal',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      pos: 'top-16 right-8',
      bob: [0, -4, 0],
      dur: 5.5,
      delay: 0.2,
    },
    {
      icon: CloudSun,
      label: t('nav_weather'),
      value: 'Clear / Kolhapur',
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      pos: 'bottom-10 right-6',
      bob: [0, 7, 0],
      dur: 6,
      delay: 0.5,
    },
    {
      icon: ShieldAlert,
      label: t('nav_schemes'),
      value: 'KYC Verified',
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      pos: 'bottom-16 left-8',
      bob: [0, 5, 0],
      dur: 6.5,
      delay: 0.8,
    },
  ]

  return (
    <section
      id="ai-advisor"
      className="w-full py-28 relative overflow-hidden bg-[#08120E] border-b border-white/[0.04]"
    >
      {/* Vibrant aurora backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-15%] left-[-5%] w-[55vw] h-[55vw] rounded-full blur-[160px] opacity-70"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)', animation: 'aurora-drift-1 20s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-70"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)', animation: 'aurora-drift-2 24s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[40%] right-[30%] w-[28vw] h-[28vw] rounded-full blur-[100px] opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', animation: 'aurora-drift-3 16s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      </div>

      {/* Scoped CSS */}
      <style>{`
        @keyframes sonarSweep {
          0%   { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .sonar-ring { animation: sonarSweep 4s infinite linear; }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col gap-6 text-left"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-[9.5px] font-black uppercase tracking-[0.2em] w-fit shadow-[0_0_16px_rgba(139,92,246,0.12)]">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              {t('ai_advisor_eyebrow')}
            </div>

            <h2 className="text-white tracking-tight leading-[1.08] text-[2.5rem] sm:text-[3.2rem] font-extrabold uppercase">
              {t('ai_advisor_launch')}<br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #34d399, #38bdf8, #a78bfa)',
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 5s ease infinite',
                }}
              >
                {t('ai_advisor_copilot')}
              </span>
            </h2>

            <p className="text-zinc-400 text-[14.5px] leading-relaxed max-w-md font-medium">
              {t('ai_advisor_desc')}
            </p>

            {/* Feature Cards - Color-coded grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md mt-2">
              {FEATURE_CARDS.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`p-4 rounded-2xl border ${f.bg} flex flex-col gap-1.5 transition-all cursor-default`}
                  >
                    <div className={`flex items-center gap-2 ${f.color} text-[13px] font-bold`}>
                      <Icon size={13.5} className="shrink-0" />
                      <span>{f.title}</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-medium leading-relaxed">{f.desc}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right Column: Colorful Telemetry Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 flex justify-center items-center relative"
          >
            <div className="w-full max-w-xl h-[500px] rounded-[36px] border border-white/[0.06] bg-white/[0.01] backdrop-blur-3xl relative overflow-hidden flex flex-col justify-center items-center shadow-2xl p-8 group"
              style={{ boxShadow: '0 8px 64px rgba(139,92,246,0.08), 0 0 0 1px rgba(255,255,255,0.04)' }}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

              {/* Pulsing Core Radar */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <div className="w-[160px] h-[160px] rounded-full bg-violet-500/8 filter blur-[30px]" />
                <div className="absolute w-[220px] h-[220px] rounded-full border border-violet-400/10 sonar-ring" />
                <div className="absolute w-[320px] h-[320px] rounded-full border border-emerald-400/5 sonar-ring" style={{ animationDelay: '2s' }} />
                <div className="absolute w-[400px] h-[400px] rounded-full border border-dashed border-white/[0.025]" />
              </div>

              {/* Floating Modules */}
              {FLOATING_MODULES.map((mod) => {
                const Icon = mod.icon
                return (
                  <motion.div
                    key={mod.label}
                    animate={{ y: mod.bob }}
                    transition={{ repeat: Infinity, duration: mod.dur, ease: 'easeInOut', delay: mod.delay ?? 0 }}
                    className={`absolute ${mod.pos} z-10 p-3.5 rounded-2xl border border-white/[0.06] bg-[#08120E]/80 backdrop-blur-md shadow-lg flex items-center gap-3 w-[170px] text-left pointer-events-none`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${mod.bg} flex items-center justify-center ${mod.color} shrink-0`}>
                      <Icon size={14} />
                    </div>
                    <div>
                      <span className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">{mod.label}</span>
                      <span className="text-[11px] font-black text-white block mt-0.5">{mod.value}</span>
                    </div>
                  </motion.div>
                )
              })}

              {/* Center Core */}
              <div className="relative z-20 flex flex-col items-center gap-5 text-center">
                {/* Animated gradient ring */}
                <div className="relative">
                  <div className="absolute inset-[-4px] rounded-[28px] opacity-60"
                    style={{
                      background: 'conic-gradient(from 0deg, #34d399, #38bdf8, #a78bfa, #f59e0b, #34d399)',
                      animation: 'spin 4s linear infinite',
                      filter: 'blur(4px)',
                    }}
                  />
                  <div className="relative w-16 h-16 rounded-3xl bg-[#08120E] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Bot size={28} className="text-white" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    {t('ai_advisor_console')}
                  </span>

                  <Link to={ROUTES.AI_ASSISTANT}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3.5 rounded-full font-bold text-[13px] flex items-center gap-2.5 cursor-pointer transition-all duration-300"
                      style={{
                        background: 'linear-gradient(90deg, #34d399, #38bdf8, #a78bfa)',
                        backgroundSize: '200% 100%',
                        animation: 'gradient-shift 4s ease infinite',
                        color: '#08120E',
                        boxShadow: '0 4px 24px rgba(52,211,153,0.3)',
                      }}
                    >
                      {t('ai_advisor_btn')}
                      <ChevronRight size={14} className="stroke-[2.5]" />
                    </motion.button>
                  </Link>
                </div>

                <p className="text-[10px] text-zinc-500 max-w-[260px] leading-relaxed font-mono uppercase tracking-wider">
                  {t('ai_advisor_voice')}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default AIAdvisorWidget
