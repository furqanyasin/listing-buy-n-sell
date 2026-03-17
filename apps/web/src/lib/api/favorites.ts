import { apiClient } from './client'
import type { ListingCard } from '@pw-clone/types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export async function toggleFavoriteApi(listingId: string): Promise<{ isFavorited: boolean }> {
  const { data } = await apiClient.post<ApiResponse<{ isFavorited: boolean }>>(
    `/favorites/${listingId}`,
  )
  return data.data
}

export async function getFavoritesApi(): Promise<ListingCard[]> {
  const { data } = await apiClient.get<ApiResponse<ListingCard[]>>('/favorites')
  return data.data
}

export async function getFavoriteIdsApi(): Promise<string[]> {
  const { data } = await apiClient.get<ApiResponse<string[]>>('/favorites/ids')
  return data.data
}
