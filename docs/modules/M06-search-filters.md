# Module 06 — Search & Advanced Filtering

## Status: ✅ COMPLETE (Phase 6)

---

## Backend

### Improved Full-Text Search (`listings.service.ts`)

The `q` search parameter now matches against 5 fields:
```typescript
OR: [
  { title: { contains: q, mode: 'insensitive' } },
  { description: { contains: q, mode: 'insensitive' } },
  { make: { name: { contains: q, mode: 'insensitive' } } },
  { model: { name: { contains: q, mode: 'insensitive' } } },
  { city: { name: { contains: q, mode: 'insensitive' } } },
]
```
Searching "Toyota Karachi" or "Lahore Honda" now works correctly.

---

## Frontend

### URL-Synced Filters (`apps/web/src/app/cars/page.tsx`)

**Architecture:**
- URL `searchParams` is the single source of truth for all filter state
- `filtersFromParams(searchParams)` — converts URL params to `ListingFilters` object
- `filtersToParams(filters)` — converts `ListingFilters` back to URL query string
- `pushFilters(newFilters)` — calls `router.replace` to update URL (triggers re-render with new filters)

**Supported URL params:**
`q`, `makeId`, `modelId`, `cityId`, `fuelType`, `transmission`, `bodyType`, `condition`, `sortBy`, `sortOrder`, `yearMin`, `yearMax`, `priceMin`, `priceMax`, `mileageMax`, `page`

**Shareable URLs examples:**
- `/cars?makeId=xxx&cityId=yyy&priceMax=5000000` — Toyota only in Karachi under 50 Lakh
- `/cars?q=corolla&sortBy=price&sortOrder=asc` — Search sorted by price

### Active Filter Chips (`apps/web/src/components/listings/active-filters.tsx`)

- Shows one chip per active filter (make, model, city, fuel, transmission, body, condition, year range, price range, search query)
- Human-readable labels: resolves IDs to names using cached `useMakes()` / `useCities()` hooks
- Each chip has an X button to remove that specific filter
- Removing `makeId` also clears `modelId` (cascading)
- "Clear all" text button resets to default (page 1 only)
- Hides entirely when no filters are active (returns `null`)
- Displayed between the search bar and the listings grid
