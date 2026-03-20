'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Cog, Heart, Eye, Plus, Trash2, ExternalLink, Pencil, Settings, MessageCircle } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyListings, useDeleteListing } from '@/lib/hooks/use-listings'
import type { ListingCard } from '@pw-clone/types'


// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    ACTIVE: { label: 'Active', variant: 'default' },
    PENDING: { label: 'Under Review', variant: 'secondary' },
    REJECTED: { label: 'Rejected', variant: 'destructive' },
    SOLD: { label: 'Sold', variant: 'outline' },
    EXPIRED: { label: 'Expired', variant: 'outline' },
    DRAFT: { label: 'Draft', variant: 'secondary' },
  }
  const s = map[status] ?? { label: status, variant: 'outline' as const }
  return <Badge variant={s.variant}>{s.label}</Badge>
}

// ─── Listing row ──────────────────────────────────────────────────────────────

function ListingRow({
  listing,
  onDelete,
}: {
  listing: ListingCard
  onDelete: (id: string) => void
}) {
  const primaryImage = listing.images?.[0]

  return (
    <div className="flex items-center gap-4 p-4 border border-surface-100 rounded-xl hover:bg-surface-50 transition-colors">
      {/* Thumbnail */}
      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-surface-100 shrink-0">
        {primaryImage ? (
          <Image src={primaryImage.url} alt={listing.title} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Cog className="h-6 w-6 text-surface-300" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-surface-900 truncate">{listing.title}</p>
        <p className="text-sm text-surface-500 mt-0.5">
          {listing.make.name} {listing.model.name} · {listing.year} · {listing.city.name}
        </p>
        <p className="text-sm font-semibold text-brand-600 mt-0.5">
          PKR {Number(listing.price).toLocaleString()}
        </p>
      </div>

      {/* Status */}
      <div className="shrink-0 hidden sm:block">
        {listing.status && <StatusBadge status={listing.status} />}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="icon" asChild title="Edit listing">
          <Link href={`/dashboard/listings/${listing.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        {listing.status === 'ACTIVE' && (
          <Button variant="ghost" size="icon" asChild title="View live listing">
            <Link href={`/machines/${listing.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDelete(listing.id)}
          title="Delete listing"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: listings = [], isLoading } = useMyListings()
  const deleteMutation = useDeleteListing()

  const activeCount = listings.filter((l) => l.status === 'ACTIVE').length

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this listing?')) return
    deleteMutation.mutate(id)
  }

  const stats = [
    { label: 'My Listings', value: listings.length.toString(), icon: Cog, color: 'text-brand-500 bg-brand-50', href: undefined },
    { label: 'Active Listings', value: activeCount.toString(), icon: Eye, color: 'text-green-500 bg-green-50', href: undefined },
    { label: 'Saved Machines', value: '→', icon: Heart, color: 'text-red-500 bg-red-50', href: '/dashboard/saved' },
    { label: 'Messages', value: '→', icon: MessageCircle, color: 'text-purple-500 bg-purple-50', href: '/dashboard/messages' },
  ]

  return (
    <PageWrapper contained>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Dashboard</h1>
          <p className="text-surface-500 mt-1">Manage your machine listings and activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild title="Account settings">
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/list-machine">
              <Plus className="h-4 w-4" />
              List Machine
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.href ? 'cursor-pointer hover:shadow-card-hover transition-shadow' : ''}>
            <CardContent className="p-5" {...(stat.href ? { onClick: () => {} } : {})}>
              {stat.href ? (
                <Link href={stat.href} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-surface-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </Link>
              ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Listings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-surface-400">
              <Cog className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No listings yet</p>
              <p className="text-sm mt-1">
                <Link href="/list-machine" className="text-brand-500 hover:underline">
                  List your first machine
                </Link>{' '}
                to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
