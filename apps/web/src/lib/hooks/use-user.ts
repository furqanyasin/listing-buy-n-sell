'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getMeApi, changePasswordApi } from '@/lib/api/auth'
import { updateProfileApi } from '@/lib/api/users'
import { useAuthStore } from '@/store/auth.store'

export function useProfile() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: getMeApi,
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (user) => {
      queryClient.setQueryData(['user', 'me'], user)
      // Keep auth store in sync so the header shows updated name
      const token = useAuthStore.getState().accessToken
      if (token) useAuthStore.getState().setAuth(user, token)
      toast.success('Profile updated')
    },
    onError: () => toast.error('Failed to update profile'),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => changePasswordApi(currentPassword, newPassword),
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to change password')
    },
  })
}
