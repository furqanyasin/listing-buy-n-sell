import { apiClient } from './client'
import type { Dealer, DealerProfile, CreateDealerRequest } from '@pw-clone/types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export async function getDealersApi(): Promise<Dealer[]> {
  const { data } = await apiClient.get<ApiResponse<Dealer[]>>('/dealers')
  return data.data
}

export async function getDealerApi(slug: string): Promise<DealerProfile> {
  const { data } = await apiClient.get<ApiResponse<DealerProfile>>(`/dealers/${slug}`)
  return data.data
}

export async function registerDealerApi(payload: CreateDealerRequest): Promise<Dealer> {
  const { data } = await apiClient.post<ApiResponse<Dealer>>('/dealers', payload)
  return data.data
}

export async function getMyDealerApi(): Promise<Dealer> {
  const { data } = await apiClient.get<ApiResponse<Dealer>>('/dealers/me/profile')
  return data.data
}

export async function updateDealerApi(
  id: string,
  payload: Partial<CreateDealerRequest>,
): Promise<Dealer> {
  const { data } = await apiClient.patch<ApiResponse<Dealer>>(`/dealers/${id}`, payload)
  return data.data
}
