'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useLogin } from '@/lib/hooks/use-auth'
import { loginSchema, type LoginFormData } from '@/lib/validators/auth.validators'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <Card className="w-full max-w-md shadow-modal">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your CNC Machine Bazaar account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" required>Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" required>Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-brand-500 hover:text-brand-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-surface-400 hover:text-surface-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
            {isPending ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3 text-xs text-surface-400">
            or
          </span>
        </div>

        {/* Register CTA */}
        <p className="text-center text-sm text-surface-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="font-semibold text-brand-500 hover:text-brand-600"
          >
            Create one free
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
