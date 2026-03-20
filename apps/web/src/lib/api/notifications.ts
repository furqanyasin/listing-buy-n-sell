import { apiClient } from './client'
import type { NotificationsResponse } from '@pw-clone/types'

export async function getNotificationsApi(): Promise<NotificationsResponse> {
  const res = await apiClient.get<{ data: NotificationsResponse }>('/notifications')
  return res.data.data
}

export async function getUnreadCountApi(): Promise<{ count: number }> {
  const res = await apiClient.get<{ data: { count: number } }>('/notifications/unread-count')
  return res.data.data
}

export async function markNotificationReadApi(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`)
}

export async function markAllNotificationsReadApi(): Promise<void> {
  await apiClient.patch('/notifications/read-all')
}
