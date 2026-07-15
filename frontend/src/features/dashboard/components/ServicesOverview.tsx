import { motion } from 'framer-motion'
import { ChevronRight, BarChart3, Truck, CloudRain, Bot } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useLanguage } from '@/app/providers/LanguageProvider'

const SERVICES = [
  {
    icon: BarChart3,
    label: 'Market Intelligence',
    desc: 'Real-time APMC Mandi commodity rates and dynamic harvest sell-window predictions.',
    route: ROUTES.MARKET.ROOT,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'border-emerald-500/25 hover:border-emerald-400/50',
    iconBg: 'bg-emerald-500/15 group-hover:bg-emerald-500',
    iconColor: 'text-emerald-400 group-hover:text-[#08120E]',
    accentColor: 'text-emerald-400',
    glowColor: 'rgba(16,185,129,0.12)',
    glowHover: 'rgba(16,185,129,0.30)',
    lineColor: 'from-emerald-400 to-teal-400',
    num: '01',
  },
  {
    icon: Truck,
    label: 'Logistics Optimizer',
    desc: 'Minimize haulage expenses with automated transit routes and fuel matrix optimization.',
    route: ROUTES.TRANSPORT.ROOT,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    border: 'border-amber-500/25 hover:border-amber-400/50',
    iconBg: 'bg-amber-500/15 group-hover:bg-amber-500',
    iconColor: 'text-amber-400 group-hover:text-[#08120E]',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(245,158,11,0.12)',
    glowHover: 'rgba(245,158,11,0.30)',
    lineColor: 'from-amber-400 to-orange-400',
    num: '02',
  },
  {
    icon: CloudRain,
    label: 'Climate Intelligence',
    desc: 'Hyperlocal weather risk gauges and automated rainfall cargo safety directives.',
    route: ROUTES.WEATHER.ROOT,
    gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
    border: 'border-sky-500/25 hover:border-sky-400/50',
    iconBg: 'bg-sky-500/15 group-hover:bg-sky-500',
    iconColor: 'text-sky-400 group-hover:text-[#08120E]',
    accentColor: 'text-sky-400',
    glowColor: 'rgba(14,165,233,0.12)',
    glowHover: 'rgba(14,165,233,0.30)',
    lineColor: 'from-sky-400 to-blue-400',
    num: '03',
  },
  {
    icon: Bot,
    label: 'Launch AI Copilot',
    desc: 'Consult our LangGraph-driven agronomy agent for live crop diagnostics and decisions.',
    route: ROUTES.AI_ASSISTANT,
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    border: 'border-violet-500/25 hover:border-violet-400/50',
    iconBg: 'bg-violet-500/15 group-hover:bg-violet-500',
    iconColor: 'text-violet-400 group-hover:text-white',
    accentColor: 'text-violet-400',
    glowColor: 'rgba(139,92,246,0.12)',
    glowHover: 'rgba(139,92,246,0.30)',
    lineColor: 'from-violet-400 to-purple-400',
    num: '04',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 70,
      damping: 14,
      delay: i * 0.12,
    },
  }),
}

export function ServicesOverview() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const getTrans = (label: string, defaultDesc: string) => {
    if (label === 'Market Intelligence') return { label: t('services_market_label'), desc: t('services_market_desc') }
    if (label === 'Logistics Optimizer') return { label: t('services_transport_label'), desc: t('services_transport_desc') }
    if (label === 'Climate Intelligence') return { label: t('services_weather_label'), desc: t('services_weather_desc') }
    if (label === 'Launch AI Copilot') return { label: t('services_ai_label'), desc: t('services_ai_desc') }
    return { label, desc: defaultDesc }
  }

  return (
    <section
      id="services"
      className="relative w-full py-28 bg-[#08120E] overflow-hidden border-b border-white/[0.04]"
    >
      {/* Rich layered aurora background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[160px] opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 70%)', animation: 'aurora-drift-1 18s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', animation: 'aurora-drift-2 22s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[30%] right-[20%] w-[30vw] h-[30vw] rounded-full blur-[130px] opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', animation: 'aurora-drift-3 15s ease-in-out infinite' }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015]" />
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-center mb-20 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_16px_rgba(16,185,129,0.12)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('services_core_eyebrow')}
          </div>
          <h2 className="font-display text-white max-w-2xl text-balance mt-5 leading-[1.05] text-[2rem] sm:text-[2.8rem] font-black uppercase tracking-tight">
            {t('services_autonomous_title')}{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #34d399, #38bdf8, #a78bfa, #f59e0b)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 6s ease infinite',
              }}
            >
              {t('services_suites_title')}
            </span>
          </h2>
          <p className="text-zinc-400 text-[14.5px] max-w-xl mx-auto mt-4 leading-relaxed font-medium">
            {t('services_desc')}
          </p>
        </motion.div>

        {/* Premium Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((serv, idx) => {
            const Icon = serv.icon
            const info = getTrans(serv.label, serv.desc)
            return (
              <motion.div
                key={serv.label}
                custom={idx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex"
              >
                <button
                  onClick={() => navigate(serv.route)}
                  className={`w-full text-left cursor-pointer group flex flex-col justify-between items-start p-6 rounded-2xl border ${serv.border} relative overflow-hidden transition-all duration-300 backdrop-blur-sm`}
                  style={{
                    background: `linear-gradient(145deg, rgba(255,255,255,0.02) 0%, transparent 100%)`,
                    boxShadow: `0 4px 32px ${serv.glowColor}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 48px ${serv.glowHover}`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 32px ${serv.glowColor}`
                  }}
                >
                  {/* Gradient fill on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${serv.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                  {/* Shine sweep effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                    <div
                      className="absolute top-0 bottom-0 w-[60px] skew-x-[-20deg] opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                        animation: 'shine-sweep 0.8s ease forwards',
                        animationPlayState: 'paused',
                      }}
                    />
                  </div>

                  {/* Index number */}
                  <span className={`absolute top-4 right-5 text-[11px] font-black font-mono ${serv.accentColor} opacity-30 group-hover:opacity-70 transition-opacity`}>
                    {serv.num}
                  </span>

                  {/* Icon */}
                  <div className={`relative z-10 h-12 w-12 rounded-xl flex items-center justify-center ${serv.iconBg} ${serv.iconColor} transition-all duration-300 mb-7 shadow-sm`}>
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <div className="relative z-10 flex flex-col gap-2.5 flex-1">
                    <h3 className={`text-white font-extrabold text-[15px] tracking-tight group-hover:${serv.accentColor.replace('text-', 'text-')} transition-colors`}>
                      {info.label}
                    </h3>
                    <div className={`w-6 h-[2px] bg-gradient-to-r ${serv.lineColor} rounded-full group-hover:w-12 transition-all duration-300`} />
                    <p className="text-zinc-400 text-[12.5px] leading-relaxed font-medium mt-1">
                      {info.desc}
                    </p>
                  </div>

                  <div className={`relative z-10 flex items-center gap-1 ${serv.accentColor} text-[11px] font-black uppercase tracking-wider mt-8 group-hover:translate-x-1.5 transition-transform duration-300`}>
                    {t('services_execute_suite')} <ChevronRight size={13} className="mt-0.5" />
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
