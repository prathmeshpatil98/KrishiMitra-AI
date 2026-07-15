import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function ServicesOverview() {
  const navigate = useNavigate()

  const services = [
    {
      icon: '📈',
      label: 'Market Intelligence',
      desc: 'Real-time APMC Mandi commodity rates and dynamic harvest sell-window predictions.',
      route: ROUTES.MARKET.ROOT,
    },
    {
      icon: '🚛',
      label: 'Logistics Optimizer',
      desc: 'Minimize haulage expenses with automated transit routes and fuel matrix optimization.',
      route: ROUTES.TRANSPORT.ROOT,
    },
    {
      icon: '🌦️',
      label: 'Climate Intelligence',
      desc: 'Hyperlocal weather risk gauges and automated rainfall cargo safety directives.',
      route: ROUTES.WEATHER.ROOT,
    },
    {
      icon: '🤖',
      label: 'Launch AI Copilot',
      desc: 'Consult our LangGraph-driven agronomy agent for live crop diagnostics and decisions.',
      route: ROUTES.AI_ASSISTANT,
    },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 90,
        damping: 15,
        delay: i * 0.1,
      },
    }),
  }

  return (
    <section
      id="services"
      className="relative w-full py-28 bg-[#08120E] overflow-hidden border-b border-white/[0.04]"
    >
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

      {/* Spotlight */}
      <div className="absolute top-[20%] left-[50%] -translate-x-[50%] w-[500px] h-[500px] rounded-full blur-[130px] bg-[#2ECC71]/5 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="text-center mb-20 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
            Core Architecture
          </div>
          <h2 className="font-display text-display text-white max-w-2xl text-balance mt-4 leading-tight text-[2rem] sm:text-[2.8rem] font-black uppercase tracking-tight">
            Autonomous Decision Suites
          </h2>
          <p className="text-zinc-400 text-[14.5px] max-w-xl mx-auto mt-4 leading-relaxed font-medium">
            Explore our specialized agronomy modules designed to maximize direct farming net yields.
          </p>
        </motion.div>

        {/* Premium Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((serv, idx) => (
            <motion.div
              key={serv.label}
              custom={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="flex"
            >
              <button
                onClick={() => navigate(serv.route)}
                className="w-full text-left cursor-pointer group flex flex-col justify-between items-start p-6 bg-slate-900/25 border border-white/[0.06] hover:border-[#2ECC71]/40 rounded-2xl shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300"
              >
                {/* Specular horizontal draw line on hover */}
                <span className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#2ECC71] to-[#43F59A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Badge Circle */}
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-xl bg-white/[0.03] border border-white/[0.08] group-hover:bg-[#2ECC71] group-hover:text-[#08120E] transition-all duration-300 mb-8 shadow-sm">
                  {serv.icon}
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="text-white font-extrabold text-[16px] tracking-tight group-hover:text-[#43F59A] transition-colors">
                    {serv.label}
                  </h3>
                  <div className="w-6 h-[1.5px] bg-white/20 group-hover:w-10 group-hover:bg-[#43F59A] transition-all duration-300" />
                  <p className="text-zinc-400 text-[13px] leading-relaxed font-medium mt-1">
                    {serv.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[#43F59A] text-[11px] font-black uppercase tracking-wider mt-8 group-hover:translate-x-1.5 transition-transform duration-300">
                  Execute Suite <ChevronRight size={13} className="mt-0.5" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
