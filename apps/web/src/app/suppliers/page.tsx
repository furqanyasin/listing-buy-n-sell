'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, CheckCircle, Cog, Plus } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useDealers } from '@/lib/hooks/use-dealers'
import type { Dealer } from '@pw-clone/types'

function DealerCard({ dealer }: { dealer: Dealer }) {
  return (
    <Link
      href={`/suppliers/${dealer.slug}`}
      className="block rounded-xl border border-surface-200 bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
    >
      {/* Cover / banner */}
      <div className="relative h-24 bg-gradient-to-br from-brand-500 to-brand-700">
        {dealer.coverUrl && (
          <Image src={dealer.coverUrl} alt="" fill className="object-cover" sizes="400px" />
        )}
        {/* Logo */}
        <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-xl border-2 border-white bg-white shadow-sm overflow-hidden">
          {dealer.logoUrl ? (
            <Image src={dealer.logoUrl} alt={dealer.name} fill className="object-cover" sizes="56px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-700 font-bold text-lg">
              {dealer.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="pt-8 p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-surface-900 text-sm">{dealer.name}</h3>
              {dealer.isVerified && (
                <CheckCircle className="h-4 w-4 text-brand-500 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-surface-500 mt-0.5">
              <MapPin className="h-3 w-3" />
              {dealer.city.name}
            </div>
          </div>
          {dealer.isFeatured && (
            <Badge className="text-[10px] shrink-0">Featured</Badge>
          )}
        </div>

        {dealer.description && (
          <p className="text-xs text-surface-500 line-clamp-2">{dealer.description}</p>
        )}

        <div className="flex items-center gap-1 text-xs text-surface-400 pt-1">
          <Cog className="h-3 w-3" />
          <span>{dealer.listingsCount} active listing{dealer.listingsCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </Link>
  )
}

export default function DealersPage() {
  const { data: dealers = [], isLoading } = useDealers()

  return (
    <PageWrapper contained>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Machine Suppliers</h1>
          <p className="text-surface-500 mt-1">Browse verified suppliers across Pakistan.</p>
        </div>
        <Button asChild>
          <Link href="/suppliers/register">
            <Plus className="h-4 w-4" />
            Become a Supplier
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : dealers.length === 0 ? (
        <div className="text-center py-20 text-surface-400">
          <Cog className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No suppliers yet</p>
          <p className="text-sm mt-1">
            <Link href="/suppliers/register" className="text-brand-500 hover:underline">
              Register as a supplier
            </Link>{' '}
            to get listed here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dealers.map((dealer) => (
            <DealerCard key={dealer.id} dealer={dealer} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
