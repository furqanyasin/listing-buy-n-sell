# PW Clone — Development Roadmap

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Complete

---

## Phase 0 — Environment Setup
- [x] Monorepo structure (Turborepo)
- [x] Next.js 14 scaffold (`apps/web`)
- [x] NestJS scaffold (`apps/api`)
- [x] Shared packages (`@pw-clone/ui`, `@pw-clone/types`)
- [x] Docker Compose (PostgreSQL + Redis + pgAdmin + Redis Commander)
- [x] ESLint + Prettier + Husky
- [x] GitHub Actions CI/CD pipeline
- [x] Prisma schema (full database)
- [x] Shared TypeScript types
- [x] `.env.example` with all variables
- [x] Documentation structure

## Phase 1 — Design System ✅ COMPLETE
- [x] Color tokens & CSS variables (brand-*, surface-* in tailwind.config.ts + globals.css)
- [x] Typography scale (Inter font, heading hierarchy)
- [x] Button component (6 variants: default/secondary/outline/ghost/destructive/link, 4 sizes, asChild, isLoading)
- [x] Input component (leftIcon, rightIcon, error state)
- [x] Textarea component (error state, resize-y)
- [x] Select component (full Radix, checkmark, error state)
- [x] Label component (required asterisk)
- [x] Checkbox component + CheckboxWithLabel
- [x] Card component family (Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription)
- [x] Badge component (6 variants: default/secondary/success/destructive/warning/outline)
- [x] Avatar component (4 sizes, Radix, fallback initials)
- [x] Skeleton loaders (Skeleton, SkeletonCard, SkeletonListingCard)
- [x] Modal / Dialog (Radix, backdrop blur, slide animation, X button)
- [x] Dropdown Menu (full Radix family, sub-menus, radio/checkbox items)
- [x] Tabs component (pill style, Radix)
- [x] Pagination component (smart range, PaginationInfo)
- [x] Spinner / Loading states (3 variants, 3 sizes, SVG animate-spin)
- [x] Separator (horizontal + vertical)
- [x] Tooltip (dark bg, Radix, Portal)
- [x] ScrollArea (Radix, custom scrollbar)
- [x] Global Header (sticky, scroll shadow, desktop nav, mobile hamburger slide-out)
- [x] Global Footer (4-column grid, social links, app download CTA, bottom bar)
- [x] PageWrapper layout (Header + Footer + main, noPadding/contained variants)
- [x] Auth store skeleton (Zustand, persisted)
- [x] Toast notifications (Sonner, configured in Providers)
- [x] Homepage shell (Hero, stats bar, featured skeleton, makes skeleton, features, CTA)

## Phase 2 — Authentication ✅ COMPLETE
- [x] Register endpoint + DTO validation
- [x] Login endpoint + JWT tokens
- [x] Refresh token endpoint
- [x] Logout (revoke refresh token)
- [~] Email verification flow (schema ready, not wired)
- [x] Password reset flow (dev mode: token logged to console)
- [x] JWT Auth Guard (global)
- [x] Role Guard (RBAC, global)
- [x] Current User decorator
- [x] Register page (UI)
- [x] Login page (UI)
- [x] Forgot password page (UI)
- [x] Reset password page (UI)
- [x] Auth store (Zustand, persisted)
- [x] Protected route middleware (Next.js middleware.ts)
- [x] Axios interceptor (token attach + refresh + retry)

## Phase 3 — Reference Data & Seed ✅ COMPLETE
- [x] Makes seed (18 makes: Toyota, Honda, Suzuki, KIA, Hyundai, Nissan, Mitsubishi, Daihatsu, Mercedes-Benz, BMW, Audi, Changan, Proton, MG, Haval, DFSK, FAW, United)
- [x] Models seed per make (~100+ models total)
- [x] Cities of Pakistan seed (30 cities with province + coordinates)
- [x] `GET /reference/makes` endpoint (public)
- [x] `GET /reference/makes/:id/models` endpoint (public)
- [x] `GET /reference/cities` endpoint (public)
- [x] Admin seed account (admin@pw-clone.com / Admin@123456)
- [x] Frontend API functions (`lib/api/reference.ts`)
- [x] Frontend TanStack Query hooks (`useMakes`, `useModelsByMake`, `useCities`)

## Phase 4 — Vehicle Listings System ✅ COMPLETE
- [x] Create listing API (`POST /listings`) — creates as PENDING
- [x] Get listings API (`GET /listings`) — paginated, filtered, ACTIVE only
- [x] Get featured listings (`GET /listings/featured`)
- [x] Get listing by ID (`GET /listings/:id`) — increments view count
- [x] My listings (`GET /listings/user/mine`)
- [x] Update listing (`PATCH /listings/:id`) — owner only
- [x] Delete listing (`DELETE /listings/:id`) — owner or admin
- [x] Listing status management (`PATCH /listings/:id/status`) — admin/editor
- [x] Admin all-listings view (`GET /listings/admin/all`)
- [x] Full filter support: make, model, city, year range, price range, mileage, fuel type, transmission, body type, condition, isFeatured, sort, pagination
- [x] `ListingCard` component (image, price in PKR Lakh/Crore, specs, badges)
- [x] Filter sidebar component (`ListingFiltersPanel`) with cascading make→model selects
- [x] `/cars` listings page (search bar, filter sidebar, grid, pagination)
- [x] `/cars/[id]` detail page (image gallery, specs, seller card, phone CTA)
- [x] `FeaturedSection` component (homepage, hides when empty)
- [x] `MakesSection` component (homepage Browse by Brand)
- [x] Homepage updated — real data replaces skeleton placeholders

## Phase 5 — Post Ad & Image Upload ✅ COMPLETE
- [x] Media module: `POST /media/upload` (Multer + Cloudinary, memoryStorage, 10 MB limit, JPEG/PNG/WebP)
- [x] Cloudinary image transformation (resize 1280x960, quality:auto, fetch_format:auto)
- [x] `POST /listings/:id/images` — attach uploaded images to a listing (owner only)
- [x] Multi-step Post Ad form (Step 1: Vehicle Info, Step 2: Pricing & Details, Step 3: Photos)
- [x] Zod schemas: `listingStep1Schema`, `listingStep2Schema`, `listingFullSchema`
- [x] react-hook-form + zod resolver, cascading make→model selects from reference hooks
- [x] Photo upload drag-and-drop, preview grid, cover badge, per-image upload status
- [x] `/post-ad` page (protected) — 3-step form with progress stepper
- [x] Dashboard: real listings from `useMyListings()`, status badge, delete action
- [x] Fixed `ListingCard` type: `primaryImage` → `images: ListingImage[]` (matches API response)
- [x] `ListingCard` type now includes `status`, `bodyType`, `locationText` fields

## Phase 6 — Search & Advanced Filtering ✅ COMPLETE
- [x] Improved backend search: `q` now matches title, description, make name, model name, and city name
- [x] URL-synced filter state — ALL filters read from and written to URL searchParams (shareable links)
- [x] `filtersFromParams()` — derives `ListingFilters` from `ReadonlyURLSearchParams` on every render
- [x] `filtersToParams()` — serialises `ListingFilters` back to a URL query string
- [x] `pushFilters()` — single helper that calls `router.replace` to update URL
- [x] Active filter chips (`ActiveFilters` component) — removable chips for each applied filter with human-readable labels (make name, city name, formatted price, etc.)
- [x] Pagination page number synced to URL (`?page=N`)
- [x] Elasticsearch deferred — Prisma full-text search sufficient at current scale

## Phase 7 — Car Detail Page Enhancements ✅ COMPLETE
- [x] Image lightbox — fullscreen overlay, keyboard nav (← → Esc), dot indicators, click-to-open
- [x] Related listings — same make+model, max 4 cards, excludes current listing, shown at page bottom
- [x] `useRelatedListings(makeId, modelId, excludeId)` hook
- [x] WhatsApp deep link — `https://wa.me/{number}?text=...` pre-filled with title + URL; PK number formatter (03XX → 923XX)
- [x] Share button — Web Share API with `navigator.clipboard` fallback (copies URL)
- [x] SEO metadata — `generateMetadata` in Server Component, fetches listing data server-side, sets title/description/og:image/twitter:card
- [x] Page split into Server Component (`page.tsx`) + Client Component (`listing-detail-client.tsx`)

## Phase 8 — Dealer Profiles ✅ COMPLETE
- [x] `POST /dealers` — register as dealer (creates profile + upgrades user role to DEALER in transaction)
- [x] `GET /dealers` — public list, ordered by isFeatured → isVerified → createdAt
- [x] `GET /dealers/:slug` — public profile with active inventory (separate listings query via userId)
- [x] `GET /dealers/me/profile` — authenticated dealer fetches own profile
- [x] `PATCH /dealers/:id` — owner-only update
- [x] `PATCH /dealers/:id/verify` — admin sets isVerified = true
- [x] `slugify()` with numeric suffix for unique slugs
- [x] `listingsCount` derived from `user._count.listings` (listings belong to User, not Dealer)
- [x] `Dealer` and `DealerProfile` types in `@pw-clone/types`
- [x] `getDealersApi`, `getDealerApi`, `registerDealerApi`, `getMyDealerApi`, `updateDealerApi`
- [x] `useDealers`, `useDealer`, `useMyDealer`, `useRegisterDealer`, `useUpdateDealer` hooks
- [x] `/dealers` — public dealer directory (cover banner, logo, verified badge, listing count)
- [x] `/dealers/[slug]` — public dealer profile (cover, logo, contact card, active inventory grid)
- [x] `/dealers/register` — dealer registration form (react-hook-form + zod)

## Phase 9 — User Dashboard ✅ COMPLETE
- [x] `viewsCount` added to `LIST_SELECT` — `findMine` now returns total view counts
- [x] Dashboard stats: real total views summed from listings (not hardcoded)
- [x] Edit button per listing in dashboard → `/dashboard/listings/:id/edit`
- [x] Edit listing page — full prefilled form (vehicle info + pricing), any listing status
- [x] `GET /listings/user/mine/:id` — owner can fetch their own listing (any status) for edit form
- [x] Settings page `/dashboard/settings` — profile card with avatar upload, name, phone
- [x] `PATCH /auth/change-password` — verify current password, update with bcrypt hash
- [x] Change password form with current/new/confirm fields + Zod refine validation
- [x] `useUpdateProfile`, `useChangePassword`, `useProfile` hooks
- [x] Auth store synced after profile update (header shows updated name immediately)
- [x] `useMyListing(id)`, `useUpdateListing(id)` hooks added

## Phase 10 — Favorites & Messaging ✅ COMPLETE
- [x] `POST /favorites/:listingId` — toggle favorite (add/remove, returns `{ isFavorited }`)
- [x] `GET /favorites` — saved listings for current user
- [x] `GET /favorites/ids` — lightweight ID list for client-side toggle state
- [x] Heart button on `ListingCard` — optimistic toggle, only shown when authenticated
- [x] `/dashboard/saved` — saved cars grid
- [x] `POST /conversations` — find-or-create conversation per `(listingId, buyerId)` pair
- [x] `GET /conversations` — all conversations (buyer + seller), ordered by updatedAt
- [x] `GET /conversations/:id` — detail with messages
- [x] `POST /conversations/:id/messages` — send message, touches conversation updatedAt
- [x] `PATCH /conversations/:id/read` — mark incoming messages as read
- [x] `unreadCount` computed via Prisma filtered `_count` (messages where readAt null AND senderId != userId)
- [x] `/dashboard/messages` — conversation list with last message preview + unread badge; 15s polling
- [x] `/dashboard/messages/[id]` — message thread with send form; 3s polling, auto-scroll, mark-read on open
- [x] "Chat with Seller" button on listing detail → creates/finds conversation → navigates to thread
- [x] "Save Car" heart button on listing detail page
- [x] Dashboard stats cards: Saved Cars + Messages link to respective pages

## Phase 11 — Blog & Content
- [ ] Blog listing page
- [ ] Blog detail page
- [ ] Blog categories
- [ ] Blog CMS (admin create/edit)

## Phase 12 — Reviews & Ratings
- [ ] Leave review on seller/dealer
- [ ] Star rating display
- [ ] Reviews section on profiles

## Phase 13 — Notifications
- [ ] Notification bell (header)
- [ ] Notification types
- [ ] Mark as read
- [ ] Backend notification creation service

## Phase 14 — Admin Panel
- [ ] Listings moderation (approve/reject)
- [ ] User management (ban/verify)
- [ ] Featured listings management
- [ ] Blog management
- [ ] Basic analytics dashboard

## Phase 15 — Optimization & SEO
- [ ] Dynamic OG tags
- [ ] Sitemap.xml generation
- [ ] Schema.org Vehicle markup
- [ ] Redis caching for hot routes
- [ ] Database index optimization
- [ ] Lighthouse score 90+

## Phase 16 — Production Deployment
- [ ] Production Dockerfile (web + api)
- [ ] Environment secrets management
- [ ] SSL setup
- [ ] Monitoring (Sentry)
- [ ] DB backup strategy

## Phase 17 — Testing & Launch
- [ ] E2E test suite (Playwright)
- [ ] Security audit
- [ ] Load testing
- [ ] Public launch
