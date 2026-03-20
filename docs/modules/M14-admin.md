# M14 — Admin Panel

## Overview

Phase 14 adds an admin control panel for listings moderation, user management, and analytics.

## API (all routes require ADMIN role)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/stats` | Dashboard stats (totalUsers, activeListings, pendingListings, totalDealers) |
| GET | `/admin/listings/pending` | All PENDING listings with seller info |
| PATCH | `/admin/listings/:id/approve` | Set status → ACTIVE |
| PATCH | `/admin/listings/:id/reject` | Set status → REJECTED with optional `{ reason }` |
| PATCH | `/admin/listings/:id/featured` | Toggle `isFeatured` |
| GET | `/admin/users` | Paginated user list (`?page=&limit=`) |
| PATCH | `/admin/users/:id/ban` | Toggle `isActive` |
| PATCH | `/admin/users/:id/role` | Change role `{ role: UserRole }` |

## Frontend

- `/dashboard/admin` — overview stats + quick links (Listings, Users, Blog)
- `/dashboard/admin/listings` — pending listings with inline approve/reject (with reason input)/feature buttons
- `/dashboard/admin/users` — paginated user table with ban toggle and role selector dropdown
- Admin routes check `user.role !== 'ADMIN'` on mount and redirect to `/dashboard`
- Admin Panel link appears in header UserMenu for ADMIN/EDITOR roles
