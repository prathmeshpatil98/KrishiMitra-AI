import { motion } from 'framer-motion'
import { Bot, ChevronRight, CheckCircle2, TrendingUp, CloudSun, Compass, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function AIAdvisorWidget() {
  return (
    <section
      id="ai-advisor"
      className="w-full py-28 relative overflow-hidden bg-[#08120E] border-b border-white/[0.04]"
    >
      {/* Specular Aurora Backdrops */}
      <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] rounded-full blur-[160px] bg-[#2ECC71]/3 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full blur-[160px] bg-[#43F59A]/3 pointer-events-none" />

      {/* Scoped CSS for custom sonar sweeps and auroras */}
      <style>{`
        @keyframes sonarSweep {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .sonar-ring {
          animation: sonarSweep 4s infinite linear;
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Product Positioning & Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6 text-left"
          >
            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/25 text-[#43F59A] text-[9.5px] font-black uppercase tracking-[0.2em] w-fit font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
              03 // Agronomy Intelligence
            </div>
            
            <h2 className="text-white tracking-tight leading-[1.08] text-[2.5rem] sm:text-[3.2rem] font-extrabold uppercase">
              Launch AI<br />
              <span className="bg-gradient-to-r from-[#2ECC71] to-[#43F59A] bg-clip-text text-transparent">
                Agronomy Copilot
              </span>
            </h2>
            
            <p className="text-zinc-400 text-[14.5px] leading-relaxed max-w-md font-medium">
              Consult our LangGraph-driven agronomy agent, custom-trained to synthesize regional market feeds, micro-weather matrices, and transport logistics.
            </p>

            {/* Structured Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mt-2">
              {[
                { title: 'Live Price Feeds', desc: 'Real-time APMC indices' },
                { title: 'Climate Matrices', desc: 'Micro-weather advisories' },
                { title: 'Subsidy Audits', desc: 'Central scheme tracking' },
                { title: 'Trilingual Copilot', desc: 'EN, Hi, Mr voice support' },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01] flex flex-col gap-1.5 hover:border-white/[0.08] transition-colors"
                >
                  <div className="flex items-center gap-2 text-white text-[13px] font-bold">
                    <CheckCircle2 size={13.5} className="text-[#43F59A] shrink-0" />
                    <span>{f.title}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium leading-relaxed">{f.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: High-Fidelity Interactive Telemetry Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 flex justify-center items-center relative"
          >
            {/* Main Interactive Workspace Card */}
            <div className="w-full max-w-xl h-[480px] rounded-[36px] border border-white/[0.05] bg-slate-900/10 backdrop-blur-3xl relative overflow-hidden flex flex-col justify-center items-center shadow-2xl p-8 group">
              
              {/* Fine Grid overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />

              {/* Pulsing Core Radar Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <div className="w-[160px] h-[160px] rounded-full bg-[#2ECC71]/10 filter blur-[30px]" />
                <div className="absolute w-[220px] h-[220px] rounded-full border border-[#2ECC71]/10 sonar-ring" />
                <div className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-white/[0.03]" />
              </div>

              {/* Floating Module 1: Market Indices (Upper-Left) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute top-10 left-6 z-10 p-3.5 rounded-2xl border border-white/[0.06] bg-[#08120E]/70 backdrop-blur-md shadow-lg flex items-center gap-3 w-48 text-left pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center text-[#43F59A] shrink-0">
                  <TrendingUp size={14} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">Market Index</span>
                  <span className="text-[11.5px] font-black text-white block mt-0.5">Sugarcane: +4.2%</span>
                </div>
              </motion.div>

              {/* Floating Module 2: Climate Radar (Lower-Right) */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-10 right-6 z-10 p-3.5 rounded-2xl border border-white/[0.06] bg-[#08120E]/70 backdrop-blur-md shadow-lg flex items-center gap-3 w-48 text-left pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center text-[#43F59A] shrink-0 animate-pulse">
                  <CloudSun size={14} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">Climate Radar</span>
                  <span className="text-[11.5px] font-black text-white block mt-0.5">Clear / Kolhapur</span>
                </div>
              </motion.div>

              {/* Floating Module 3: Logistics Tracker (Upper-Right) */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 0.2 }}
                className="absolute top-16 right-8 z-10 p-3.5 rounded-2xl border border-white/[0.06] bg-[#08120E]/70 backdrop-blur-md shadow-lg flex items-center gap-3 w-48 text-left pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-[#2ECC71]/10 flex items-center justify-center text-[#43F59A] shrink-0">
                  <Compass size={14} />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono">Routing Cost</span>
                  <span className="text-[11.5px] font-black text-white block mt-0.5">₹120 / optimal</span>
                </div>
              </motion.div>

              {/* Floating Module 4: Active Alerts (Lower-Left) */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut', delay: 0.8 }}
                className="absolute bottom-16 left-8 z-10 p-3.5 rounded-2xl border border-white/[0.06] bg-[#08120E]/70 backdrop-blur-md shadow-lg flex items-center gap-3 w-48 text-left pointer-events-none"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                  <ShieldAlert size={14} />
                </div>
                <div>
                  <span className="text-[10px] text-rose-450 font-bold uppercase tracking-wider block font-mono">Subsidy Sync</span>
                  <span className="text-[11.5px] font-black text-white block mt-0.5">KYC Verified</span>
                </div>
              </motion.div>

              {/* Center Core: Sprout Icon & Launch Button */}
              <div className="relative z-20 flex flex-col items-center gap-5 text-center mt-4">
                
                {/* Sprout Pulse Core */}
                <div className="w-16 h-16 rounded-3xl bg-[#2ECC71]/10 border border-[#2ECC71]/25 text-[#43F59A] flex items-center justify-center shadow-lg shadow-[#2ECC71]/5 relative group-hover:scale-105 transition-transform duration-300">
                  <Bot size={28} className="animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43F59A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#43F59A]"></span>
                  </span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <span className="text-[12.5px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    Autonomous Console
                  </span>
                  
                  {/* Magnetic CTA Launch Button */}
                  <Link to={ROUTES.AI_ASSISTANT}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-4 rounded-full bg-white text-[#08120E] text-[13.5px] font-bold hover:bg-zinc-100 transition-all duration-200 shadow-xl shadow-white/5 flex items-center gap-2.5 cursor-pointer"
                    >
                      Open AI Assistant
                      <ChevronRight size={14} className="stroke-[2.5]" />
                    </motion.button>
                  </Link>
                </div>

                <p className="text-[10.5px] text-zinc-550 max-w-[280px] leading-relaxed font-mono uppercase tracking-wider">
                  Trilingual voice analysis and market diagnostics
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
