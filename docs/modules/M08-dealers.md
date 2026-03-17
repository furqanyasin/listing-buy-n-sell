# M08 — Dealer Profiles

## Overview

Dealers are registered users with a `Dealer` profile record. Registering as a dealer upgrades the user's role to `DEALER` and creates a public-facing profile with a unique slug, contact info, and an active inventory derived from the user's listings.

## Key Design Decisions

- **Listings belong to `User`, not `Dealer`**: The Prisma schema has no `Dealer.listings` relation. Active listing count is fetched via `user._count.listings` and exposed as `listingsCount` via a `transform()` helper.
- **`findBySlug` uses two queries**: First fetch the dealer (with `userId`), then `prisma.listing.findMany({ where: { userId } })`. This avoids a non-existent relation.
- **Slug uniqueness**: `slugify(name)` → if taken, append `-1`, `-2`, etc. in a loop.
- **Role upgrade in transaction**: `dealer.create` + `user.update({ role: DEALER })` run inside `$transaction([])`.

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dealers` | Public | List all dealers, sorted featured→verified→newest |
| GET | `/dealers/:slug` | Public | Dealer profile + active inventory (up to 12) |
| POST | `/dealers` | JWT | Register as dealer |
| GET | `/dealers/me/profile` | JWT | Own dealer profile |
| PATCH | `/dealers/:id` | JWT (owner) | Update own profile |
| PATCH | `/dealers/:id/verify` | ADMIN | Set `isVerified = true` |

## Types (`@pw-clone/types`)

```typescript
interface Dealer {
  id, name, slug, logoUrl, coverUrl, address, phone, whatsapp, website,
  description, isVerified, isFeatured, city: City, listingsCount, createdAt
}

interface DealerProfile extends Dealer {
  listings: ListingCard[]
}

interface CreateDealerRequest {
  name, cityId, phone, address?, whatsapp?, website?, description?
}
```

## Frontend Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/dealers` | `DealersPage` | Grid of `DealerCard` components |
| `/dealers/[slug]` | `DealerProfilePage` | Full profile with inventory |
| `/dealers/register` | `DealerRegisterPage` | Registration form |

## WhatsApp Number Formatting

Pakistani numbers are normalized to international format before constructing `wa.me` links:
- `03XX-XXXXXXX` (11 digits starting with `0`) → `923XXXXXXXXX`
- Already `92XXXXXXXXXX` → used as-is
- Fallback: prepend `92`
