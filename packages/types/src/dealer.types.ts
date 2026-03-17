// ─── Dealer Types ─────────────────────────────────────────────────────────────

import type { City } from './common.types'
import type { ListingCard } from './listing.types'

export interface Dealer {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  coverUrl: string | null
  address: string | null
  phone: string
  whatsapp: string | null
  website: string | null
  description: string | null
  isVerified: boolean
  isFeatured: boolean
  city: City
  /** Active listing count (derived from user._count in API service) */
  listingsCount: number
  createdAt: string
}

export interface DealerProfile extends Dealer {
  listings: ListingCard[]
}

export interface CreateDealerRequest {
  name: string
  cityId: string
  phone: string
  address?: string
  whatsapp?: string
  website?: string
  description?: string
}
