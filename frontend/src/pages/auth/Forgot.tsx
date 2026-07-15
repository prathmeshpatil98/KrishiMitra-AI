import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { toast } from 'sonner'

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export function Forgot() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      // Simulate API forgot request
      await new Promise((resolve) => setTimeout(resolve, 1200))
      toast.success(`Password reset instructions sent to: ${data.email}`)
      navigate(ROUTES.AUTH.LOGIN)
    } catch {
      toast.error('Failed to send reset link. Please try again.')
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
          {t('forgot_title')}
        </motion.h2>
        <motion.p
          variants={formElementVariants}
          className="text-[13.5px] leading-relaxed text-text-secondary dark:text-text-muted font-medium"
        >
          {t('forgot_subtitle')}
        </motion.p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white dark:bg-zinc-950 focus:border-farm-green focus:ring-2 focus:ring-farm-green/10 transition-all font-medium text-[14px]"
              {...register('email')}
            />
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div variants={formElementVariants} className="mt-2.5">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            fullWidth
            rightIcon={<ArrowRight size={17} />}
            className="py-3.5 rounded-xl font-black uppercase tracking-wider text-[12px] bg-farm-green hover:bg-brand-hover text-white shadow-glow-green/20"
          >
            {t('forgot_btn')}
          </Button>
        </motion.div>
      </form>

      {/* Footer Back Link */}
      <motion.div
        variants={formElementVariants}
        className="text-center text-[12.5px] mt-2 border-t border-border/40 dark:border-white/5 pt-4"
      >
        <a
          href={ROUTES.AUTH.LOGIN}
          className="font-extrabold text-farm-green hover:underline inline-flex items-center gap-1.5 justify-center"
        >
          <ArrowLeft size={14} />
          {t('forgot_back_login')}
        </a>
      </motion.div>
    </motion.div>
  )
}

export default Forgot
