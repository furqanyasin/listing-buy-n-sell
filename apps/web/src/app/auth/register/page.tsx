'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useRegister } from '@/lib/hooks/use-auth'
import { registerSchema, type RegisterFormData } from '@/lib/validators/auth.validators'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: registerUser, isPending } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      password: data.password,
    })
  }

  return (
    <Card className="w-full max-w-md shadow-modal">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Free to join. Start buying and selling today.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" required>Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Muhammad Ali"
              autoComplete="name"
              leftIcon={<User className="h-4 w-4" />}
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

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

          {/* Phone (optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number <span className="text-surface-400 font-normal">(optional)</span></Label>
            <Input
              id="phone"
              type="tel"
              placeholder="03001234567"
              autoComplete="tel"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" required>Password</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" required>Confirm password</Label>
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="text-surface-400 hover:text-surface-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <p className="text-xs text-surface-400">
            By registering you agree to our{' '}
            <Link href="/terms" className="underline hover:text-surface-700">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-surface-700">Privacy Policy</Link>.
          </p>

          <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
            {isPending ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3 text-xs text-surface-400">
            or
          </span>
        </div>

        <p className="text-center text-sm text-surface-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-brand-500 hover:text-brand-600">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
