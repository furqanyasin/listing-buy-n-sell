// ─── Common / Shared Types ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface ApiResponse<T = void> {
  success: boolean
  message: string
  data?: T
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
  timestamp: string
  path: string
}

export type SortOrder = 'asc' | 'desc'

export type CurrencyCode = 'PKR' | 'USD'

export interface City {
  id: string
  name: string
  slug: string
  province: string
}

export interface Make {
  id: string
  name: string
  slug: string
  logoUrl: string | null
}

export interface VehicleModel {
  id: string
  makeId: string
  name: string
  slug: string
}
