'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SkeletonListingCard } from '@/components/ui/skeleton'
import { ListingCard } from './listing-card'
import { useFeaturedListings } from '@/lib/hooks/use-listings'

export function FeaturedSection() {
  const { data: listings, isLoading } = useFeaturedListings()

  // Don't render the section if there are no featured listings and we're not loading
  if (!isLoading && (!listings || listings.length === 0)) return null

  return (
    <section className="container mx-auto py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-surface-900">Featured Machines</h2>
          <p className="text-surface-500 text-sm mt-1">Hand-picked equipment this week</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/machines?isFeatured=true" className="gap-2">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonListingCard key={i} />)
          : listings?.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    </section>
  )
}
