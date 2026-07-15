import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'

interface VoiceQuickActionProps {
  voiceActive: boolean
  voiceText: string
  toggleVoice: () => void
}

export function VoiceQuickAction({ voiceActive, voiceText, toggleVoice }: VoiceQuickActionProps) {
  return (
    <section
      id="voice"
      className="w-full py-24 relative overflow-hidden bg-[#08120E] border-b border-white/[0.04]"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none bg-radial-glow opacity-30 select-none"
        style={{
          background: 'radial-gradient(circle, rgba(46,204,113,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-6xl mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ECC71]/10 border border-[#2ECC71]/20 text-[#43F59A] text-[10px] font-black uppercase tracking-[0.2em] w-fit mx-auto mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#43F59A] animate-pulse" />
            Voice Intelligence
          </div>
          <h2 className="font-display text-white tracking-tight leading-tight mt-2 text-[2rem] sm:text-[2.6rem] font-black uppercase">
            Speak. We Listen.<br />
            <span className="text-[#43F59A]">In Your Language.</span>
          </h2>
        </motion.div>

        {/* Ambient Waveform Graphic */}
        <div className="flex items-end justify-center gap-1.5 h-16 w-full max-w-md px-10">
          {[35, 65, 90, 55, 100, 70, 40, 85, 50, 75, 45, 95, 60, 80, 35].map((val, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full flex-1"
              style={{
                background: voiceActive ? '#43F59A' : '#1e3a24',
                originY: 1,
              }}
              animate={
                voiceActive
                  ? {
                      scaleY: [0.25, 1, 0.25],
                      transition: {
                        duration: 0.5 + (i % 3) * 0.18,
                        repeat: Infinity,
                        delay: i * 0.04,
                      },
                    }
                  : { scaleY: 0.25 }
              }
              initial={{ height: `${val}%` }}
            />
          ))}
        </div>

        {/* Voice Transcript text */}
        <p className="text-zinc-300 text-[16px] sm:text-[18px] font-medium italic min-h-[50px] max-w-xl leading-relaxed text-pretty px-4 font-serif">
          "{voiceText}"
        </p>

        {/* Interactive recording mic button */}
        <div className="flex flex-col items-center gap-3">
          <motion.button
            onClick={toggleVoice}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl focus:outline-none ${
              voiceActive
                ? 'bg-rose-500 shadow-[0_0_35px_rgba(239,68,68,0.4)]'
                : 'bg-[#2ECC71] hover:bg-[#2ECC71]/90 shadow-[0_0_30px_rgba(46,204,113,0.25)]'
            }`}
          >
            <Mic size={28} className={voiceActive ? 'text-white' : 'text-[#08120E]'} />
          </motion.button>
          <span className="text-zinc-555 text-[9px] font-black uppercase tracking-[0.25em] mt-1 font-mono">
            {voiceActive ? 'Listening — tap to stop' : 'Tap to speak'}
          </span>
        </div>
      </div>
    </section>
  )
}
export default VoiceQuickAction
