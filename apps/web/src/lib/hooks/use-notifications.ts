'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getNotificationsApi,
  getUnreadCountApi,
  markAllNotificationsReadApi,
  markNotificationReadApi,
} from '@/lib/api/notifications'
import { useAuthStore } from '@/store/auth.store'

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => !!s.user)
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsApi,
    enabled: isAuthenticated,
    refetchInterval: 30_000,
  })
}

export function useUnreadCount() {
  const isAuthenticated = useAuthStore((s) => !!s.user)
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCountApi,
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    staleTime: 60_000,
  })
}

export function useMarkRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => markNotificationReadApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsReadApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
