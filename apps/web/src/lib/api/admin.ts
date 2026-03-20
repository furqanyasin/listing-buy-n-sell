import { apiClient } from './client'

export async function getAdminStatsApi() {
  const res = await apiClient.get('/admin/stats')
  return res.data.data
}

export async function getPendingListingsApi() {
  const res = await apiClient.get('/admin/listings/pending')
  return res.data.data
}

export async function approveListingApi(id: string) {
  const res = await apiClient.patch(`/admin/listings/${id}/approve`)
  return res.data.data
}

export async function rejectListingApi(id: string, reason?: string) {
  const res = await apiClient.patch(`/admin/listings/${id}/reject`, { reason })
  return res.data.data
}

export async function toggleFeaturedApi(id: string) {
  const res = await apiClient.patch(`/admin/listings/${id}/featured`)
  return res.data.data
}

export async function getAdminUsersApi(page = 1, limit = 20) {
  const res = await apiClient.get('/admin/users', { params: { page, limit } })
  return res.data.data
}

export async function banUserApi(id: string) {
  const res = await apiClient.patch(`/admin/users/${id}/ban`)
  return res.data.data
}

export async function changeUserRoleApi(id: string, role: string) {
  const res = await apiClient.patch(`/admin/users/${id}/role`, { role })
  return res.data.data
}
