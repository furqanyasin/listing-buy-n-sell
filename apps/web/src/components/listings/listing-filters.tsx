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
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYDRAULIC', label: 'Hydraulic' },
  { value: 'PNEUMATIC', label: 'Pneumatic' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'MANUAL', label: 'Manual' },
]

const TRANSMISSION_OPTIONS = [
  { value: 'AUTOMATIC', label: 'CNC (Automated)' },
  { value: 'MANUAL', label: 'Manual' },
]

const BODY_OPTIONS = [
  { value: 'CNC_MILL', label: 'CNC Mill' },
  { value: 'CNC_LATHE', label: 'CNC Lathe' },
  { value: 'LASER_CUTTER', label: 'Laser Cutter' },
  { value: 'CNC_ROUTER', label: 'CNC Router' },
  { value: 'PRESS_BRAKE', label: 'Press Brake' },
  { value: 'WATERJET', label: 'Waterjet' },
  { value: 'PLASMA_CUTTER', label: 'Plasma Cutter' },
  { value: 'PRINTER_3D', label: '3D Printer' },
]

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'mileage:asc', label: 'Lowest Hours' },
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

      {/* Brand */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Brand</Label>
        <Select
          value={filters.makeId ?? ''}
          onValueChange={(v) => {
            onChange({ ...filters, makeId: v || undefined, modelId: undefined, page: 1 })
          }}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any brand</SelectItem>
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
            <SelectValue placeholder={filters.makeId ? 'Any model' : 'Select brand first'} />
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

      {/* Power Type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Power Type</Label>
        <Select value={filters.fuelType ?? ''} onValueChange={(v) => set('fuelType', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any power type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any power type</SelectItem>
            {FUEL_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Control Type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Control Type</Label>
        <Select value={filters.transmission ?? ''} onValueChange={(v) => set('transmission', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any control type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            {TRANSMISSION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Machine Type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Machine Type</Label>
        <Select value={filters.bodyType ?? ''} onValueChange={(v) => set('bodyType', v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Any machine type" />
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
