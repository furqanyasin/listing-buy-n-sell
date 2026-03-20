'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Globe, CheckCircle, Cog, MessageCircle } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ListingCard } from '@/components/listings/listing-card'
import { useDealer } from '@/lib/hooks/use-dealers'
import { useDealerReviews, useCreateReview } from '@/lib/hooks/use-reviews'
import { useAuthStore } from '@/store/auth.store'
import { Star } from 'lucide-react'
import { useState } from 'react'
import type { Review } from '@pw-clone/types'

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-surface-200'}`}
        />
      ))}
    </div>
  )
}

function ReviewsSection({ dealerId }: { dealerId: string }) {
  const isAuthenticated = useAuthStore((s) => !!s.user)
  const { data, isLoading } = useDealerReviews(dealerId)
  const createReview = useCreateReview(dealerId, 'dealer')
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createReview.mutate({ targetDealerId: dealerId, rating, body: body || undefined }, {
      onSuccess: () => setBody(''),
    })
  }

  return (
    <div>
      <h2 className="font-semibold text-surface-800 mb-4 flex items-center gap-2">
        Reviews
        {data?.count ? (
          <span className="text-sm font-normal text-surface-500">
            ({data.count}) · {data.averageRating?.toFixed(1)} avg
          </span>
        ) : null}
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-16 bg-surface-50 rounded-xl" />
          ))}
        </div>
      ) : data && data.reviews.length > 0 ? (
        <div className="space-y-4">
          {data.reviews.map((review: Review) => (
            <div key={review.id} className="p-4 border border-surface-100 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
                  {review.reviewer.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm text-surface-800">{review.reviewer.name}</span>
                <StarRow rating={review.rating} />
                <span className="text-xs text-surface-400 ml-auto">
                  {new Date(review.createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              {review.body && <p className="text-sm text-surface-600 mt-2 ml-9">{review.body}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-surface-400 py-4">No reviews yet.</p>
      )}

      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-surface-100 pt-4">
          <p className="font-medium text-sm text-surface-800">Leave a Review</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)}>
                <Star className={`h-6 w-6 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-surface-200'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Share your experience (optional)"
            className="w-full rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
          <Button type="submit" size="sm" disabled={createReview.isPending}>
            {createReview.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      )}
    </div>
  )
}

function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '92' + digits.slice(1)
  if (digits.startsWith('92') && digits.length === 12) return digits
  return '92' + digits
}

export default function DealerProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: dealer, isLoading, isError } = useDealer(slug)

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-48 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (isError || !dealer) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto text-center py-20">
          <Cog className="h-12 w-12 mx-auto mb-4 text-surface-300" />
          <h1 className="text-xl font-semibold text-surface-700">Supplier not found</h1>
          <p className="text-surface-500 mt-2 mb-6">This supplier may no longer be active.</p>
          <Button asChild>
            <Link href="/dealers">View all suppliers</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  const waUrl = dealer.whatsapp
    ? `https://wa.me/${toWhatsAppNumber(dealer.whatsapp)}`
    : dealer.phone
      ? `https://wa.me/${toWhatsAppNumber(dealer.phone)}`
      : null

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-surface-500 mb-4 flex items-center gap-1.5">
          <Link href="/dealers" className="hover:text-brand-600">Suppliers</Link>
          <span>/</span>
          <span className="text-surface-800 font-medium">{dealer.name}</span>
        </nav>

        {/* Cover banner */}
        <div className="relative h-40 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 mb-16">
          {dealer.coverUrl && (
            <Image src={dealer.coverUrl} alt="" fill className="object-cover" sizes="900px" />
          )}
          {/* Logo */}
          <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-2xl border-4 border-white bg-white shadow overflow-hidden">
            {dealer.logoUrl ? (
              <Image src={dealer.logoUrl} alt={dealer.name} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-700 font-bold text-2xl">
                {dealer.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile info + listings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name + badges */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-surface-900">{dealer.name}</h1>
                {dealer.isVerified && (
                  <Badge className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {dealer.isFeatured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <div className="flex items-center gap-1 text-sm text-surface-500 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {dealer.city.name}
                {dealer.address && ` · ${dealer.address}`}
              </div>
            </div>

            {dealer.description && (
              <>
                <Separator />
                <div>
                  <h2 className="font-semibold text-surface-800 mb-2">About</h2>
                  <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-line">
                    {dealer.description}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Listings */}
            <div>
              <h2 className="font-semibold text-surface-800 mb-4">
                Active Inventory
                <span className="ml-2 text-sm font-normal text-surface-500">
                  ({dealer.listingsCount})
                </span>
              </h2>
              {dealer.listings.length === 0 ? (
                <div className="text-center py-12 text-surface-400">
                  <Cog className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No active listings at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dealer.listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
            <Separator />

            {/* Reviews */}
            <ReviewsSection dealerId={dealer.id} />
          </div>

          {/* Right: Contact card */}
          <div>
            <div className="rounded-2xl border border-surface-200 bg-white p-5 space-y-4 shadow-card sticky top-6">
              <h2 className="font-semibold text-surface-800">Contact Supplier</h2>

              <Button className="w-full gap-2" asChild>
                <a href={`tel:${dealer.phone}`}>
                  <Phone className="h-4 w-4" />
                  {dealer.phone}
                </a>
              </Button>

              {waUrl && (
                <Button variant="secondary" className="w-full gap-2" asChild>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}

              {dealer.website && (
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href={dealer.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                </Button>
              )}

              <Separator />

              <div className="text-xs text-surface-400 space-y-1">
                <p>Member since {new Date(dealer.createdAt).getFullYear()}</p>
                <p>{dealer.listingsCount} active listing{dealer.listingsCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
