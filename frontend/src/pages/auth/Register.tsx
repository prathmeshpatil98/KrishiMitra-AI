import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { toast } from 'sonner'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function Register() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true)
    try {
      // Simulate API register request
      await new Promise((resolve) => setTimeout(resolve, 1200))
      toast.success('Registration successful! Please login with your new credentials.')
      
      // Store a mock register response
      const mockRegisterUser = {
        name: data.name,
        email: data.email,
        role: 'farmer'
      }
      sessionStorage.setItem('krishimitra_registered_demo', JSON.stringify(mockRegisterUser))

      // Persist in localStorage for login validation in mock mode
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('krishimitra_registered_users') || '[]')
        const existingIdx = registeredUsers.findIndex((u: any) => u.email === data.email)
        const newUser = {
          name: data.name,
          email: data.email,
          password: data.password,
          role: 'farmer' as const
        }
        if (existingIdx > -1) {
          registeredUsers[existingIdx] = newUser
        } else {
          registeredUsers.push(newUser)
        }
        localStorage.setItem('krishimitra_registered_users', JSON.stringify(registeredUsers))
      } catch (e) {
        console.error('Failed to save registered user to localStorage:', e)
      }
      
      navigate(ROUTES.AUTH.LOGIN)
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Animation variants
  const formContainerVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const formElementVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  }

  return (
    <motion.div
      variants={formContainerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Title Header */}
      <div className="flex flex-col gap-2.5">
        <motion.h2
          variants={formElementVariants}
          className="text-[24px] font-black text-text-primary dark:text-white tracking-tight leading-tight"
        >
          {t('register_title')}
        </motion.h2>
        <motion.p
          variants={formElementVariants}
          className="text-[13.5px] leading-relaxed text-text-secondary dark:text-text-muted font-medium"
        >
          {t('register_subtitle')}
        </motion.p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Full Name Input */}
        <motion.div variants={formElementVariants}>
          <label className="text-[12.5px] font-extrabold text-text-primary dark:text-zinc-300 block mb-2">
            {t('register_name_label')}
          </label>
          <div className="relative group">
            <Input
              type="text"
              placeholder="Pratiksha Tiwari"
              error={errors.name?.message}
              leftIcon={<User size={17} className="text-text-muted group-focus-within:text-farm-green transition-colors" />}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-zinc-950 focus:border-farm-green focus:ring-2 focus:ring-farm-green/10 transition-all font-medium text-[14px]"
              {...register('name')}
            />
          </div>
        </motion.div>

        {/* Email Address Input */}
        <motion.div variants={formElementVariants}>
          <label className="text-[12.5px] font-extrabold text-text-primary dark:text-zinc-300 block mb-2">
            {t('login_email_label')}
          </label>
          <div className="relative group">
            <Input
              type="email"
              placeholder="name@example.com"
              error={errors.email?.message}
              leftIcon={<Mail size={17} className="text-text-muted group-focus-within:text-farm-green transition-colors" />}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-zinc-950 focus:border-farm-green focus:ring-2 focus:ring-farm-green/10 transition-all font-medium text-[14px]"
              {...register('email')}
            />
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div variants={formElementVariants}>
          <label className="text-[12.5px] font-extrabold text-text-primary dark:text-zinc-300 block mb-2">
            {t('login_password_label')}
          </label>
          <div className="relative group">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.password?.message}
              leftIcon={<Lock size={17} className="text-text-muted group-focus-within:text-farm-green transition-colors" />}
              disabled={loading}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-white dark:bg-zinc-950 focus:border-farm-green focus:ring-2 focus:ring-farm-green/10 transition-all font-medium text-[14px]"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-text-primary focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} className="text-text-muted" /> : <Eye size={16} className="text-text-muted" />}
                </button>
              }
              {...register('password')}
            />
          </div>
        </motion.div>

        {/* Confirm Password Input */}
        <motion.div variants={formElementVariants}>
          <label className="text-[12.5px] font-extrabold text-text-primary dark:text-zinc-300 block mb-2">
            {t('register_confirm_password')}
          </label>
          <div className="relative group">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              leftIcon={<Lock size={17} className="text-text-muted group-focus-within:text-farm-green transition-colors" />}
              disabled={loading}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-white dark:bg-zinc-950 focus:border-farm-green focus:ring-2 focus:ring-farm-green/10 transition-all font-medium text-[14px]"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="hover:text-text-primary focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} className="text-text-muted" /> : <Eye size={16} className="text-text-muted" />}
                </button>
              }
              {...register('confirmPassword')}
            />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div variants={formElementVariants} className="mt-2.5">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            fullWidth
            rightIcon={<ArrowRight size={17} />}
            className="py-3.5 rounded-xl font-black uppercase tracking-wider text-[12px] bg-farm-green hover:bg-brand-hover text-white shadow-glow-green/20"
          >
            {t('register_btn')}
          </Button>
        </motion.div>
      </form>

      {/* Footer Registration Link */}
      <motion.div
        variants={formElementVariants}
        className="text-center text-[12.5px] text-text-secondary dark:text-text-muted mt-2 border-t border-border/40 dark:border-white/5 pt-4"
      >
        {t('register_have_account')}{' '}
        <a
          href={ROUTES.AUTH.LOGIN}
          className="font-extrabold text-farm-green hover:underline"
        >
          {t('register_signin_now')}
        </a>
      </motion.div>
    </motion.div>
  )
}

export default Register
