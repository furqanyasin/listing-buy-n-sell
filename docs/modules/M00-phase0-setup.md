# Module M00 — Phase 0: Environment Setup

**Status:** Complete
**Date:** 2026-03-17

## What Was Built

### Monorepo
- Turborepo with `apps/web`, `apps/api`, `packages/ui`, `packages/types`
- Root `package.json` with unified scripts (`dev`, `build`, `lint`, `test`)
- ESLint, Prettier, `.gitignore` configured at root level

### Frontend (`apps/web`)
- Next.js 15 with App Router
- TypeScript strict mode
- Tailwind CSS with custom design tokens (brand orange, surface grays)
- `globals.css` with CSS custom properties for theming
- `Providers` component (React Query, Zustand, Sonner, next-themes)
- `apiClient` (Axios instance with JWT interceptors + refresh token logic)
- Root layout with Inter font and SEO metadata

### Backend (`apps/api`)
- NestJS with TypeScript
- Global prefix `/api/v1`
- CORS configured for localhost:3000
- Global ValidationPipe (whitelist + transform)
- Swagger/OpenAPI docs at `/api/docs`
- Rate limiting (ThrottlerModule)
- Module stubs: auth, users, listings, search, media, dealers, blog, admin
- PrismaService (connects/disconnects cleanly)

### Database Schema (`prisma/schema.prisma`)
Complete Prisma schema with:
- `User`, `RefreshToken`
- `Make`, `VehicleModel`, `City` (reference data)
- `Listing`, `ListingImage`
- `Dealer`
- `Favorite`
- `Conversation`, `Message`
- `Review`
- `BlogPost`
- `Notification`

### Shared Types (`packages/types`)
- `common.types.ts` — PaginatedResponse, ApiResponse, City, Make, Model
- `auth.types.ts` — LoginRequest, RegisterRequest, AuthTokens, JwtPayload, UserRole
- `user.types.ts` — User, UserProfile, UpdateProfileRequest
- `listing.types.ts` — Listing, ListingCard, CreateListingRequest, ListingFilters, all enums
- `dealer.types.ts` — Dealer, DealerProfile

### Infrastructure
- `docker-compose.yml` — PostgreSQL 16, Redis 7, pgAdmin, Redis Commander
- `.env.example` — all environment variables documented
- `.github/workflows/ci.yml` — lint, typecheck, test-api, test-web, build jobs

## Key Decisions
1. **Turborepo** chosen for build caching and monorepo management
2. **NestJS** chosen for its modular architecture matching the platform's module structure
3. **Prisma** chosen over raw SQL for type-safety and migration management
4. **cuid()** for all primary keys (URL-safe, no collisions, sortable)
5. **Soft-delete pattern** will be applied to listings (status field vs `deletedAt`)
6. **`Decimal` type** for price to avoid floating point issues

## Next Step
**Phase 1 — Design System**: Build all reusable UI components before any feature pages.
