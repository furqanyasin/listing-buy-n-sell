'use client'

import { Suspense, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ListingCard } from '@/components/listings/listing-card'
import { ListingFiltersPanel } from '@/components/listings/listing-filters'
import { ActiveFilters } from '@/components/listings/active-filters'
import { useListings } from '@/lib/hooks/use-listings'
import { Pagination } from '@/components/ui/pagination'
import type { ListingFilters } from '@pw-clone/types'
import { cn } from '@/lib/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Derive a ListingFilters object from URL search params */
function filtersFromParams(sp: ReturnType<typeof useSearchParams>): ListingFilters {
  const f: ListingFilters = { page: 1, limit: 24 }
  const str = (k: string) => sp.get(k) || undefined
  const num = (k: string) => { const v = sp.get(k); return v ? Number(v) : undefined }

  f.q = str('q')
  f.makeId = str('makeId')
  f.modelId = str('modelId')
  f.cityId = str('cityId')
  f.fuelType = str('fuelType') as ListingFilters['fuelType']
  f.transmission = str('transmission') as ListingFilters['transmission']
  f.bodyType = str('bodyType') as ListingFilters['bodyType']
  f.condition = str('condition') as ListingFilters['condition']
  f.sortBy = str('sortBy') as ListingFilters['sortBy']
  f.sortOrder = str('sortOrder') as ListingFilters['sortOrder']
  f.yearMin = num('yearMin')
  f.yearMax = num('yearMax')
  f.priceMin = num('priceMin')
  f.priceMax = num('priceMax')
  f.mileageMax = num('mileageMax')
  f.page = num('page') ?? 1
  return f
}

/** Build a URL query string from a ListingFilters object */
function filtersToParams(f: ListingFilters): string {
  const p = new URLSearchParams()
  const set = (k: string, v: string | number | undefined) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, String(v))
  }
  set('q', f.q)
  set('makeId', f.makeId)
  set('modelId', f.modelId)
  set('cityId', f.cityId)
  set('fuelType', f.fuelType)
  set('transmission', f.transmission)
  set('bodyType', f.bodyType)
  set('condition', f.condition)
  set('sortBy', f.sortBy)
  set('sortOrder', f.sortOrder)
  set('yearMin', f.yearMin)
  set('yearMax', f.yearMax)
  set('priceMin', f.priceMin)
  set('priceMax', f.priceMax)
  set('mileageMax', f.mileageMax)
  if (f.page && f.page > 1) set('page', f.page)
  return p.toString()
}

// ─── Inner component (uses useSearchParams — must be inside Suspense) ─────────

function CarsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Derive filters directly from URL — URL is the single source of truth
  const filters = filtersFromParams(searchParams)

  // Search input is a controlled field; only committed on submit
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '')
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useListings(filters)

  /** Push a new filter state to the URL */
  const pushFilters = useCallback(
    (newFilters: ListingFilters) => {
      const qs = filtersToParams(newFilters)
      router.replace(qs ? `/machines?${qs}` : '/machines', { scroll: false })
    },
    [router],
  )

  function handleFiltersChange(newFilters: ListingFilters) {
    pushFilters(newFilters)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    pushFilters({ ...filters, q: searchInput || undefined, page: 1 })
  }

  function clearSearch() {
    setSearchInput('')
    pushFilters({ ...filters, q: undefined, page: 1 })
  }

  const listings = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="max-w-screen-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Industrial Machines & Equipment</h1>
        {meta && (
          <p className="text-sm text-surface-500 mt-1">
            {meta.total.toLocaleString()} listing{meta.total !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
          <Input
            className="pl-9"
            placeholder="Search by brand, model, or keyword..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit">Search</Button>
        <Button
          type="button"
          variant="outline"
          className="lg:hidden gap-2"
          onClick={() => setShowFilters((s) => !s)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </form>

      {/* Active filter chips */}
      <ActiveFilters filters={filters} onChange={handleFiltersChange} />

      <div className="flex gap-6">
        {/* Filters sidebar */}
        <aside
          className={cn(
            'w-64 shrink-0',
            'hidden lg:block',
            showFilters &&
              '!block fixed inset-0 z-40 bg-white p-6 overflow-y-auto lg:static lg:p-0 lg:z-auto',
          )}
        >
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          <ListingFiltersPanel filters={filters} onChange={handleFiltersChange} />
        </aside>

        {/* Mobile overlay */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Listings grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 text-surface-500">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No listings found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={(page) => pushFilters({ ...filters, page })}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Page export — wraps inner component in Suspense ─────────────────────────

export default function CarsPage() {
  return (
    <PageWrapper>
      <Suspense
        fallback={
          <div className="max-w-screen-2xl mx-auto">
            <div className="mb-6">
              <div className="h-8 w-64 bg-surface-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <CarsContent />
      </Suspense>
    </PageWrapper>
  )
}
