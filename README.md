# CNC Machine Bazaar — Industrial Machinery Marketplace

A full-stack industrial machinery marketplace platform. Buy, sell, and discover CNC machines, laser cutters, and equipment. Built as a production-grade monorepo with NestJS, Next.js 15, PostgreSQL, and Redis.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router, Turbopack) |
| Backend | NestJS 10 (REST API) |
| Database | PostgreSQL 16 via Prisma ORM |
| Cache | Redis 7 |
| Auth | JWT (access + refresh tokens) |
| Media | Cloudinary (image upload & transform) |
| UI | Tailwind CSS + Radix UI primitives |
| State | TanStack Query (server) + Zustand (client) |
| Monorepo | Turborepo |
| Testing | Playwright E2E + Vitest unit |

---

## Project Structure

```
pw-clone/
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   └── web/          # Next.js 15 frontend (port 3000)
├── packages/
│   ├── ui/           # Shared Radix/Tailwind component library
│   └── types/        # Shared TypeScript types
├── docs/             # Module documentation
├── plans/            # Roadmap
└── docker-compose.yml
```

---

## Features

### Listings
- Post multi-step listings with image upload (Cloudinary)
- Browse, search, and filter by brand, model, city, price, year, power type, control type, machine type
- URL-synced filters (shareable links)
- Lightbox image gallery with keyboard navigation
- WhatsApp deep link, Web Share API
- Schema.org Product structured data + dynamic OG tags

### Users & Auth
- Register / login / logout with JWT (15m access + 7d refresh tokens)
- Forgot password / reset password flow
- Profile management with avatar upload
- Change password

### Favorites & Messaging
- Save/unsave listings with optimistic UI updates
- In-app messaging between buyer and seller
- Real-time polling (3s thread, 15s list)
- Unread message badges

### Suppliers
- Register supplier profile (upgrades user role)
- Public supplier directory and profile pages
- Admin-verified supplier badges
- Supplier reviews with star ratings

### Blog
- Blog listing page with category filter
- Blog detail with SEO metadata
- Admin CMS (create, edit, publish, archive)

### Notifications
- In-app notification bell with live unread count
- Mark individual or all as read

### Admin Panel
- Listings moderation (approve / reject with reason / mark featured)
- User management (ban/unban, change role)
- Dashboard stats
- Blog management

### SEO & Performance
- Dynamic `sitemap.xml` (listings, suppliers, blog posts)
- Schema.org `Product` JSON-LD on listing detail pages
- Next.js `generateMetadata` for all dynamic pages
- Turbopack in dev for fast HMR

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop (for Postgres + Redis)

### 1. Clone & install

```bash
git clone https://github.com/furqanyasin/listing-buy-n-sell.git
cd pw-clone
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` — the defaults work out of the box for local development except Cloudinary (needed only for image upload):

```env
DATABASE_URL=postgresql://pw_user:pw_password@localhost:5433/pw_clone_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Get free credentials at cloudinary.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3. Start infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL (port **5433**), Redis (6379), pgAdmin (5050), Redis Commander (8081).

### 4. Database setup

```bash
cd apps/api
npm run db:migrate   # Run migrations
npm run db:seed      # Seed brands, models, cities, test users
cd ../..
```

### 5. Run dev servers

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| Swagger docs | http://localhost:4000/api/docs |
| pgAdmin | http://localhost:5050 |
| Redis Commander | http://localhost:8081 |

---

## Test Accounts

Seeded by `npm run db:seed`:

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | admin@cncmachinebazaar.com | Admin@123456 | Full access + admin panel |
| Editor | editor@cncmachinebazaar.com | Editor@123456 | Blog CMS + listing moderation |
| Supplier | dealer@cncmachinebazaar.com | Dealer@123456 | Supplier profile pre-set |
| User | user@cncmachinebazaar.com | User@1234567 | Regular buyer/seller |
| Buyer | buyer@cncmachinebazaar.com | Buyer@123456 | Second user (for messaging tests) |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured machines, Browse by Brand |
| `/machines` | Listings with URL-synced filters, search, pagination |
| `/machines/[id]` | Listing detail — gallery, specs, seller card, related listings |
| `/list-machine` | 3-step listing creation form (auth required) |
| `/suppliers` | Supplier directory |
| `/suppliers/[slug]` | Supplier profile with inventory and reviews |
| `/suppliers/register` | Register as a supplier |
| `/blog` | Blog listing with category filter |
| `/blog/[slug]` | Blog post detail |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/auth/forgot-password` | Forgot password |
| `/dashboard` | User dashboard — listings, stats |
| `/dashboard/saved` | Saved machines |
| `/dashboard/messages` | Conversations list |
| `/dashboard/messages/[id]` | Message thread |
| `/dashboard/notifications` | Notifications |
| `/dashboard/settings` | Profile + avatar + change password |
| `/dashboard/listings/[id]/edit` | Edit a listing |
| `/dashboard/admin` | Admin overview (admin only) |
| `/dashboard/admin/listings` | Listing moderation queue |
| `/dashboard/admin/users` | User management |
| `/dashboard/admin/blog` | Blog CMS |

---

## Commands

### Root (from project root)

```bash
npm run dev       # Start all apps
npm run build     # Build all apps
npm run lint      # Lint all packages
npm run test      # Run all tests
```

### API (`apps/api/`)

```bash
npm run db:generate   # Regenerate Prisma client after schema changes
npm run db:migrate    # Create & run migration
npm run db:seed       # Seed reference data + test users
npm run db:studio     # Open Prisma Studio at localhost:5555
npm run test          # Jest unit tests
npm run test:e2e      # E2E tests (requires DB + Redis)
```

### Web (`apps/web/`)

```bash
npm run test          # Vitest unit tests
npm run typecheck     # TypeScript check without build
```

### E2E Tests (Playwright)

```bash
cd apps/web
npx playwright install   # Install browsers (first time)
npx playwright test      # Run all E2E tests
npx playwright test --ui # Interactive UI mode
```

---

## License

MIT
