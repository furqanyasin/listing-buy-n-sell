'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Gauge, Fuel, Calendar, Zap, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth.store'
import { useFavoriteIds, useToggleFavorite } from '@/lib/hooks/use-favorites'
import type { ListingCard } from '@pw-clone/types'

interface ListingCardProps {
  listing: ListingCard
  className?: string
}

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `${(price / 10_000_000).toFixed(1)} Crore`
  if (price >= 100_000) return `${(price / 100_000).toFixed(1)} Lakh`
  return price.toLocaleString('en-PK')
}

function formatMileage(km: number): string {
  if (km >= 1000) return `${Math.round(km / 1000)}k km`
  return `${km} km`
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const primaryImage = listing.images?.[0] ?? null
  const fuelLabel = listing.fuelType.charAt(0) + listing.fuelType.slice(1).toLowerCase()
  const transmLabel = listing.transmission === 'AUTOMATIC' ? 'Auto' : 'Manual'

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: favoriteIds } = useFavoriteIds()
  const toggleFavorite = useToggleFavorite()
  const isFavorited = favoriteIds?.includes(listing.id) ?? false

  return (
    <Link
      href={`/cars/${listing.id}`}
      className={cn(
        'group block rounded-xl border border-surface-200 bg-white overflow-hidden',
        'shadow-card hover:shadow-card-hover transition-shadow duration-200',
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-100 overflow-hidden">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-surface-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {listing.isFeatured && (
            <Badge className="text-[10px] px-2 py-0.5 bg-brand-500">Featured</Badge>
          )}
          {listing.condition === 'NEW' && (
            <Badge variant="success" className="text-[10px] px-2 py-0.5">
              New
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        {isAuthenticated && (
          <button
            type="button"
            aria-label={isFavorited ? 'Remove from saved' : 'Save listing'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleFavorite.mutate(listing.id)
            }}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              'bg-white/80 hover:bg-white shadow-sm',
              isFavorited ? 'text-red-500' : 'text-surface-400 hover:text-red-400',
            )}
          >
            <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Make + Model + Year */}
        <p className="text-xs text-surface-500 font-medium mb-0.5">
          {listing.make.name} {listing.model.name} · {listing.year}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-surface-900 line-clamp-1 mb-2 group-hover:text-brand-600 transition-colors">
          {listing.title}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-brand-600 mb-2">
          PKR {formatPrice(listing.price)}
        </p>

        {/* Specs row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-surface-500">
          <span className="flex items-center gap-1">
            <Gauge className="h-3 w-3" />
            {formatMileage(listing.mileage)}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            {fuelLabel}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {transmLabel}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {listing.year}
          </span>
        </div>

        {/* City */}
        <div className="mt-2 flex items-center gap-1 text-xs text-surface-400">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.city.name}</span>
        </div>
      </div>
    </Link>
  )
}
