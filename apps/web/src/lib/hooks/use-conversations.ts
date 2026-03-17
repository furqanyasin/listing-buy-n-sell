'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createConversationApi,
  getConversationsApi,
  getConversationApi,
  sendMessageApi,
  markReadApi,
} from '@/lib/api/conversations'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: getConversationsApi,
    refetchInterval: 15_000, // poll every 15s to update unread counts
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ['conversations', id],
    queryFn: () => getConversationApi(id),
    enabled: !!id,
    refetchInterval: 3_000, // poll every 3s while thread is open
  })
}

export function useCreateConversation() {
  return useMutation({
    mutationFn: createConversationApi,
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to start conversation')
    },
  })
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: string) => sendMessageApi(conversationId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] })
      void queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: () => toast.error('Failed to send message'),
  })
}

export function useMarkRead(conversationId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => markReadApi(conversationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
