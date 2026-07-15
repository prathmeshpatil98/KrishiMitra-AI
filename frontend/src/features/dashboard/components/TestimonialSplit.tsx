import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ChevronRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

interface SchemeItem {
  id: string
  name: string
  icon: string
  benefits: string
  deadline: string
  tag: string
}

interface TestimonialSplitProps {
  schemes: SchemeItem[]
}

const TESTIMONIALS = [
  {
    initials: 'RS',
    name: 'Rajesh Shinde',
    role: 'Sugarcane Farmer, Kolhapur — 12 seasons',
    text: 'KrishiMitra AI helped me choose the right mandi at the right time. I saved ₹18,000 in transport costs last season by using the route calculator and got pre-approved for PM Fasal Bima automatically via Aadhaar. The AI advisor in Marathi is incredibly helpful.',
  },
  {
    initials: 'SP',
    name: 'Sanjay Patil',
    role: 'Paddy Cultivator, Sangli — 8 seasons',
    text: 'Synthesizing climate risks and regional APMC prices gave me the confidence to hold my harvest for 5 days. I sold at ₹2,150/Qtl instead of the distressed ₹1,950/Qtl, boosting my yield returns.',
  },
  {
    initials: 'AB',
    name: 'Amrita Bhosale',
    role: 'Soybean Farmer, Satara — 6 seasons',
    text: 'The voice advisor in Marathi is extremely responsive. I get accurate market pricing and weather warnings in my native language instantly while working in the field.',
  },
  {
    initials: 'SD',
    name: 'Sunil Deshmukh',
    role: 'Cotton Grower, Nagpur — 15 seasons',
    text: 'The Logistics Routing Optimizer helped us plan transport logistics during unexpected rains. We covered our cargo and avoided soil saturation hazards, saving our entire yield.',
  },
]

export function TestimonialSplit({ schemes }: TestimonialSplitProps) {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full bg-[#08120E] overflow-hidden flex flex-col font-sans">
      {/* ── Smart Benefits (Government Schemes) ── */}
      <section id="schemes" className="w-full py-24 bg-[#08120E] border-b border-white/[0.04]">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-left mb-16"
          >
            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/25 text-[#43F59A] text-[9.5px] font-black uppercase tracking-[0.2em] w-fit mb-4 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
              05 // Smart Benefits
            </div>
            <h2 className="text-white tracking-tight leading-[1.1] text-[2.5rem] sm:text-[3.2rem] font-extrabold uppercase">
              Agronomic Welfare & Subsidies
            </h2>
            <p className="text-zinc-400 text-[14.5px] max-w-xl mt-4 leading-relaxed font-medium">
              Direct scheme integrations verified automatically via secure credentials. Apply seamlessly with zero intermediaries.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {schemes.slice(0, 4).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ type: 'spring', stiffness: 90, damping: 15, delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(ROUTES.GOVERNMENT.ROOT)}
                className="w-full text-left cursor-pointer group flex flex-col justify-between items-start p-6 bg-slate-900/10 border border-white/[0.04] hover:border-[#2ECC71]/40 rounded-2xl shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-300"
              >
                <span className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-[#2ECC71] to-[#43F59A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="h-11 w-11 rounded-xl flex items-center justify-center text-xl bg-white/[0.03] border border-white/[0.08] group-hover:bg-[#2ECC71] group-hover:text-[#08120E] transition-all duration-300 mb-6 shadow-sm">
                  <span>{s.icon}</span>
                </div>

                <div className="flex flex-col gap-3 flex-1 w-full">
                  <span className="text-[8.5px] font-black uppercase tracking-[0.2em] text-[#43F59A] bg-[#2ECC71]/10 px-2.5 py-0.5 rounded-full w-fit font-mono">
                    {s.tag}
                  </span>
                  <h3 className="text-white font-extrabold text-[15px] leading-snug group-hover:text-[#43F59A] transition-colors">
                    {s.name}
                  </h3>
                  <div className="w-5 h-[1.5px] bg-white/20 group-hover:w-8 group-hover:bg-[#43F59A] transition-all duration-300" />
                  <p className="text-zinc-400 text-[12px] leading-relaxed font-semibold">
                    {s.benefits}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-550 text-[11px] font-bold mt-5 font-mono">
                  <Calendar size={11} /> {s.deadline}
                </div>

                <div className="flex items-center gap-1 text-[#43F59A] text-[12px] font-black uppercase tracking-wider mt-6 group-hover:translate-x-1 transition-transform duration-300">
                  Claim Benefits <ChevronRight size={13} className="mt-0.5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Farmer Reviews Split Layout ── */}
      <section id="testimonial" className="w-full py-0 bg-[#08120E] border-b border-white/[0.04] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          
          {/* Left panel portrait (Realistic Generated Indian Farmer Field image) */}
          <div className="relative overflow-hidden min-h-[400px] lg:min-h-full">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.82]"
              style={{
                backgroundImage: "url('/indian_farmer_field.png')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/15 to-[#08120E]" />
          </div>

          {/* Right testimonial description with automatic carousel loop */}
          <div className="flex flex-col justify-center p-10 sm:p-16 lg:pl-20 bg-[#08120E] text-left relative min-h-[480px]">
            <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/25 text-[#43F59A] text-[9.5px] font-black uppercase tracking-[0.2em] w-fit mb-4 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
              06 // Verified Testimonials
            </div>
            
            <h2 className="text-white tracking-tight leading-[1.1] text-[2.5rem] sm:text-[3.2rem] font-extrabold uppercase">
              What Farmers Say
            </h2>

            <div className="text-[#2ECC71]/20 text-[56px] font-display leading-none mt-8 select-none">“</div>
            
            <div className="relative h-44 sm:h-36 overflow-hidden mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <p className="text-zinc-300 text-[14.5px] leading-[1.75] font-semibold text-pretty pr-4">
                    {TESTIMONIALS[activeIdx].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/[0.04] pt-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`meta-${activeIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4.5"
                >
                  <div className="w-11 h-11 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20 flex items-center justify-center text-[#43F59A] font-black text-[13.5px] shadow-sm shrink-0">
                    {TESTIMONIALS[activeIdx].initials}
                  </div>
                  <div>
                    <p className="font-extrabold text-white text-[13.5px]">{TESTIMONIALS[activeIdx].name}</p>
                    <p className="text-zinc-500 text-[11px] font-medium font-mono">{TESTIMONIALS[activeIdx].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Indicator dots & Stars */}
              <div className="flex flex-col sm:items-end gap-2.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#43F59A" className="text-[#43F59A]" />
                  ))}
                </div>
                
                {/* Carousel Navigation Indicator Dots */}
                <div className="flex gap-1.5 mt-1">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                        activeIdx === i ? 'w-4.5 bg-[#43F59A]' : 'w-1.5 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ── Final Action CTA Section ── */}
      <section className="w-full py-28 text-center relative overflow-hidden bg-gradient-to-b from-[#08120E] to-[#040907]">
        {/* Soft emerald backdrop specular */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[800px] h-[300px] rounded-full opacity-[0.03] filter blur-[100px] bg-[#2ECC71]" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 relative z-10 flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/25 text-[#43F59A] text-[9.5px] font-black uppercase tracking-[0.2em] w-fit font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
              07 // Get Started
            </div>
            
            <h2 className="text-white tracking-tight leading-[1.1] text-[2.5rem] sm:text-[3.2rem] font-extrabold uppercase">
              Ready to Grow<br />
              <span className="bg-gradient-to-r from-[#2ECC71] to-[#43F59A] bg-clip-text text-transparent">
                Smarter This Season?
              </span>
            </h2>
          </motion.div>

          {/* Apple-style White Solid Pill + Glass Outline Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => navigate(ROUTES.SETTINGS.ROOT)}
              className="px-8 py-4 rounded-full bg-white text-[#08120E] text-[13.5px] font-bold hover:bg-zinc-100 transition-all duration-200 shadow-xl shadow-white/5 flex items-center justify-center gap-2 cursor-pointer"
            >
              Configure Profile Matrix
              <ChevronRight size={14} className="stroke-[2.5]" />
            </button>
            
            <button
              onClick={() => navigate(ROUTES.AI_ASSISTANT)}
              className="px-8 py-4 rounded-full border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-white text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            >
              Open AI Copilot
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          </motion.div>

          {/* Social Proof Trust Statistics (Restructured Sans-serif styling) */}
          <div className="flex flex-wrap justify-center gap-12 sm:gap-20 mt-12 border-t border-white/[0.04] pt-12 w-full max-w-2xl">
            {[
              { val: '97%', label: 'Prediction Accuracy' },
              { val: '4,200+', label: 'APMC Yards Tracked' },
              { val: '₹2.1Cr', label: 'Farmer Net Savings' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-center"
              >
                <p className="text-[2.2rem] font-black text-[#43F59A] leading-none tracking-tight font-mono">
                  {stat.val}
                </p>
                <p className="text-zinc-500 text-[10.5px] font-bold uppercase tracking-wider mt-3">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modern Minimalist Footer ── */}
      <footer className="w-full bg-[#040907] border-t border-white/[0.04] py-12 relative z-10">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[12.5px] text-zinc-500 font-medium">
          <div className="flex items-center gap-2.5">
            <span className="font-black tracking-tight text-white">KrishiMitra <span className="text-[#2ECC71]">AI</span></span>
            <span className="text-zinc-700 font-light">|</span>
            <span className="text-zinc-500 font-mono text-[11px]">v.2.4.0</span>
          </div>

          <p className="text-zinc-650 text-center sm:text-left">
            &copy; {new Date().getFullYear()} KrishiMitra AI. All rights reserved.
          </p>

          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-wider">
            <a href="#hero" className="hover:text-white transition-colors">Back to top</a>
            <a href="#schemes" className="hover:text-white transition-colors">Subsidies</a>
            <a href="#transport" className="hover:text-white transition-colors">Haulage</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TestimonialSplit
