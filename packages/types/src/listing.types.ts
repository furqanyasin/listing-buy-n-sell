// ─── Listing / Vehicle Types ──────────────────────────────────────────────────

import type { User } from './user.types'
import type { City, Make, VehicleModel, CurrencyCode } from './common.types'

export type FuelType = 'PETROL' | 'DIESEL' | 'HYBRID' | 'ELECTRIC' | 'CNG' | 'LPG'
export type TransmissionType = 'AUTOMATIC' | 'MANUAL'
export type BodyType =
  | 'SEDAN'
  | 'SUV'
  | 'HATCHBACK'
  | 'PICKUP'
  | 'VAN'
  | 'TRUCK'
  | 'COUPE'
  | 'CONVERTIBLE'
  | 'WAGON'
  | 'OTHER'
export type VehicleCondition = 'NEW' | 'USED'
export type ListingStatus = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'REJECTED'

export interface ListingImage {
  id: string
  url: string
  publicId: string
  isPrimary: boolean
  order: number
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: CurrencyCode
  year: number
  mileage: number
  fuelType: FuelType
  transmission: TransmissionType
  bodyType: BodyType
  color: string
  condition: VehicleCondition
  locationText: string | null
  status: ListingStatus
  viewsCount: number
  isFeatured: boolean
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  make: Make
  model: VehicleModel
  city: City
  seller: Pick<User, 'id' | 'name' | 'phone' | 'avatarUrl'> & { createdAt: string }
  images: ListingImage[]
}

export interface ListingCard
  extends Pick<
    Listing,
    | 'id'
    | 'title'
    | 'price'
    | 'currency'
    | 'year'
    | 'mileage'
    | 'fuelType'
    | 'transmission'
    | 'bodyType'
    | 'condition'
    | 'status'
    | 'isFeatured'
    | 'locationText'
    | 'createdAt'
  > {
  make: Make
  model: VehicleModel
  city: Pick<City, 'id' | 'name' | 'province'>
  /** Array of images — primary image is first item (filtered on API side) */
  images: ListingImage[]
}

export interface CreateListingRequest {
  title: string
  description: string
  price: number
  currency: CurrencyCode
  makeId: string
  modelId: string
  year: number
  mileage: number
  fuelType: FuelType
  transmission: TransmissionType
  bodyType: BodyType
  color: string
  condition: VehicleCondition
  cityId: string
  locationText?: string
  imageIds: string[]
}

export interface ListingFilters {
  q?: string
  makeId?: string
  modelId?: string
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  mileageMax?: number
  fuelType?: FuelType
  transmission?: TransmissionType
  bodyType?: BodyType
  condition?: VehicleCondition
  cityId?: string
  isFeatured?: boolean
  sortBy?: 'createdAt' | 'price' | 'mileage' | 'year'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
