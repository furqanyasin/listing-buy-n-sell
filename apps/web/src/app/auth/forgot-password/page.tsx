'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useForgotPassword } from '@/lib/hooks/use-auth'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators/auth.validators'

export default function ForgotPasswordPage() {
  const { mutate: sendReset, isPending, isSuccess } = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendReset(data.email)
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-modal">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900">Check your email</h2>
            <p className="text-surface-500 text-sm mt-2">
              If an account exists for <strong>{getValues('email')}</strong>, you&apos;ll
              receive a password reset link shortly.
            </p>
          </div>
          <p className="text-xs text-surface-400">
            Didn&apos;t receive it? Check your spam folder or{' '}
            <button
              onClick={() => sendReset(getValues('email'))}
              className="text-brand-500 hover:underline font-medium"
            >
              resend
            </button>
            .
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-modal">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 pt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Button type="submit" className="w-full" size="lg" isLoading={isPending}>
            {isPending ? 'Sending…' : 'Send Reset Link'}
          </Button>
        </form>

        <Button variant="ghost" className="w-full" asChild>
          <Link href="/auth/login">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
