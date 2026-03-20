'use client'

import { X } from 'lucide-react'
import { useMakes, useModelsByMake, useCities } from '@/lib/hooks/use-reference'
import type { ListingFilters } from '@pw-clone/types'

// ─── Label maps ───────────────────────────────────────────────────────────────

const FUEL_LABELS: Record<string, string> = {
  ELECTRIC: 'Electric',
  HYDRAULIC: 'Hydraulic',
  PNEUMATIC: 'Pneumatic',
  DIESEL: 'Diesel',
  MANUAL: 'Manual',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  AUTOMATIC: 'CNC (Automated)',
  MANUAL: 'Manual',
}

const BODY_LABELS: Record<string, string> = {
  CNC_MILL: 'CNC Mill',
  CNC_LATHE: 'CNC Lathe',
  LASER_CUTTER: 'Laser Cutter',
  CNC_ROUTER: 'CNC Router',
  PRESS_BRAKE: 'Press Brake',
  WATERJET: 'Waterjet',
  PLASMA_CUTTER: 'Plasma Cutter',
  '3D_PRINTER': '3D Printer',
  BORING_MILL: 'Boring Mill',
  OTHER: 'Other',
}

function formatPrice(n: number) {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(1)} Cr`
  if (n >= 100_000) return `${(n / 100_000).toFixed(1)} L`
  return n.toLocaleString()
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-3 py-1 text-xs font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 hover:text-brand-900 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

// ─── Active Filters ───────────────────────────────────────────────────────────

interface ActiveFiltersProps {
  filters: ListingFilters
  onChange: (filters: ListingFilters) => void
}

export function ActiveFilters({ filters, onChange }: ActiveFiltersProps) {
  const { data: makes = [] } = useMakes()
  const { data: models = [] } = useModelsByMake(filters.makeId ?? null)
  const { data: cities = [] } = useCities()

  function remove(keys: (keyof ListingFilters)[]) {
    const updated = { ...filters }
    for (const k of keys) delete updated[k]
    onChange({ ...updated, page: 1 })
  }

  const chips: { label: string; keys: (keyof ListingFilters)[] }[] = []

  if (filters.q) {
    chips.push({ label: `"${filters.q}"`, keys: ['q'] })
  }
  if (filters.makeId) {
    const makeName = makes.find((m) => m.id === filters.makeId)?.name ?? filters.makeId
    // removing brand also clears model
    chips.push({ label: makeName, keys: ['makeId', 'modelId'] })
  }
  if (filters.modelId) {
    const modelName = models.find((m) => m.id === filters.modelId)?.name ?? filters.modelId
    chips.push({ label: modelName, keys: ['modelId'] })
  }
  if (filters.cityId) {
    const cityName = cities.find((c) => c.id === filters.cityId)?.name ?? filters.cityId
    chips.push({ label: cityName, keys: ['cityId'] })
  }
  if (filters.fuelType) {
    chips.push({ label: FUEL_LABELS[filters.fuelType] ?? filters.fuelType, keys: ['fuelType'] })
  }
  if (filters.transmission) {
    chips.push({ label: TRANSMISSION_LABELS[filters.transmission] ?? filters.transmission, keys: ['transmission'] })
  }
  if (filters.bodyType) {
    chips.push({ label: BODY_LABELS[filters.bodyType] ?? filters.bodyType, keys: ['bodyType'] })
  }
  if (filters.condition) {
    chips.push({ label: filters.condition === 'NEW' ? 'New' : 'Used', keys: ['condition'] })
  }
  if (filters.yearMin || filters.yearMax) {
    const label =
      filters.yearMin && filters.yearMax
        ? `${filters.yearMin}–${filters.yearMax}`
        : filters.yearMin
          ? `From ${filters.yearMin}`
          : `Up to ${filters.yearMax}`
    chips.push({ label: `Year: ${label}`, keys: ['yearMin', 'yearMax'] })
  }
  if (filters.priceMin || filters.priceMax) {
    const label =
      filters.priceMin && filters.priceMax
        ? `PKR ${formatPrice(filters.priceMin)}–${formatPrice(filters.priceMax)}`
        : filters.priceMin
          ? `PKR ${formatPrice(filters.priceMin)}+`
          : `Up to PKR ${formatPrice(filters.priceMax!)}`
    chips.push({ label, keys: ['priceMin', 'priceMax'] })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map((chip) => (
        <Chip key={chip.keys.join(',')} label={chip.label} onRemove={() => remove(chip.keys)} />
      ))}
      <button
        type="button"
        className="text-xs text-surface-400 hover:text-surface-600 underline transition-colors"
        onClick={() => onChange({ page: 1, limit: filters.limit })}
      >
        Clear all
      </button>
    </div>
  )
}
