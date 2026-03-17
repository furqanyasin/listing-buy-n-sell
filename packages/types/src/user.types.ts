// ─── User Types ───────────────────────────────────────────────────────────────

import type { UserRole } from './auth.types'

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: UserRole
  isVerified: boolean
  createdAt: string
}

export interface UserProfile extends User {
  listingsCount: number
  reviewsCount: number
  averageRating: number | null
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  avatarUrl?: string
}
