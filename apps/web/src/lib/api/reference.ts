import { apiClient } from './client'
import type { Make, VehicleModel, City } from '@pw-clone/types'

interface ApiListResponse<T> {
  success: boolean
  data: T[]
}

export async function getMakesApi(): Promise<Make[]> {
  const { data } = await apiClient.get<ApiListResponse<Make>>('/reference/makes')
  return data.data
}

export async function getModelsByMakeApi(makeId: string): Promise<VehicleModel[]> {
  const { data } = await apiClient.get<ApiListResponse<VehicleModel>>(
    `/reference/makes/${makeId}/models`,
  )
  return data.data
}

export async function getCitiesApi(): Promise<City[]> {
  const { data } = await apiClient.get<ApiListResponse<City>>('/reference/cities')
  return data.data
}
