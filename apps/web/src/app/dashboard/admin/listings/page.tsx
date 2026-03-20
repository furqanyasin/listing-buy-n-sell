'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, CheckCircle, XCircle, Star } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useApproveListing, usePendingListings, useRejectListing, useToggleFeatured } from '@/lib/hooks/use-admin'

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `${(price / 10_000_000).toFixed(1)} Crore`
  if (price >= 100_000) return `${(price / 100_000).toFixed(1)} Lakh`
  return price.toLocaleString('en-PK')
}

export default function AdminListingsPage() {
  const { data: listings, isLoading } = usePendingListings()
  const approveMutation = useApproveListing()
  const rejectMutation = useRejectListing()
  const featuredMutation = useToggleFeatured()
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  function handleReject(id: string) {
    rejectMutation.mutate({ id, reason: rejectReason || undefined }, {
      onSuccess: () => {
        setRejectId(null)
        setRejectReason('')
      },
    })
  }

  return (
    <PageWrapper contained>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-surface-900 mb-6">
          Pending Listings
          {listings && listings.length > 0 && (
            <span className="ml-3 text-base font-medium text-amber-600">
              ({listings.length} awaiting review)
            </span>
          )}
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {listings.map((listing: any) => {
              const img = listing.images?.[0]
              return (
                <div
                  key={listing.id}
                  className="flex gap-4 p-4 border border-surface-100 rounded-2xl bg-white"
                >
                  <div className="relative w-24 h-18 rounded-xl overflow-hidden bg-surface-100 shrink-0">
                    {img ? (
                      <Image src={img.url} alt={listing.title} fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-surface-300 text-xs">No img</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-surface-900 truncate">{listing.title}</p>
                        <p className="text-sm text-surface-500">
                          {listing.make?.name} {listing.model?.name} · {listing.city?.name}
                        </p>
                        <p className="text-sm font-medium text-brand-600 mt-0.5">
                          PKR {formatPrice(Number(listing.price))}
                        </p>
                        <p className="text-xs text-surface-400 mt-1">
                          by {listing.seller?.name} ({listing.seller?.email})
                        </p>
                      </div>
                      <Link href={`/cars/${listing.id}`} target="_blank">
                        <ExternalLink className="h-4 w-4 text-surface-400 hover:text-brand-600" />
                      </Link>
                    </div>

                    {/* Reject reason input */}
                    {rejectId === listing.id && (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Rejection reason (optional)"
                          className="flex-1 text-sm border border-surface-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(listing.id)}
                          disabled={rejectMutation.isPending}
                        >
                          Confirm
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setRejectId(null)}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => approveMutation.mutate(listing.id)}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1.5"
                      onClick={() => setRejectId(listing.id)}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      variant={listing.isFeatured ? 'secondary' : 'outline'}
                      className="gap-1.5"
                      onClick={() => featuredMutation.mutate(listing.id)}
                    >
                      <Star className="h-3.5 w-3.5" />
                      {listing.isFeatured ? 'Unfeature' : 'Feature'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-surface-400">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">All caught up! No pending listings.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
