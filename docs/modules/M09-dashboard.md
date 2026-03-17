# M09 — User Dashboard

## Overview

The dashboard gives authenticated users a central hub to manage their car listings and account settings. Phase 9 adds real stats, per-listing edit, and a full account settings + password-change flow.

## Features

### Dashboard (`/dashboard`)
- **Stats cards**: My Ads, Active Ads, Saved Cars (placeholder), Total Views (sum of `viewsCount` from all user listings)
- **Listing rows**: thumbnail, title, make/model/year/city, price, status badge, actions (Edit / View Live / Delete)
- **Settings shortcut**: gear icon → `/dashboard/settings`

### Edit Listing (`/dashboard/listings/:id/edit`)
- Uses `GET /listings/user/mine/:id` — fetches any-status listing (PENDING/REJECTED/ACTIVE) for prefilling
- Single-page form (no stepper) with all vehicle + pricing fields prefilled via `reset()`
- `useUpdateListing(id)` mutation — on success navigates back to dashboard

### Settings (`/dashboard/settings`)
- **Avatar upload**: click camera button → `POST /media/upload` → `PATCH /users/me`
- **Profile form**: name, phone (email read-only), updates auth store so header reflects changes immediately
- **Change password**: current password → new password → confirm, with Zod `.refine()` cross-field validation

## API Routes Added

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/listings/user/mine/:id` | JWT (owner) | Single listing detail for edit form (any status) |
| PATCH | `/auth/change-password` | JWT | Change password (verifies current password) |

## Key Implementation Notes

- `viewsCount` added to `LIST_SELECT` in `listings.service.ts` so `findMine` returns it
- `findMineById` selects with `DETAIL_SELECT` (+ `userId` for ownership check, stripped before return)
- `changePassword` in `AuthService` uses `bcrypt.compare` then `usersService.updatePassword`
- Auth store synced after profile update via `useAuthStore.getState().setAuth(user, token)`
