'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  approveListingApi,
  banUserApi,
  changeUserRoleApi,
  getAdminStatsApi,
  getAdminUsersApi,
  getPendingListingsApi,
  rejectListingApi,
  toggleFeaturedApi,
} from '@/lib/api/admin'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStatsApi,
    staleTime: 60_000,
  })
}

export function usePendingListings() {
  return useQuery({
    queryKey: ['admin', 'listings', 'pending'],
    queryFn: getPendingListingsApi,
  })
}

export function useApproveListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveListingApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Listing approved')
    },
    onError: () => toast.error('Failed to approve'),
  })
}

export function useRejectListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectListingApi(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Listing rejected')
    },
    onError: () => toast.error('Failed to reject'),
  })
}

export function useToggleFeatured() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleFeaturedApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] })
      toast.success('Featured status updated')
    },
  })
}

export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => getAdminUsersApi(page),
  })
}

export function useBanUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => banUserApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User status updated')
    },
    onError: () => toast.error('Failed to update user'),
  })
}

export function useChangeUserRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => changeUserRoleApi(id, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role'),
  })
}
