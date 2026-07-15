import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ExternalLink, X } from 'lucide-react'

interface SchemeItem {
  id: string
  name: string
  provider: 'Central' | 'State'
  category: string
  benefits: string
  eligibility: string
  documents: string[]
  deadline: string
  website: string
  icon: string
}

interface EligibilityFormProps {
  expanded: SchemeItem | undefined
  setExpandedId: (id: string | null) => void
  checkedDocs: Record<string, boolean>
  toggleDoc: (key: string) => void
}

export function EligibilityForm({
  expanded,
  setExpandedId,
  checkedDocs,
  toggleDoc,
}: EligibilityFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key={expanded.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white dark:bg-zinc-900/30 rounded-3xl border border-border/60 dark:border-white/5 shadow-card overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-farm-green dark:bg-zinc-950 relative">
              <div className="flex justify-between items-start mb-3">
                <span className="text-4xl">{expanded.icon}</span>
                <button
                  onClick={() => setExpandedId(null)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
                >
                  <X size={16} />
                </button>
              </div>
              <h3 className="text-white font-extrabold text-[16px] leading-snug">{expanded.name}</h3>
              <div className="gold-underline mt-2.5 w-8" />
            </div>

            <div className="p-6 flex flex-col gap-6 bg-white dark:bg-[#0c130d] border-t border-border/50 dark:border-white/5">
              {/* Benefits */}
              <div>
                <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-1.5">
                  Benefits Summary
                </p>
                <p className="text-[13px] text-text-secondary dark:text-zinc-300 leading-relaxed font-semibold">
                  {expanded.benefits}
                </p>
              </div>

              {/* Eligibility */}
              <div>
                <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-1.5">
                  Eligibility Criteria
                </p>
                <p className="text-[13px] text-text-secondary dark:text-zinc-300 leading-relaxed font-semibold">
                  {expanded.eligibility}
                </p>
              </div>

              {/* Document Checklist */}
              <div>
                <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mb-2.5">
                  Document Verification Checklist
                </p>
                <div className="flex flex-col gap-2.5">
                  {expanded.documents.map((doc) => {
                    const key = `${expanded.id}-${doc}`
                    const checked = checkedDocs[key]
                    return (
                      <button
                        key={doc}
                        onClick={() => toggleDoc(key)}
                        className="flex items-center gap-3 cursor-pointer group text-left w-full focus:outline-none"
                      >
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                            checked
                              ? 'bg-farm-green dark:bg-emerald-600 border-farm-green dark:border-emerald-600 shadow-sm'
                              : 'border-border/60 dark:border-white/10 group-hover:border-farm-green/60 dark:group-hover:border-emerald-500/40'
                          }`}
                        >
                          {checked && <CheckCircle size={10} className="text-white" />}
                        </div>
                        <span
                          className={`text-[12.5px] font-medium transition-colors ${
                            checked ? 'line-through text-text-muted' : 'text-text-primary dark:text-zinc-200'
                          }`}
                        >
                          {doc}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="mt-4 text-[11.5px] text-text-muted font-bold">
                  {Object.keys(checkedDocs).filter((k) => k.startsWith(`${expanded.id}-`) && checkedDocs[k]).length}{' '}
                  of {expanded.documents.length} documents ready
                </div>
              </div>

              {/* Portal link redirect */}
              <a
                href={expanded.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-farm-green hover:bg-brand-hover text-white text-[13px] font-black uppercase tracking-wider transition-all shadow-md mt-2"
              >
                <ExternalLink size={14} /> Apply on Official Portal
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="bg-cream-DEFAULT/30 dark:bg-zinc-900/10 rounded-3xl border-2 border-dashed border-border/60 dark:border-white/5 p-8 flex flex-col items-center justify-center gap-3.5 text-center min-h-[350px]">
            <span className="text-4xl filter grayscale opacity-60">🏛️</span>
            <p className="text-text-muted text-[13.5px] font-semibold max-w-[200px] leading-relaxed">
              Select any welfare scheme to view criteria details and check lists.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
export default EligibilityForm
