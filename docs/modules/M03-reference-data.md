# M03 — Reference Data & Seed

**Status:** ✅ Complete
**Completed:** 2026-03-17

## Overview

Seeds all static reference data required by the listings system and exposes public API endpoints consumed by the frontend.

## What Was Built

### Prisma Seed (`apps/api/prisma/seed.ts`)

Run with: `cd apps/api && npm run db:seed`

| Data | Count |
|------|-------|
| Makes | 18 (Toyota, Honda, Suzuki, KIA, Hyundai, Nissan, Mitsubishi, Daihatsu, Mercedes-Benz, BMW, Audi, Changan, Proton, MG, Haval, DFSK, FAW, United) |
| Models | ~100+ (top models per make) |
| Cities | 30 (major cities across all provinces + coordinates) |
| Admin user | admin@pw-clone.com / Admin@123456 |

Seed uses `upsert` — safe to re-run without duplicates.

### API Module (`apps/api/src/modules/reference/`)

All endpoints are `@Public()` — no auth required.

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/v1/reference/makes` | All active makes ordered by `order` ASC |
| GET | `/api/v1/reference/makes/:makeId/models` | Active models for a make, ordered by name |
| GET | `/api/v1/reference/cities` | All active cities ordered by name |

### Frontend (`apps/web/src/`)

**`lib/api/reference.ts`** — typed API functions
**`lib/hooks/use-reference.ts`** — TanStack Query hooks (staleTime: 1 hour)

```ts
useMakes()                    // all makes
useModelsByMake(makeId | null) // disabled when makeId is null — cascading dropdown pattern
useCities()                   // all cities
```

## Usage Pattern

Cascading make → model dropdown (used in listing form and filters):
```tsx
const { data: makes } = useMakes()
const { data: models } = useModelsByMake(selectedMakeId) // auto-disables when null
```
