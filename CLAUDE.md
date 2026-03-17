# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PakWheels clone — a Pakistani automotive classified platform. Turborepo monorepo with:
- `apps/api` — NestJS 10 backend (port 4000)
- `apps/web` — Next.js 15 frontend (port 3000)
- `packages/ui` — Shared Radix/Tailwind component library
- `packages/types` — Shared TypeScript types

## Commands

### Root (run from `D:/pw-clone`)
```bash
npm run dev          # Start all apps via Turborepo
npm run build        # Build all apps
npm run lint         # Lint all packages
npm run test         # Test all packages
npm run format       # Prettier format everything
```

### API (`apps/api`)
```bash
npm run dev          # NestJS watch mode
npm run test         # Jest unit tests
npm run test:watch   # Jest in watch mode
npm run test:cov     # Jest with coverage
npm run test:e2e     # E2E tests (requires DB + Redis running)
npm run db:generate  # Generate Prisma client after schema changes
npm run db:migrate   # Create and run a migration (dev)
npm run db:seed      # Seed reference data
npm run db:studio    # Open Prisma Studio GUI
```

### Web (`apps/web`)
```bash
npm run dev          # Next.js dev server
npm run test         # Vitest unit tests
npm run test:ui      # Vitest with browser UI
```

## Local Development Setup

```bash
cp .env.example .env
docker-compose up -d                        # Starts Postgres (5433), Redis (6379), pgAdmin (5050), Redis Commander (8081)
cd apps/api && npm run db:migrate           # Run initial migrations
npm run dev                                 # Start both servers
```

Service URLs:
- API: `http://localhost:4000/api/v1`
- Swagger: `http://localhost:4000/api/docs`
- Web: `http://localhost:3000`
- pgAdmin: `http://localhost:5050` (admin@pw-clone.com / admin123)
- Redis Commander: `http://localhost:8081`

**Note:** PostgreSQL is on host port **5433** (not 5432) — `DATABASE_URL` must use `localhost:5433`.

## Architecture

### API (NestJS)
- Global prefix `/api/v1`, versioning via prefix
- Module structure: `src/modules/{auth,users,listings,reference,dealers,blog,search,admin,media}/`
- Common infrastructure: `src/common/{decorators,filters,guards,interceptors,pipes}/`
- Prisma service is singleton in `src/prisma/`
- Auth: Passport.js with `local` strategy (login) and `jwt` strategy (protected routes). Access tokens expire in 15m, refresh tokens in 7d
- Swagger auto-generated at `/api/docs` (development only)
- Rate limiting via `@nestjs/throttler`, caching via `@nestjs/cache-manager` + Redis

**Implemented API routes (as of Phase 8):**
- `GET /auth/*` — register, login, refresh, logout, forgot-password, reset-password
- `GET|PATCH /users/me` — profile
- `GET /reference/makes` · `GET /reference/makes/:id/models` · `GET /reference/cities` — public, no auth
- `GET /listings` · `GET /listings/featured` · `GET /listings/:id` — public
- `POST /listings` · `GET /listings/user/mine` · `PATCH /listings/:id` · `DELETE /listings/:id` — JWT required
- `POST /listings/:id/images` — JWT required, owner only; attaches ListingImage records
- `PATCH /listings/:id/status` · `GET /listings/admin/all` — ADMIN/EDITOR role required
- `POST /media/upload` — JWT required, multipart/form-data `file` field; returns `{ url, publicId }`
- `GET /dealers` · `GET /dealers/:slug` — public dealer directory and profile (with active listings)
- `POST /dealers` · `GET /dealers/me/profile` · `PATCH /dealers/:id` — JWT required
- `PATCH /dealers/:id/verify` — ADMIN role required

### Web (Next.js 15)
- App Router in `src/app/`
- Server state: TanStack Query; client state: Zustand stores in `src/store/`
- Forms: React Hook Form + Zod validators in `src/lib/validators/`
- HTTP: Axios client with auth interceptors in `src/lib/api/`
- Protected routes via Next.js middleware at `src/middleware.ts`
- Path alias: `@/` maps to `src/`

**Implemented pages (as of Phase 8):**
- `/` — homepage with hero, featured listings, browse by brand, features, CTA
- `/auth/login` · `/auth/register` · `/auth/forgot-password` · `/auth/reset-password`
- `/cars` — listings index (URL-synced filters, active filter chips, search, grid, pagination)
- `/cars/[id]` — listing detail (lightbox gallery, related listings, share, WhatsApp, SEO metadata)
- `/post-ad` — 3-step form: Vehicle Info → Pricing & Details → Photos (Cloudinary upload)
- `/dashboard` — real user listings with status badges, delete action
- `/dealers` — public dealer directory (cover banner, logo, verified badge, listing count)
- `/dealers/[slug]` — dealer profile (contact card, active inventory grid)
- `/dealers/register` — dealer registration form

**Key frontend components:**
- `components/listings/listing-card.tsx` — card with PKR Lakh/Crore price formatting
- `components/listings/listing-filters.tsx` — `ListingFiltersPanel` with cascading selects
- `components/listings/featured-section.tsx` — homepage featured grid
- `components/listings/makes-section.tsx` — homepage Browse by Brand grid
- `lib/validators/listing.validators.ts` — Zod schemas for post-ad form (step1/step2/full)
- `lib/api/media.ts` — `uploadImageApi(file)` and `addListingImagesApi(listingId, images[])`
- `components/listings/active-filters.tsx` — removable filter chips with human-readable labels
- `lib/api/dealers.ts` — `getDealersApi`, `getDealerApi`, `registerDealerApi`, `getMyDealerApi`, `updateDealerApi`
- `lib/hooks/use-dealers.ts` — `useDealers`, `useDealer`, `useMyDealer`, `useRegisterDealer`, `useUpdateDealer`

### Shared Packages
- `@pw-clone/types` — consumed by both api and web. Types are in `packages/types/src/`. After editing, types must be rebuilt or Turborepo handles it via `turbo run build`.
- `@pw-clone/ui` — Radix UI primitives + Tailwind. Uses `cn()` helper (clsx + tailwind-merge). Components must mark `"use client"` if they use hooks/events.

### Styling
- Tailwind CSS with CSS variables for theming (defined in `globals.css`)
- Dark mode via `next-themes` using the `class` strategy
- Use `cn()` from `@pw-clone/ui` or `@/lib/utils` for conditional class merging — never concatenate class strings directly
- `class-variance-authority` (CVA) for component variants

## Database

PostgreSQL via Prisma ORM. Key schema notes:
- Prices stored in **PKR** (Pakistani Rupees) as integers
- `Listing.status` enum: `DRAFT → PENDING → ACTIVE → SOLD/EXPIRED/REJECTED`
- `UserRole` enum: `USER | DEALER | EDITOR | ADMIN`
- All major entities have `createdAt`/`updatedAt` timestamps
- Images stored as Cloudinary public IDs in `ListingImage.publicId`

After any `prisma/schema.prisma` change: `npm run db:generate` then `npm run db:migrate`.

## Environment Variables

Copy `.env.example` to `.env`. Required for API:
- `DATABASE_URL` — PostgreSQL connection (port 5433 locally)
- `REDIS_URL` — Redis connection
- `JWT_SECRET`, `JWT_REFRESH_SECRET` — Auth tokens
- `CLOUDINARY_*` — Media uploads

Required for Web:
- `NEXT_PUBLIC_API_URL` — Points to API base URL

## Code Conventions

- **Prettier:** no semicolons, single quotes, trailing commas, 100-char print width, LF line endings
- **ESLint:** `_`-prefixed vars exempt from no-unused-vars; `console.warn`/`console.error` allowed; avoid `any` (warning)
- **TypeScript:** strict mode across all packages
- NestJS modules follow the pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/*.dto.ts`, `strategies/*.strategy.ts`
- DTOs use `class-validator` decorators; always `@IsString()`, `@IsEmail()`, etc.
- API responses use consistent shape from `src/common/` interceptors
