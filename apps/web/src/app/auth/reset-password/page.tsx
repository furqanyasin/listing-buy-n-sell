'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useResetPassword } from '@/lib/hooks/use-auth'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators/auth.validators'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: resetPassword, isPending } = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-modal">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900">Invalid reset link</h2>
            <p className="text-surface-500 text-sm mt-2">
              This password reset link is missing or invalid. Please request a new one.
            </p>
          </div>
          <Button className="w-full" asChild>
            <Link href="/auth/forgot-password">Request New Link</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword({ token, password: data.password })
  }

  return (
    <Card className="w-full max-w-md shadow-modal">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Set new password</CardTitle>
        <CardDescription>
          Choose a strong password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" required>New password</Label>
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

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" required>Confirm new password</Label>
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat new password"
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

          <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
            {isPending ? 'Saving…' : 'Set New Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="h-64 w-full max-w-md animate-pulse bg-surface-100 rounded-2xl" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
