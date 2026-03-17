// ─── Dealer Types ─────────────────────────────────────────────────────────────

import type { City } from './common.types'
import type { ListingCard } from './listing.types'

export interface Dealer {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  address: string | null
  phone: string
  website: string | null
  description: string | null
  isVerified: boolean
  isFeatured: boolean
  city: City
  listingsCount: number
  createdAt: string
}

export interface DealerProfile extends Dealer {
  listings: ListingCard[]
  averageRating: number | null
  reviewsCount: number
}
