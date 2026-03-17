import { apiClient } from './client'
import type { User, UpdateProfileRequest } from '@pw-clone/types'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export async function updateProfileApi(payload: UpdateProfileRequest): Promise<User> {
  const { data } = await apiClient.patch<ApiResponse<User>>('/users/me', payload)
  return data.data
}
