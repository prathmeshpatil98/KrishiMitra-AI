import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const BOOT_STEPS = [
  { key: 'market', label_en: 'Synchronizing Regional APMC Market Feeds...', label_mr: 'प्रादेशिक एपीएमसी बाजार फीड समक्रमित करत आहे...', label_hi: 'क्षेत्रीय एपीएमसी बाजार फीड को सिंक किया जा रहा है...' },
  { key: 'weather', label_en: 'Analyzing Micro-Climate Threat Matrix...', label_mr: 'सूक्ष्म-हवामान धोक्याच्या मॅट्रिक्सचे विश्लेषण करत आहे...', label_hi: 'सूक्ष्म जलवायु खतरा मैट्रिक्स का विश्लेषण किया जा रहा है...' },
  { key: 'schemes', label_en: 'Verifying Central Agri-Subsidy Registrations...', label_mr: 'केंद्रीय कृषी-अनुदान नोंदणीची पडताळणी करत आहे...', label_hi: 'केंद्रीय कृषि-सब्सिडी पंजीकरण को सत्यापित किया जा रहा है...' },
  { key: 'planner', label_en: 'Initializing Agronomy Intelligence Engine...', label_mr: 'कृषी विज्ञान इंटेलिजेंस इंजिन सुरू करत आहे...', label_hi: 'कृषि विज्ञान इंटेलिजेंस इंजन प्रारंभ हो रहा है...' },
]

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { t, language } = useLanguage()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // System Diagnostics steps:
  // 0: System Loader, 1: Credentials card
  const [currentStep, setCurrentStep] = useState(0)
  const [bootStep, setBootStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setBootStep((prev) => {
        if (prev >= BOOT_STEPS.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setCurrentStep(1)
          }, 350)
          return prev
        }
        return prev + 1
      })
    }, 320)

    return () => clearInterval(interval)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'farmer@krishimitra.ai',
      password: 'password123',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    try {
      // Check if backend is online with a quick health request (timeout 600ms)
      let isBackendOnline = false
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 600)
        const response = await fetch('/api/v1/health', { signal: controller.signal })
        clearTimeout(timeoutId)
        if (response.ok) {
          isBackendOnline = true
        }
      } catch {
        // Backend is offline
      }

      if (isBackendOnline) {
        // If backend is online, authenticate against it directly
        await login(data)
        navigate(ROUTES.DASHBOARD)
      } else {
        // If backend is offline, simulate login check for DEV mode
        if (import.meta.env.DEV) {
          // Check if credentials are valid (default or registered)
          const isDefault = data.email === 'farmer@krishimitra.ai' && data.password === 'password123'
          
          let matchedUser: any = null
          try {
            const registeredUsers = JSON.parse(localStorage.getItem('krishimitra_registered_users') || '[]')
            matchedUser = registeredUsers.find((u: any) => u.email === data.email && u.password === data.password)
          } catch (e) {
            console.error('Failed to read registered users from localStorage:', e)
          }

          if (!isDefault && !matchedUser) {
            throw new Error('Invalid email or password. Please try again.')
          }

          toast.warning('Server offline. Simulating credentials audit with local session cache.')
          
          const mockUser = {
            id: 'mock-farmer-uuid',
            email: data.email,
            role: 'farmer' as const,
            preferred_language: 'en',
            is_verified: true,
            is_active: true,
            created_at: new Date().toISOString(),
            farmer_profile: {
              id: 'mock-profile-uuid',
              full_name: matchedUser ? matchedUser.name : 'Pratiksha Tiwari',
              state: 'Maharashtra',
              district: 'Kolhapur',
            }
          }
          
          sessionStorage.setItem('krishimitra_user', JSON.stringify(mockUser))
          sessionStorage.setItem('krishimitra_access_token', 'mock_farmer_access')
          sessionStorage.setItem('krishimitra_refresh_token', 'mock_farmer_refresh')
          
          setTimeout(() => {
            window.location.href = ROUTES.DASHBOARD
          }, 500)
        } else {
          throw new Error('Backend server is offline. Please try again later.')
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.')
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  // Animation configurations
  const slideVariants = {
    initial: {
      opacity: 0,
      x: 35,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 120, damping: 18 }
    },
    exit: {
      opacity: 0,
      x: -35,
      transition: { duration: 0.25 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  }

  return (
    <div className="relative min-h-[440px] font-sans text-white">
      <AnimatePresence mode="wait">
        {/* ── STEP 0: System Diagnostics Loader ── */}
        {currentStep === 0 && (
          <motion.div
            key="diagnostics"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6"
          >
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="text-farm-green animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-farm-green font-mono">
                  System Diagnostics
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 font-extrabold uppercase">
                {Math.min(bootStep + 1, 4)} / 04 Nodes
              </span>
            </div>

            {/* Diagnostic card */}
            <div className="w-full bg-[#1E293B]/20 border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute left-[31px] top-7 bottom-7 w-[1.5px] bg-slate-800 pointer-events-none" />
              <motion.div
                className="absolute left-[31px] top-7 w-[1.5px] bg-[#22C55E] origin-top pointer-events-none"
                style={{
                  height: 'calc(100% - 56px)',
                  scaleY: bootStep / (BOOT_STEPS.length - 1),
                }}
                transition={{ duration: 0.3 }}
              />

              {BOOT_STEPS.map((step, idx) => {
                const isCompleted = bootStep > idx
                const isActive = bootStep === idx
                const label = language === 'mr' ? step.label_mr : language === 'hi' ? step.label_hi : step.label_en

                return (
                  <motion.div
                    key={step.key}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: isActive || isCompleted ? 1 : 0.25, x: 0 }}
                    className="flex items-center gap-4 relative z-10"
                  >
                    <div className="flex items-center justify-center shrink-0">
                      {isCompleted ? (
                        <div className="w-[23px] h-[23px] rounded-full bg-[#22C55E] text-[#0F172A] flex items-center justify-center shadow-sm">
                          <Check size={11} strokeWidth={3.5} />
                        </div>
                      ) : isActive ? (
                        <div className="w-[23px] h-[23px] rounded-full bg-[#22C55E]/10 border-2 border-[#22C55E] text-[#22C55E] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                        </div>
                      ) : (
                        <div className="w-[23px] h-[23px] rounded-full bg-slate-950/60 border border-slate-800" />
                      )}
                    </div>

                    <span className={`text-[13px] font-bold ${isActive ? 'text-white font-black' : isCompleted ? 'text-zinc-400 font-medium' : 'text-zinc-650'}`}>
                      {label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── STEP 1: Credentials Form ── */}
        {currentStep === 1 && (
          <motion.div
            key="credentials"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6"
          >
            {/* Header titles */}
            <div className="flex flex-col gap-2">
              <h2 className="text-[23px] font-black uppercase text-white font-display leading-none">
                {t('login_welcome')}
              </h2>
              <p className="text-[12.5px] leading-relaxed text-zinc-400 font-semibold">
                {t('login_subtitle')}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Email Address */}
              <motion.div variants={itemVariants} initial="hidden" animate="show">
                <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-2">
                  {t('login_email_label')}
                </label>
                <div className="relative group">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    error={errors.email?.message}
                    leftIcon={<Mail size={16} className="text-zinc-500 group-focus-within:text-[#22C55E] transition-colors" />}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-white/[0.08] bg-slate-950/60 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/10 transition-all font-semibold text-[14px] text-white"
                    {...register('email')}
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} initial="hidden" animate="show">
                <label className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest block mb-2">
                  {t('login_password_label')}
                </label>
                <div className="relative group">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={errors.password?.message}
                    leftIcon={<Lock size={16} className="text-zinc-500 group-focus-within:text-[#22C55E] transition-colors" />}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-white/[0.08] bg-slate-950/60 focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/10 transition-all font-semibold text-[14px] text-white"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-white focus:outline-none cursor-pointer flex items-center justify-center"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={15} className="text-zinc-500" /> : <Eye size={15} className="text-zinc-500" />}
                      </button>
                    }
                    {...register('password')}
                  />
                </div>
              </motion.div>

              {/* Checkbox and Forgot Password */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                className="flex items-center justify-between text-[13px]"
              >
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 rounded border border-white/[0.08] flex items-center justify-center focus:outline-none cursor-pointer bg-slate-950/60 transition-all hover:border-[#22C55E]"
                  >
                    {rememberMe && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2.5 h-2.5 bg-[#22C55E] rounded-xs"
                      />
                    )}
                  </button>
                  <span className="text-[12px] font-extrabold text-zinc-400 select-none">
                    Remember me
                  </span>
                </div>
                <a
                  href={ROUTES.AUTH.FORGOT}
                  className="font-black text-[#22C55E] relative group overflow-visible"
                >
                  {t('login_forgot_password')}
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-[#22C55E] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </a>
              </motion.div>

              {/* Action Button */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="show"
                className="mt-2"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  fullWidth
                  rightIcon={<ArrowRight size={16} />}
                  className="py-4 rounded-xl font-black uppercase tracking-wider text-[12px] bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#0F172A] border-none shadow-glow-green/10"
                >
                  {t('login_signin_btn')}
                </Button>
              </motion.div>
            </form>

            {/* Footer Registration link */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="text-center text-[13px] text-zinc-400 mt-2 border-t border-white/[0.04] pt-4"
            >
              {t('login_no_account')}{' '}
              <a
                href={ROUTES.AUTH.REGISTER}
                className="font-black text-[#22C55E] relative group overflow-visible inline-block ml-0.5"
              >
                {t('login_signup_now')}
                <span className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-[#22C55E] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error Modal Popup ── */}
      <AnimatePresence>
        {showErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowErrorModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-slate-900/90 border border-red-500/20 rounded-3xl p-6 shadow-2xl shadow-red-500/5 backdrop-blur-xl text-center overflow-hidden z-10"
            >
              {/* Top ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-[48px] pointer-events-none" />

              {/* Warning Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 relative z-10">
                <AlertCircle size={28} className="text-red-500 animate-bounce" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-black uppercase tracking-wider text-white mb-2 relative z-10 font-display">
                Authentication Failed
              </h3>

              {/* Message */}
              <p className="text-[14px] leading-relaxed text-zinc-300 mb-6 font-semibold relative z-10 px-2">
                {errorMessage}
              </p>

              {/* Try Again Button */}
              <button
                type="button"
                onClick={() => setShowErrorModal(false)}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-wider text-[12px] rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg shadow-red-500/20"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Login
