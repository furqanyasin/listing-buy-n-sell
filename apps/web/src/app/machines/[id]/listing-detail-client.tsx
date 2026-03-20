'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Gauge,
  Fuel,
  Zap,
  Calendar,
  Palette,
  Cog,
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Share2,
  MessageCircle,
  Heart,
  X,
  Maximize2,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ListingCard } from '@/components/listings/listing-card'
import { useListing, useRelatedListings } from '@/lib/hooks/use-listings'
import { useFavoriteIds, useToggleFavorite } from '@/lib/hooks/use-favorites'
import { useCreateConversation } from '@/lib/hooks/use-conversations'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'
import type { ListingImage } from '@pw-clone/types'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  if (price >= 10_000_000) return `PKR ${(price / 10_000_000).toFixed(2)} Crore`
  if (price >= 100_000) return `PKR ${(price / 100_000).toFixed(1)} Lakh`
  return `PKR ${price.toLocaleString('en-PK')}`
}

function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '92' + digits.slice(1)
  if (digits.startsWith('92') && digits.length === 12) return digits
  return '92' + digits
}

// ─── SpecItem ─────────────────────────────────────────────────────────────────

function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
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

// ─── Image Lightbox ───────────────────────────────────────────────────────────

function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: ListingImage[]
  initialIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(initialIndex)

  const prev = useCallback(
    () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length],
  )
  const next = useCallback(
    () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Image container */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] px-14 py-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-[16/10]">
          <Image
            src={images[current].url}
            alt={`Image ${current + 1} of ${images.length}`}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </div>

        {/* Counter */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 mt-3">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ListingDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const { data: listing, isLoading, isError } = useListing(id)
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const userId = useAuthStore((s) => s.user?.id)
  const { data: favoriteIds } = useFavoriteIds()
  const toggleFavorite = useToggleFavorite()
  const createConversation = useCreateConversation()
  const isFavorited = favoriteIds?.includes(id) ?? false
  const isOwnListing = listing?.seller?.id === userId

  async function handleChat() {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/machines/${id}`)
      return
    }
    createConversation.mutate(id, {
      onSuccess: (conv) => router.push(`/dashboard/messages/${conv.id}`),
    })
  }

  const images = listing?.images ?? []

  const { data: related = [] } = useRelatedListings(
    listing?.make.id ?? '',
    listing?.model.id ?? '',
    id,
  )

  function openLightbox(idx: number) {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: listing?.title, url })
      } catch {
        // user cancelled — no toast needed
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

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
          <Cog className="h-12 w-12 mx-auto mb-4 text-surface-300" />
          <h1 className="text-xl font-semibold text-surface-700">Listing not found</h1>
          <p className="text-surface-500 mt-2 mb-6">This listing may have been removed or sold.</p>
          <Button asChild>
            <Link href="/machines">Browse all machines</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  const hasImages = images.length > 0
  const powerLabel = listing.fuelType.charAt(0) + listing.fuelType.slice(1).toLowerCase()
  const typeLabel = listing.bodyType.charAt(0) + listing.bodyType.slice(1).toLowerCase()
  const controlLabel = listing.transmission === 'AUTOMATIC' ? 'CNC (Automated)' : 'Manual'

  const whatsAppUrl = listing.seller?.phone
    ? `https://wa.me/${toWhatsAppNumber(listing.seller.phone)}?text=${encodeURIComponent(
        `Hi, I'm interested in your listing: ${listing.title}\n${window.location.href}`,
      )}`
    : null

  return (
    <PageWrapper>
      {/* Lightbox */}
      {lightboxOpen && hasImages && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-surface-500 mb-4 flex items-center gap-1.5">
          <Link href="/machines" className="hover:text-brand-600">
            Machines
          </Link>
          <span>/</span>
          <span className="text-surface-800 font-medium line-clamp-1">
            {listing.make.name} {listing.model.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Images + Details ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Image gallery */}
            <div className="rounded-2xl overflow-hidden bg-surface-100">
              <div className="relative aspect-[16/10] bg-surface-100 group">
                {hasImages ? (
                  <>
                    <Image
                      src={images[activeImage].url}
                      alt={`${listing.title} — image ${activeImage + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover cursor-zoom-in"
                      priority
                      onClick={() => openLightbox(activeImage)}
                    />

                    {/* Expand hint */}
                    <button
                      onClick={() => openLightbox(activeImage)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Open fullscreen"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActiveImage((i) => (i === 0 ? images.length - 1 : i - 1))
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            setActiveImage((i) => (i === images.length - 1 ? 0 : i + 1))
                          }
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
                    <Cog className="h-20 w-20 text-surface-300" />
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
                        idx === activeImage ? 'border-brand-500' : 'border-transparent hover:border-surface-300'
                      }`}
                    >
                      <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + price + actions */}
            <div>
              <div className="flex items-start gap-3 flex-wrap mb-1">
                {listing.isFeatured && <Badge>Featured</Badge>}
                {listing.condition === 'NEW' && <Badge variant="success">New</Badge>}
              </div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-bold text-surface-900">{listing.title}</h1>
                <button
                  onClick={handleShare}
                  className="shrink-0 w-9 h-9 rounded-full border border-surface-200 flex items-center justify-center text-surface-500 hover:text-brand-600 hover:border-brand-300 transition-colors"
                  aria-label="Share listing"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
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
              <h2 className="font-semibold text-surface-800 mb-3">Machine Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <SpecItem
                  icon={Cog}
                  label="Brand / Model"
                  value={`${listing.make.name} ${listing.model.name}`}
                />
                <SpecItem icon={Calendar} label="Year" value={String(listing.year)} />
                <SpecItem
                  icon={Gauge}
                  label="Running Hours"
                  value={`${listing.mileage.toLocaleString()} hrs`}
                />
                <SpecItem icon={Fuel} label="Power Type" value={powerLabel} />
                <SpecItem icon={Zap} label="Control Type" value={controlLabel} />
                <SpecItem icon={Cog} label="Machine Type" value={typeLabel} />
                <SpecItem icon={Palette} label="Color" value={listing.color} />
                <SpecItem
                  icon={Cog}
                  label="Condition"
                  value={listing.condition === 'NEW' ? 'New' : 'Used'}
                />
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

          {/* ── Right: Seller card ─────────────────────────────────────────── */}
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

              {/* Phone CTA */}
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

              {/* WhatsApp CTA */}
              {whatsAppUrl && (
                <Button variant="secondary" className="w-full gap-2" asChild>
                  <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              )}

              {/* Chat in-app */}
              {!isOwnListing && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleChat}
                  isLoading={createConversation.isPending}
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat with Seller
                </Button>
              )}

              {/* Save */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className={cn('w-full gap-2', isFavorited && 'text-red-500 hover:text-red-600')}
                  onClick={() => toggleFavorite.mutate(id)}
                >
                  <Heart className={cn('h-4 w-4', isFavorited && 'fill-current')} />
                  {isFavorited ? 'Saved' : 'Save Machine'}
                </Button>
              )}

              <Separator />

              <div className="text-xs text-surface-400 space-y-1">
                <p>
                  Posted{' '}
                  {new Date(listing.createdAt).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                {listing.expiresAt && (
                  <p>
                    Expires{' '}
                    {new Date(listing.expiresAt).toLocaleDateString('en-PK', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Listings ─────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-surface-900 mb-4">
              Similar {listing.make.name} {listing.model.name} Listings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {related.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
