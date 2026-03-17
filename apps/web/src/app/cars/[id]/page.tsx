'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  Gauge,
  Fuel,
  Zap,
  Calendar,
  Palette,
  Car,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useListing } from '@/lib/hooks/use-listings'

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `PKR ${(price / 10_000_000).toFixed(2)} Crore`
  if (price >= 100_000) return `PKR ${(price / 100_000).toFixed(1)} Lakh`
  return `PKR ${price.toLocaleString('en-PK')}`
}

function SpecItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-50">
      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-brand-600" />
      </div>
      <div>
        <p className="text-xs text-surface-500">{label}</p>
        <p className="text-sm font-semibold text-surface-800">{value}</p>
      </div>
    </div>
  )
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: listing, isLoading, isError } = useListing(id)
  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </PageWrapper>
    )
  }

  if (isError || !listing) {
    return (
      <PageWrapper>
        <div className="max-w-5xl mx-auto text-center py-20">
          <Car className="h-12 w-12 mx-auto mb-4 text-surface-300" />
          <h1 className="text-xl font-semibold text-surface-700">Listing not found</h1>
          <p className="text-surface-500 mt-2 mb-6">This listing may have been removed or sold.</p>
          <Button asChild>
            <Link href="/cars">Browse all cars</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  const images = listing.images ?? []
  const hasImages = images.length > 0

  function prevImage() {
    setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))
  }

  function nextImage() {
    setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))
  }

  const fuelLabel = listing.fuelType.charAt(0) + listing.fuelType.slice(1).toLowerCase()
  const bodyLabel = listing.bodyType.charAt(0) + listing.bodyType.slice(1).toLowerCase()
  const transmLabel = listing.transmission === 'AUTOMATIC' ? 'Automatic' : 'Manual'

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-surface-500 mb-4 flex items-center gap-1.5">
          <Link href="/cars" className="hover:text-brand-600">Cars</Link>
          <span>/</span>
          <span className="text-surface-800 font-medium line-clamp-1">
            {listing.make.name} {listing.model.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image gallery */}
            <div className="rounded-2xl overflow-hidden bg-surface-100">
              <div className="relative aspect-[16/10] bg-surface-100">
                {hasImages ? (
                  <>
                    <Image
                      src={images[activeImage].url}
                      alt={`${listing.title} - image ${activeImage + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover"
                      priority
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                          aria-label="Next image"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          {activeImage + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Car className="h-20 w-20 text-surface-300" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === activeImage ? 'border-brand-500' : 'border-transparent'
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + price */}
            <div>
              <div className="flex items-start gap-3 flex-wrap mb-1">
                {listing.isFeatured && <Badge>Featured</Badge>}
                {listing.condition === 'NEW' && <Badge variant="success">New</Badge>}
              </div>
              <h1 className="text-2xl font-bold text-surface-900 mt-1">{listing.title}</h1>
              <p className="text-2xl font-extrabold text-brand-600 mt-2">
                {formatPrice(Number(listing.price))}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-surface-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {listing.city.name}
                  {listing.locationText && ` · ${listing.locationText}`}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {listing.viewsCount?.toLocaleString()} views
                </span>
              </div>
            </div>

            <Separator />

            {/* Specs grid */}
            <div>
              <h2 className="font-semibold text-surface-800 mb-3">Vehicle Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <SpecItem icon={Car} label="Make / Model" value={`${listing.make.name} ${listing.model.name}`} />
                <SpecItem icon={Calendar} label="Year" value={String(listing.year)} />
                <SpecItem icon={Gauge} label="Mileage" value={`${listing.mileage.toLocaleString()} km`} />
                <SpecItem icon={Fuel} label="Fuel Type" value={fuelLabel} />
                <SpecItem icon={Zap} label="Transmission" value={transmLabel} />
                <SpecItem icon={Car} label="Body Type" value={bodyLabel} />
                <SpecItem icon={Palette} label="Color" value={listing.color} />
                <SpecItem icon={Car} label="Condition" value={listing.condition === 'NEW' ? 'New' : 'Used'} />
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-semibold text-surface-800 mb-3">Description</h2>
              <p className="text-surface-600 leading-relaxed whitespace-pre-line text-sm">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right: Seller card */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-surface-200 bg-white p-5 space-y-4 shadow-card sticky top-6">
              <h2 className="font-semibold text-surface-800">Contact Seller</h2>

              {listing.seller && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                    {listing.seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-surface-800 text-sm">{listing.seller.name}</p>
                    <p className="text-xs text-surface-500">
                      Member since {new Date(listing.seller.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>
              )}

              {listing.seller?.phone ? (
                <Button className="w-full gap-2" asChild>
                  <a href={`tel:${listing.seller.phone}`}>
                    <Phone className="h-4 w-4" />
                    {listing.seller.phone}
                  </a>
                </Button>
              ) : (
                <Button className="w-full gap-2" disabled>
                  <Phone className="h-4 w-4" />
                  Phone not listed
                </Button>
              )}

              <Separator />

              <div className="text-xs text-surface-400 space-y-1">
                <p>Posted {new Date(listing.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {listing.expiresAt && (
                  <p>Expires {new Date(listing.expiresAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
