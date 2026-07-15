import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X, Check, RefreshCw, FileText, ShieldAlert } from 'lucide-react'
import { SchemeItem } from '@/pages/Government'

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
  
  // Custom document readiness items
  const DOCUMENT_READINESS_ITEMS = [
    { name: 'Aadhaar Card', status: 'Verified', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    { name: 'PAN Card', status: 'Verified', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    { name: 'Bank Passbook', status: 'Verified', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    { name: 'Land Records', status: 'Needs Update', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    { name: 'Soil Health Card', status: 'Pending', color: 'text-[#3B82F6] bg-blue-500/10 border-blue-500/20' },
  ]

  // Count ready documents for current scheme
  const readyDocsCount = expanded 
    ? expanded.documents.filter((doc) => checkedDocs[`${expanded.id}-${doc}`]).length 
    : 0

  const totalDocsCount = expanded ? expanded.documents.length : 0
  const completionPercentage = totalDocsCount > 0 ? (readyDocsCount / totalDocsCount) * 100 : 0

  // Interactive timeline stages
  const TIMELINE_STAGES = [
    { label: 'Eligibility', active: true },
    { label: 'Documents Ready', active: readyDocsCount === totalDocsCount },
    { label: 'Submitted', active: false },
    { label: 'Verification', active: false },
    { label: 'Approval', active: false },
    { label: 'Funds Credited', active: false },
  ]

  // Overall Document Readiness Items (Display when no scheme is selected)
  const VAULT_DOCUMENTS = [
    { name: 'Aadhaar Card', status: 'Verified', date: 'Pre-Verified via KYC', type: 'Success' },
    { name: 'PAN Card', status: 'Verified', date: 'Pre-Verified via KYC', type: 'Success' },
    { name: 'Bank Passbook', status: 'Verified', date: 'Direct Beneficiary Transfer active', type: 'Success' },
    { name: 'Land Records', status: 'Needs Update', date: 'Last checked 12 months ago', type: 'Warning' },
    { name: 'Soil Health Card', status: 'Pending', date: 'Needs renewal for 2026 season', type: 'Pending' },
    { name: 'Income Certificate', status: 'Pending', date: 'Aadhaar matching required', type: 'Pending' },
    { name: 'Farmer ID', status: 'Verified', date: 'DigiLocker Synced', type: 'Success' },
    { name: 'Caste Certificate', status: 'Verified', date: 'Not Required / Verified', type: 'Success' },
  ]

  const verifiedCount = VAULT_DOCUMENTS.filter(d => d.type === 'Success').length
  const vaultCompletionPercentage = (verifiedCount / VAULT_DOCUMENTS.length) * 100

  return (
    <div className="flex flex-col gap-5 h-full">
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key={expanded.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-[#101915] border border-white/[0.06] rounded-[24px] shadow-xl overflow-hidden flex flex-col justify-between max-h-[640px]"
          >
            {/* Header */}
            <div className="p-6 bg-[#16221C] relative border-b border-white/[0.04]">
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">{expanded.icon}</span>
                <button
                  onClick={() => setExpandedId(null)}
                  className="text-[#A8B4AF]/60 hover:text-white transition-colors cursor-pointer p-1.5 rounded-xl hover:bg-white/5 border border-white/[0.04] bg-[#08120E]"
                >
                  <X size={14} />
                </button>
              </div>
              <h3 className="text-white font-extrabold text-[15px] leading-snug font-sans">{expanded.name}</h3>
              <div className="flex items-center gap-2 mt-2 font-mono-jb">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
                <span className="text-[10px] text-[#43F59A] font-bold uppercase tracking-wider">AI Scheme Intelligence</span>
              </div>
            </div>

            {/* Scrollable details panel */}
            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-5.5 text-[12.5px] bg-[#101915]">
              
              {/* Benefit Summary */}
              <div>
                <p className="text-[10px] font-bold text-[#A8B4AF]/50 uppercase tracking-widest mb-1.5 font-mono-jb">
                  Benefit Summary
                </p>
                <div className="p-3.5 rounded-2xl bg-[#08120E]/50 border border-white/[0.04] text-white font-medium leading-relaxed font-sans">
                  {expanded.benefits}
                </div>
              </div>

              {/* Eligibility checklist */}
              <div>
                <p className="text-[10px] font-bold text-[#A8B4AF]/50 uppercase tracking-widest mb-1.5 font-mono-jb">
                  Eligibility Criteria
                </p>
                <p className="text-[#A8B4AF] leading-relaxed font-light font-sans">
                  {expanded.eligibility}
                </p>
              </div>

              {/* Visual Document Readiness Tracker */}
              <div>
                <p className="text-[10px] font-bold text-[#A8B4AF]/50 uppercase tracking-widest mb-2.5 font-mono-jb">
                  Document Readiness
                </p>
                
                <div className="flex flex-col gap-2">
                  {DOCUMENT_READINESS_ITEMS.map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-2 rounded-xl bg-[#08120E]/30 border border-white/[0.03] text-[11px] font-mono-jb">
                      <span className="text-[#F8FAF8] font-sans font-medium">{item.name}</span>
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${item.color}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Animated progress bar */}
                <div className="mt-4 p-3 rounded-2xl bg-[#16221C] border border-white/[0.04]">
                  <div className="flex justify-between items-center text-[10px] text-[#A8B4AF] mb-2 font-mono-jb font-semibold">
                    <span>Document Checklist</span>
                    <span className="text-white">{readyDocsCount} / {totalDocsCount} Ready</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#2ECC71] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Checklist checkboxes */}
              <div>
                <p className="text-[10px] font-bold text-[#A8B4AF]/50 uppercase tracking-widest mb-2.5 font-mono-jb">
                  Document Verification
                </p>
                <div className="flex flex-col gap-2">
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
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                            checked
                              ? 'bg-[#2ECC71] border-[#2ECC71]'
                              : 'border-white/[0.1] bg-[#08120E] group-hover:border-[#2ECC71]/60'
                          }`}
                        >
                          {checked && <Check size={9} strokeWidth={3} className="text-white" />}
                        </div>
                        <span
                          className={`text-[12.5px] font-medium transition-colors font-sans ${
                            checked ? 'line-through text-[#A8B4AF]/50' : 'text-[#F8FAF8]/90 group-hover:text-white'
                          }`}
                        >
                          {doc}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Application Timeline tracking */}
              <div>
                <p className="text-[10px] font-bold text-[#A8B4AF]/50 uppercase tracking-widest mb-2.5 font-mono-jb">
                  Application Timeline
                </p>
                <div className="relative pl-4 border-l border-white/[0.06] flex flex-col gap-4 py-1 text-[11px] font-mono-jb">
                  {TIMELINE_STAGES.map((stage) => (
                    <div key={stage.label} className="relative flex items-center gap-2">
                      <div className={`absolute -left-[20.5px] w-2.5 h-2.5 rounded-full border-2 ${
                        stage.active 
                          ? 'bg-[#2ECC71] border-[#2ECC71] shadow-[0_0_8px_rgba(46,204,113,0.4)]' 
                          : 'bg-[#08120E] border-white/[0.1]'
                      }`} />
                      <span className={stage.active ? 'text-[#43F59A] font-bold font-sans' : 'text-[#A8B4AF]/60 font-sans'}>
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI recommendation and status widgets */}
              <div className="grid grid-cols-2 gap-3 mt-1.5 font-mono-jb">
                <div className="p-3 rounded-2xl bg-[#08120E]/50 border border-white/[0.04]">
                  <span className="text-[9px] text-[#A8B4AF]/50 block mb-1">Approval Probability</span>
                  <span className="text-[13px] font-bold text-[#43F59A]">95% Match</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#08120E]/50 border border-white/[0.04]">
                  <span className="text-[9px] text-[#A8B4AF]/50 block mb-1">Portal Status</span>
                  <span className="text-[13px] font-bold text-blue-400">Online / Active</span>
                </div>
              </div>

            </div>

            {/* Portal Action Footer */}
            <div className="p-6 border-t border-white/[0.04] bg-[#16221C] shrink-0">
              <a
                href={expanded.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2ECC71] hover:bg-[#28b865] text-white text-[12px] font-bold uppercase tracking-wider transition-all shadow-md font-mono-jb"
              >
                <ExternalLink size={12} /> Continue to Government Portal
              </a>
            </div>

          </motion.div>
        ) : (
          /* Document Readiness Vault Console - Persistent Dashboard when no scheme is highlighted */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#101915] border border-white/[0.06] rounded-[24px] shadow-xl overflow-hidden flex flex-col justify-between max-h-[640px]"
          >
            {/* Header */}
            <div className="p-6 bg-[#16221C] border-b border-white/[0.04]">
              <div className="flex items-center gap-2 mb-2 font-mono-jb text-[10px]">
                <FileText size={12} className="text-[#2ECC71]" />
                <span className="text-[#43F59A] font-bold uppercase tracking-wider">Aadhaar Document Vault</span>
              </div>
              <h3 className="text-white font-extrabold text-[15px] font-sans">Document Readiness Tracker</h3>
              <p className="text-[#A8B4AF] text-[11px] font-light mt-1 font-sans">KYC document verification status for central benefits eligibility.</p>
            </div>

            {/* Content List */}
            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4.5 bg-[#101915]">
              
              {/* Vault Progress tracker bar */}
              <div className="p-4.5 rounded-2xl bg-[#08120E]/50 border border-white/[0.04] flex flex-col justify-between gap-2.5">
                <div className="flex justify-between items-center text-[10.5px] font-mono-jb font-semibold text-[#A8B4AF]">
                  <span>Overall Readiness</span>
                  <span className="text-[#43F59A]">{verifiedCount} of {VAULT_DOCUMENTS.length} Verified</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2ECC71] to-[#43F59A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${vaultCompletionPercentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Document List */}
              <div className="flex flex-col gap-2">
                {VAULT_DOCUMENTS.map((doc) => {
                  let statusBadge = "Verified"
                  let badgeClass = "text-[#2ECC71] bg-[#2ECC71]/10 border-[#2ECC71]/20"
                  if (doc.type === 'Warning') {
                    statusBadge = "Needs Update"
                    badgeClass = "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20"
                  } else if (doc.type === 'Pending') {
                    statusBadge = "Pending"
                    badgeClass = "text-[#3B82F6] bg-blue-500/10 border-blue-500/20"
                  }

                  return (
                    <div 
                      key={doc.name}
                      className="p-3 rounded-2xl bg-[#08120E]/30 border border-white/[0.03] flex items-center justify-between transition-all hover:bg-[#08120E]/50"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-semibold text-[#F8FAF8] font-sans">{doc.name}</span>
                        <span className="text-[9.5px] text-[#A8B4AF]/60 font-mono-jb">{doc.date}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border font-mono-jb ${badgeClass}`}>
                        {statusBadge}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Notice info */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2.5 text-[11.5px] leading-relaxed text-[#A8B4AF]">
                <ShieldAlert size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
                <p className="font-sans font-light">
                  <span className="text-white font-semibold font-mono-jb">Notice:</span> 2 documents require renewal. Complete these to raise your AI Eligibility Score to 100.
                </p>
              </div>

            </div>

            {/* Sync button Footer */}
            <div className="p-6 border-t border-white/[0.04] bg-[#16221C] shrink-0">
              <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] hover:border-white/20 bg-[#08120E] text-[#F8FAF8] text-[12px] font-bold uppercase tracking-wider transition-all shadow-md font-mono-jb cursor-pointer hover:bg-white/5">
                <RefreshCw size={12} className="animate-spin-slow" /> Sync with DigiLocker KYC
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EligibilityForm
