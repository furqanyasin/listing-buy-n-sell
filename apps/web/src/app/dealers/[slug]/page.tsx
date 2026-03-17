'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Globe, CheckCircle, Car, MessageCircle } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ListingCard } from '@/components/listings/listing-card'
import { useDealer } from '@/lib/hooks/use-dealers'

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
          <Car className="h-12 w-12 mx-auto mb-4 text-surface-300" />
          <h1 className="text-xl font-semibold text-surface-700">Dealer not found</h1>
          <p className="text-surface-500 mt-2 mb-6">This dealer may no longer be active.</p>
          <Button asChild>
            <Link href="/dealers">View all dealers</Link>
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
          <Link href="/dealers" className="hover:text-brand-600">Dealers</Link>
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
                  <Car className="h-10 w-10 mx-auto mb-2 opacity-30" />
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
          </div>

          {/* Right: Contact card */}
          <div>
            <div className="rounded-2xl border border-surface-200 bg-white p-5 space-y-4 shadow-card sticky top-6">
              <h2 className="font-semibold text-surface-800">Contact Dealer</h2>

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
