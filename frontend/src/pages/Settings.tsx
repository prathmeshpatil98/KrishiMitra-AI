/**
 * KrishiMitra AI — Premium User Settings & Profile Page
 * ======================================================
 * Interactive tabbed profile configurations utilizing slide indicators,
 * glowing inputs, and spring actions.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Sprout, Save, CheckCircle, MapPin, Globe, ChevronRight } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/app/providers/LanguageProvider'

export function Settings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'demographics' | 'crops' | 'system'>('profile')
  const [isSaved, setIsSaved] = useState(false)

  // Local Form States
  const [fullName, setFullName] = useState(user?.farmer_profile?.full_name || 'Prathmesh Patil')
  const [email, setEmail] = useState(user?.email || 'farmer@krishimitra.ai')
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210')
  const [state, setState] = useState(user?.farmer_profile?.state || 'Maharashtra')
  const [district, setDistrict] = useState(user?.farmer_profile?.district || 'Kolhapur')
  const [crop, setCrop] = useState('Sugarcane')
  const [quantity, setQuantity] = useState('500')
  const { language: lang, setLanguage: setLang, t } = useLanguage()

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: t('settings_tab_profile'), icon: User, desc: 'Credentials and Aadhaar verification' },
    { id: 'demographics', label: t('settings_tab_demographics'), icon: MapPin, desc: 'Farming coordinates and block details' },
    { id: 'crops', label: t('settings_tab_crops'), icon: Sprout, desc: 'Prepopulated crop inputs for advisor insights' },
    { id: 'system', label: t('settings_tab_system'), icon: Globe, desc: 'Preferred interface language configurations' },
  ] as const

  return (
    <div className="w-full flex flex-col gap-8 max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-h1 font-black text-text-primary dark:text-zinc-50 tracking-tight leading-none uppercase">
          {t('settings_title')}
        </h1>
        <p className="text-[14.5px] text-text-secondary dark:text-zinc-400 mt-2 font-medium">
          {t('settings_subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side Tab Navigation */}
        <div className="flex flex-col gap-2 relative z-10">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-3 cursor-pointer relative focus:outline-none ${
                  active
                    ? 'text-farm-green dark:text-emerald-400 font-extrabold border-farm-green dark:border-emerald-500/30 shadow-sm'
                    : 'bg-white dark:bg-zinc-900/40 border-border/60 dark:border-white/5 text-text-secondary dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:border-farm-green/30'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeSettingTab"
                    className="absolute inset-0 bg-farm-green/[0.03] dark:bg-emerald-500/[0.02] rounded-xl z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <Icon
                  size={18}
                  className={`shrink-0 mt-0.5 ${
                    active ? 'text-farm-green dark:text-emerald-400' : 'text-text-muted'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] font-extrabold block">{tab.label}</span>
                  <span className="text-[10px] text-text-muted font-bold block mt-1 truncate uppercase tracking-wider">
                    {tab.desc}
                  </span>
                </div>
                <ChevronRight
                  size={14}
                  className={`shrink-0 text-text-muted mt-1.5 transition-transform duration-200 ${
                    active ? 'translate-x-0.5 text-farm-green dark:text-emerald-400' : ''
                  }`}
                />
              </button>
            )
          })}
        </div>

        {/* Right Side Settings Forms panels */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="glass shadow-card border border-border/60 dark:border-white/5 bg-white dark:bg-zinc-900/30 overflow-hidden">
            <Card.Body className="p-7">
              <AnimatePresence mode="wait">
                {/* Profile Details Tab Content */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                  >
                    <h3 className="font-extrabold text-text-primary dark:text-zinc-50 text-[14px] border-b border-border/30 dark:border-white/5 pb-3 flex items-center gap-2">
                      <User size={16} className="text-farm-green dark:text-emerald-400" /> Profile Credentials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13.5px]">
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Full Name</label>
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="focus-ring" />
                      </div>
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Email Address</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="focus-ring" />
                      </div>
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Mobile Number</label>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="focus-ring" />
                      </div>
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label className="flex items-center justify-between">
                          Aadhaar KYC Verification Status
                          <Badge variant="success" className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5">
                            KYC Verified
                          </Badge>
                        </label>
                        <Input
                          value="Aadhaar linked successfully via OTP KYC"
                          disabled
                          className="bg-zinc-100 dark:bg-zinc-950/40 cursor-not-allowed text-text-muted border border-border/40 dark:border-white/5 font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Demographics Tab Content */}
                {activeTab === 'demographics' && (
                  <motion.div
                    key="demographics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                  >
                    <h3 className="font-extrabold text-text-primary dark:text-zinc-50 text-[14px] border-b border-border/30 dark:border-white/5 pb-3 flex items-center gap-2">
                      <MapPin size={16} className="text-farm-green dark:text-emerald-400" /> GPS Demographics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13.5px]">
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>State</label>
                        <Input value={state} onChange={(e) => setState(e.target.value)} className="focus-ring" />
                      </div>
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>District</label>
                        <Input value={district} onChange={(e) => setDistrict(e.target.value)} className="focus-ring" />
                      </div>
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Latitude Coordinates (N)</label>
                        <Input
                          value="16.7032"
                          disabled
                          className="bg-zinc-100 dark:bg-zinc-950/40 cursor-not-allowed text-text-muted border border-border/40 dark:border-white/5 font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Longitude Coordinates (E)</label>
                        <Input
                          value="74.2498"
                          disabled
                          className="bg-zinc-100 dark:bg-zinc-950/40 cursor-not-allowed text-text-muted border border-border/40 dark:border-white/5 font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Crop Attributes Tab Content */}
                {activeTab === 'crops' && (
                  <motion.div
                    key="crops"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                  >
                    <h3 className="font-extrabold text-text-primary dark:text-zinc-50 text-[14px] border-b border-border/30 dark:border-white/5 pb-3 flex items-center gap-2">
                      <Sprout size={16} className="text-farm-green dark:text-emerald-400" /> Prepopulated Crop Attributes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13.5px]">
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Primary Cultivated Crop</label>
                        <Input value={crop} onChange={(e) => setCrop(e.target.value)} className="focus-ring" />
                      </div>
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Registered Land Sowing Area (Acres)</label>
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="focus-ring"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* System Settings Tab Content */}
                {activeTab === 'system' && (
                  <motion.div
                    key="system"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                  >
                    <h3 className="font-extrabold text-text-primary dark:text-zinc-50 text-[14px] border-b border-border/30 dark:border-white/5 pb-3 flex items-center gap-2">
                      <Globe size={16} className="text-farm-green dark:text-emerald-400" /> Interface Localization
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-[13.5px]">
                      <div className="flex flex-col gap-2 font-bold text-text-primary dark:text-zinc-200">
                        <label>Default Interface Language</label>
                        <select
                          value={lang}
                          onChange={(e) => setLang(e.target.value as 'en' | 'hi' | 'mr')}
                          className="bg-zinc-50 dark:bg-zinc-950 border border-border/60 dark:border-white/5 rounded-xl px-3 py-2 text-[13px] text-text-primary dark:text-zinc-200 outline-none focus:ring-1 focus:ring-farm-green font-medium"
                        >
                          <option value="en">Simple English</option>
                          <option value="hi">हिंदी (Hindi)</option>
                          <option value="mr">मराठी (Marathi)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card.Body>
          </Card>

          {/* Action Trigger Buttons */}
          <div className="flex justify-end gap-3.5 items-center">
            {isSaved && (
              <span className="text-[12.5px] text-emerald-500 font-extrabold flex items-center gap-1.5">
                <CheckCircle size={16} /> {t('settings_success_msg')}
              </span>
            )}
            <Button
              onClick={handleSave}
              className="bg-farm-green dark:bg-emerald-600 hover:bg-brand-hover dark:hover:bg-emerald-500 text-white flex items-center gap-2 h-10 px-6 font-black uppercase tracking-wider rounded-xl shadow-md border-0"
            >
              <Save size={14} /> {t('settings_save_btn')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
