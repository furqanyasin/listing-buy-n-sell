import { apiClient } from './client'
import type { ConversationListItem, ConversationDetail, Message } from '@pw-clone/types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export async function createConversationApi(
  listingId: string,
): Promise<{ id: string; isNew: boolean }> {
  const { data } = await apiClient.post<ApiResponse<{ id: string; isNew: boolean }>>(
    '/conversations',
    { listingId },
  )
  return data.data
}

export async function getConversationsApi(): Promise<ConversationListItem[]> {
  const { data } = await apiClient.get<ApiResponse<ConversationListItem[]>>('/conversations')
  return data.data
}

export async function getConversationApi(id: string): Promise<ConversationDetail> {
  const { data } = await apiClient.get<ApiResponse<ConversationDetail>>(`/conversations/${id}`)
  return data.data
}

export async function sendMessageApi(conversationId: string, body: string): Promise<Message> {
  const { data } = await apiClient.post<ApiResponse<Message>>(
    `/conversations/${conversationId}/messages`,
    { body },
  )
  return data.data
}

export async function markReadApi(conversationId: string): Promise<void> {
  await apiClient.patch(`/conversations/${conversationId}/read`)
}
