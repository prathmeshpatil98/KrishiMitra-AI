/**
 * KrishiMitra AI — Premium Login Page
 * ====================================
 * Purpose: Provide secure login interface for farmers, administrators, and officers.
 * Responsibilities: Form validation via React Hook Form + Zod, call Auth Context login method, handle error displays.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    try {
      // In development / prototype, if the backend server is down, we allow a local bypass
      // to let the user see the application shell.
      try {
        await login(data)
        navigate(ROUTES.DASHBOARD)
      } catch (err: any) {
        if (import.meta.env.DEV) {
          toast.warning('Server unavailable. Logging in with temporary mock session for frontend evaluation.')
          // Perform local mock login
          const mockUser = {
            id: 'mock-uuid',
            email: data.email,
            role: 'farmer' as const,
            preferred_language: 'en',
            is_verified: true,
            is_active: true,
            created_at: new Date().toISOString(),
            farmer_profile: {
              id: 'mock-profile-uuid',
              full_name: 'Rajesh Kumar',
              state: 'Madhya Pradesh',
              district: 'Indore',
            }
          }
          sessionStorage.setItem('krishimitra_user', JSON.stringify(mockUser))
          sessionStorage.setItem('krishimitra_access_token', 'mock_access')
          sessionStorage.setItem('krishimitra_refresh_token', 'mock_refresh')
          // Force page reload to sync state or redirect directly
          window.location.href = ROUTES.DASHBOARD
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Headings */}
      <div className="flex flex-col gap-1.5 text-center lg:text-left">
        <h2 className="text-h2 font-bold text-text-primary dark:text-white tracking-tight">
          Welcome to KrishiMitra AI
        </h2>
        <p className="text-small text-text-secondary dark:text-text-muted">
          Enter your details below to access your farming advisor panel.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          leftIcon={<Mail size={18} />}
          disabled={loading}
          {...register('email')}
        />

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          leftIcon={<Lock size={18} />}
          disabled={loading}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-text-primary focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          {...register('password')}
        />

        {/* Forgot Password */}
        <div className="flex justify-end select-none">
          <a
            href={ROUTES.AUTH.FORGOT}
            className="text-caption font-semibold text-brand-primary hover:text-brand-primary-hover hover:underline"
          >
            Forgot your password?
          </a>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          fullWidth
          rightIcon={<ArrowRight size={18} />}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Footer Registration link */}
      <div className="text-center text-caption text-text-secondary dark:text-text-muted">
        Don't have an account?{' '}
        <a
          href={ROUTES.AUTH.REGISTER}
          className="font-semibold text-brand-primary hover:text-brand-primary-hover hover:underline"
        >
          Sign up now
        </a>
      </div>
    </div>
  )
}

export default Login
