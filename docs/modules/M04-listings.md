# M04 — Vehicle Listings System

**Status:** ✅ Complete
**Completed:** 2026-03-17

## Overview

Full listings CRUD with filtering, pagination, status management. Frontend: `/cars` listings page, `/cars/[id]` detail page, `ListingCard`, filter sidebar, and homepage real-data sections.

## Backend

### DTOs (`apps/api/src/modules/listings/dto/`)

| File | Purpose |
|------|---------|
| `create-listing.dto.ts` | All listing fields with class-validator decorators. Year clamped to 1970–(current+1). |
| `update-listing.dto.ts` | `PartialType(CreateListingDto)` — all fields optional |
| `listing-filters.dto.ts` | Query params for public listing search. `@Type(() => Number)` ensures string→number transform from query strings. |
| `update-status.dto.ts` | Admin status change + optional `rejectedReason` |

### Service (`listings.service.ts`)

| Method | Description |
|--------|-------------|
| `create(userId, dto)` | Creates listing with `PENDING` status |
| `findAll(filters)` | `ACTIVE` listings only, full filter/sort/pagination via `$transaction([count, findMany])` |
| `findFeatured(limit?)` | `ACTIVE + isFeatured=true`, latest first |
| `findOne(id)` | Single `ACTIVE` listing, increments `viewsCount` fire-and-forget |
| `findMine(userId)` | Owner's listings, all statuses |
| `update(id, userId, dto)` | Throws `ForbiddenException` if not owner |
| `remove(id, userId, isAdmin)` | Owner or admin can delete |
| `updateStatus(id, status, reason?)` | Admin/editor only |
| `findAllAdmin(filters)` | All statuses, for admin moderation panel |

Two Prisma select shapes are defined:
- `LIST_SELECT` — lightweight, includes primary image only (for grids)
- `DETAIL_SELECT` — full, all images + seller fields (for detail page)

### Controller routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/listings` | Public | Paginated + filtered active listings |
| GET | `/listings/featured` | Public | Featured listings (homepage) |
| GET | `/listings/:id` | Public | Single listing detail |
| POST | `/listings` | JWT | Create listing |
| GET | `/listings/user/mine` | JWT | Owner's own listings |
| PATCH | `/listings/:id` | JWT | Update (owner only) |
| DELETE | `/listings/:id` | JWT | Delete (owner or admin) |
| PATCH | `/listings/:id/status` | ADMIN/EDITOR | Status change |
| GET | `/listings/admin/all` | ADMIN/EDITOR | All listings any status |

## Frontend

### API & Hooks

**`lib/api/listings.ts`** — axios calls for all endpoints
**`lib/hooks/use-listings.ts`** — TanStack Query hooks:
- `useListings(filters)` — listings grid
- `useFeaturedListings()` — homepage, 5 min staleTime
- `useListing(id)` — detail page
- `useMyListings()` — dashboard
- `useDeleteListing()` — mutation with cache invalidation

### Components (`apps/web/src/components/listings/`)

**`listing-card.tsx`**
- Price formatted as PKR Lakh/Crore (e.g. "PKR 32.0 Lakh")
- Primary image with fallback SVG car icon
- Featured + New badges
- Specs row: mileage, fuel, transmission, year
- Hover scale effect on image

**`listing-filters.tsx`**
- `ListingFiltersPanel` — full filter sidebar
- Cascading Make → Model selects (model disabled until make selected)
- Clear-all button appears only when filters are active
- onChange fires immediately for selects, form submit for range inputs

**`featured-section.tsx`** — homepage featured grid, self-hides when empty
**`makes-section.tsx`** — homepage Browse by Brand, first 12 makes, logo support

### Pages

**`/cars` (`app/cars/page.tsx`)**
- Client component with local filter state
- Search bar with clear button
- Mobile: filter drawer (z-40 overlay)
- Desktop: fixed sidebar
- Grid of `ListingCard`s with `Pagination`

**`/cars/[id]` (`app/cars/[id]/page.tsx`)**
- Image gallery with prev/next buttons, thumbnail strip, image counter
- Spec grid using `SpecItem` component
- Sticky seller card with phone CTA
- Graceful error state if listing not found / sold

## Listing Status Flow

```
create → PENDING
admin PATCH /:id/status → ACTIVE | REJECTED
owner marks → SOLD
system marks → EXPIRED
```

Only `ACTIVE` listings are visible on public endpoints.
