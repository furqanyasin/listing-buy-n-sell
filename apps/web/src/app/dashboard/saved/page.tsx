'use client'

import Link from 'next/link'
import { Heart, Cog } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ListingCard } from '@/components/listings/listing-card'
import { useFavorites } from '@/lib/hooks/use-favorites'

export default function SavedPage() {
  const { data: listings = [], isLoading } = useFavorites()

  return (
    <PageWrapper contained>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Saved Machines</h1>
          <p className="text-surface-500 mt-1">Machines you&apos;ve saved for later.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/cars">Browse Machines</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-surface-400">
          <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No saved machines yet</p>
          <p className="text-sm mt-1">
            Tap the{' '}
            <Heart className="inline h-3 w-3 mx-0.5" />
            {' '}on any listing to save it here.
          </p>
          <Button asChild className="mt-6">
            <Link href="/cars">
              <Cog className="h-4 w-4" />
              Browse Machines
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
