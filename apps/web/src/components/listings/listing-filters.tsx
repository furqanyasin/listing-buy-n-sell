'use client'

import { useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMakes, useModelsByMake, useCities } from '@/lib/hooks/use-reference'
import type { ListingFilters } from '@pw-clone/types'

const FUEL_OPTIONS = [
  { value: 'PETROL', label: 'Petrol' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'CNG', label: 'CNG' },
  { value: 'LPG', label: 'LPG' },
]

const TRANSMISSION_OPTIONS = [
  { value: 'AUTOMATIC', label: 'Automatic' },
  { value: 'MANUAL', label: 'Manual' },
]

const BODY_OPTIONS = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'HATCHBACK', label: 'Hatchback' },
  { value: 'PICKUP', label: 'Pickup' },
  { value: 'VAN', label: 'Van' },
  { value: 'TRUCK', label: 'Truck' },
  { value: 'COUPE', label: 'Coupe' },
  { value: 'WAGON', label: 'Wagon' },
]

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'mileage:asc', label: 'Lowest Mileage' },
  { value: 'year:desc', label: 'Year: Newest' },
]

interface ListingFiltersProps {
  filters: ListingFilters
  onChange: (filters: ListingFilters) => void
}

export function ListingFiltersPanel({ filters, onChange }: ListingFiltersProps) {
  const { data: makes } = useMakes()
  const { data: models } = useModelsByMake(filters.makeId ?? null)
  const { data: cities } = useCities()

  // Clear modelId if makeId changes
  useEffect(() => {
    if (!filters.makeId && filters.modelId) {
      onChange({ ...filters, modelId: undefined })
    }
  }, [filters, onChange])

  function set(key: keyof ListingFilters, value: string | number | undefined) {
    onChange({ ...filters, [key]: value || undefined, page: 1 })
  }

  function setSort(value: string) {
    const [sortBy, sortOrder] = value.split(':') as [ListingFilters['sortBy'], ListingFilters['sortOrder']]
    onChange({ ...filters, sortBy, sortOrder, page: 1 })
  }

  function clear() {
    onChange({ page: 1, limit: filters.limit })
  }

  const sortValue = filters.sortBy
    ? `${filters.sortBy}:${filters.sortOrder ?? 'desc'}`
    : 'createdAt:desc'

  const hasActiveFilters = !!(
    filters.q ||
    filters.makeId ||
    filters.modelId ||
    filters.cityId ||
    filters.fuelType ||
    filters.transmission ||
    filters.bodyType ||
    filters.condition ||
    filters.yearMin ||
    filters.yearMax ||
    filters.priceMin ||
    filters.priceMax
  )

  return (
    <div className="space-y-5">
      {/* Sort */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Sort By</Label>
        <Select value={sortValue} onValueChange={setSort}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Make */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Make</Label>
        <Select
          value={filters.makeId ?? ''}
          onValueChange={(v) => {
            onChange({ ...filters, makeId: v || undefined, modelId: undefined, page: 1 })
          }}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any make</SelectItem>
            {makes?.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Model</Label>
        <Select
          value={filters.modelId ?? ''}
          onValueChange={(v) => set('modelId', v)}
          disabled={!filters.makeId}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder={filters.makeId ? 'Any model' : 'Select make first'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any model</SelectItem>
            {models?.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">City</Label>
        <Select value={filters.cityId ?? ''} onValueChange={(v) => set('cityId', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any city</SelectItem>
            {cities?.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Year</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="From"
            className="h-9 text-sm"
            value={filters.yearMin ?? ''}
            onChange={(e) => set('yearMin', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="To"
            className="h-9 text-sm"
            value={filters.yearMax ?? ''}
            onChange={(e) => set('yearMax', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Price (PKR)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            className="h-9 text-sm"
            value={filters.priceMin ?? ''}
            onChange={(e) => set('priceMin', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder="Max"
            className="h-9 text-sm"
            value={filters.priceMax ?? ''}
            onChange={(e) => set('priceMax', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Fuel type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Fuel Type</Label>
        <Select value={filters.fuelType ?? ''} onValueChange={(v) => set('fuelType', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any fuel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any fuel</SelectItem>
            {FUEL_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Transmission</Label>
        <Select value={filters.transmission ?? ''} onValueChange={(v) => set('transmission', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            {TRANSMISSION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Body Type</Label>
        <Select value={filters.bodyType ?? ''} onValueChange={(v) => set('bodyType', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            {BODY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Condition</Label>
        <Select value={filters.condition ?? ''} onValueChange={(v) => set('condition', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="USED">Used</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" className="w-full text-surface-500" onClick={clear}>
          Clear all filters
        </Button>
      )}
    </div>
  )
}
