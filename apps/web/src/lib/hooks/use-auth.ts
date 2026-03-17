'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { loginApi, registerApi, logoutApi, forgotPasswordApi, resetPasswordApi } from '@/lib/api/auth'
import { useAuthStore } from '@/store/auth.store'
import type { LoginPayload, RegisterPayload } from '@/lib/api/auth'

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (tokens) => {
      // Store tokens in localStorage for the Axios interceptor
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)

      // Update Zustand store — user profile fetch happens separately
      // For now store minimal data; full profile loaded in Phase 9 (dashboard)
      toast.success('Welcome back!')
      router.push('/dashboard')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Login failed. Please try again.'
      toast.error(message)
    },
  })
}

// ─── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (tokens) => {
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      toast.success('Account created! Welcome to PW Clone.')
      router.push('/dashboard')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Registration failed. Please try again.'
      toast.error(message)
    },
  })
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) await logoutApi(refreshToken)
    },
    onSettled: () => {
      clearAuth()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/')
      toast.success('Signed out successfully')
    },
  })
}

// ─── useForgotPassword ────────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),
    onSuccess: (message) => {
      toast.success(message)
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.')
    },
  })
}

// ─── useResetPassword ─────────────────────────────────────────────────────────

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPasswordApi(token, password),
    onSuccess: (message) => {
      toast.success(message)
      router.push('/auth/login')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message ?? 'Reset failed. The link may have expired.'
      toast.error(message)
    },
  })
}
