import { apiClient } from './client'
import type { AuthTokens, User } from '@pw-clone/types'

export interface RegisterPayload {
  name: string
  email: string
  phone?: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ApiAuthResponse {
  success: boolean
  message: string
  data: AuthTokens & { user?: User }
}

// ─── Auth API calls ────────────────────────────────────────────────────────────

export async function registerApi(payload: RegisterPayload): Promise<AuthTokens> {
  const { data } = await apiClient.post<ApiAuthResponse>('/auth/register', payload)
  return data.data
}

export async function loginApi(payload: LoginPayload): Promise<AuthTokens> {
  const { data } = await apiClient.post<ApiAuthResponse>('/auth/login', payload)
  return data.data
}

export async function logoutApi(refreshToken: string): Promise<void> {
  await apiClient.post('/auth/logout', { refreshToken })
}

export async function forgotPasswordApi(email: string): Promise<string> {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    '/auth/forgot-password',
    { email },
  )
  return data.message
}

export async function resetPasswordApi(token: string, password: string): Promise<string> {
  const { data } = await apiClient.post<{ success: boolean; message: string }>(
    '/auth/reset-password',
    { token, password },
  )
  return data.message
}

export async function getMeApi(): Promise<User> {
  const { data } = await apiClient.get<{ success: boolean; data: User }>('/users/me')
  return data.data
}

export async function changePasswordApi(
  currentPassword: string,
  newPassword: string,
): Promise<string> {
  const { data } = await apiClient.patch<{ success: boolean; message: string }>(
    '/auth/change-password',
    { currentPassword, newPassword },
  )
  return data.message
}
