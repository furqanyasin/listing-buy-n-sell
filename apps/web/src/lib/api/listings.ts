import { apiClient } from './client'
import type {
  Listing,
  ListingCard,
  ListingFilters,
  CreateListingRequest,
  PaginatedResponse,
} from '@pw-clone/types'


interface ApiResponse<T> {
  success: boolean
  data: T
}

export async function getListingsApi(
  filters: ListingFilters = {},
): Promise<PaginatedResponse<ListingCard>> {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  })
  const { data } = await apiClient.get<PaginatedResponse<ListingCard>>(
    `/listings?${params.toString()}`,
  )
  return data
}

export async function getFeaturedListingsApi(): Promise<ListingCard[]> {
  const { data } = await apiClient.get<ApiResponse<ListingCard[]>>('/listings/featured')
  return data.data
}

export async function getListingApi(id: string): Promise<Listing> {
  const { data } = await apiClient.get<ApiResponse<Listing>>(`/listings/${id}`)
  return data.data
}

export async function getMyListingsApi(): Promise<ListingCard[]> {
  const { data } = await apiClient.get<ApiResponse<ListingCard[]>>('/listings/user/mine')
  return data.data
}

export async function createListingApi(payload: CreateListingRequest): Promise<Listing> {
  const { data } = await apiClient.post<ApiResponse<Listing>>('/listings', payload)
  return data.data
}

export async function updateListingApi(
  id: string,
  payload: Partial<CreateListingRequest>,
): Promise<Listing> {
  const { data } = await apiClient.patch<ApiResponse<Listing>>(`/listings/${id}`, payload)
  return data.data
}

export async function deleteListingApi(id: string): Promise<void> {
  await apiClient.delete(`/listings/${id}`)
}

export async function getMyListingApi(id: string): Promise<Listing> {
  const { data } = await apiClient.get<ApiResponse<Listing>>(`/listings/user/mine/${id}`)
  return data.data
}
