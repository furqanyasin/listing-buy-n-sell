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

## Phase 1 — Design System
- [ ] Color tokens & CSS variables
- [ ] Typography scale
- [ ] Button component (variants: primary, secondary, ghost, destructive)
- [ ] Input component
- [ ] Textarea component
- [ ] Select component
- [ ] Card component
- [ ] Badge component
- [ ] Avatar component
- [ ] Skeleton loaders
- [ ] Modal / Dialog
- [ ] Dropdown Menu
- [ ] Tabs component
- [ ] Pagination component
- [ ] Spinner / Loading states
- [ ] Global Header (desktop + mobile)
- [ ] Global Footer
- [ ] Layout wrapper
- [ ] Toast notifications (via sonner)

## Phase 2 — Authentication
- [ ] Register endpoint + DTO validation
- [ ] Login endpoint + JWT tokens
- [ ] Refresh token endpoint
- [ ] Logout (revoke refresh token)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] JWT Auth Guard
- [ ] Role Guard (RBAC)
- [ ] Current User decorator
- [ ] Register page (UI)
- [ ] Login page (UI)
- [ ] Forgot password page (UI)
- [ ] Auth store (Zustand)
- [ ] Protected route wrapper

## Phase 3 — Reference Data & Seed
- [ ] Makes seed (Toyota, Honda, Suzuki, etc.)
- [ ] Models seed per make
- [ ] Cities of Pakistan seed
- [ ] `/makes` API endpoint
- [ ] `/makes/:id/models` endpoint
- [ ] `/cities` endpoint
- [ ] Admin seed account

## Phase 4 — Vehicle Listings System
- [ ] Create listing API (POST /listings)
- [ ] Get listings API (GET /listings — paginated)
- [ ] Get listing by ID
- [ ] Update listing (PATCH)
- [ ] Delete listing (soft delete)
- [ ] My listings (GET /listings/user/me)
- [ ] Listing status management
- [ ] Multi-step listing form (UI)
- [ ] Image upload integration
- [ ] My listings dashboard page

## Phase 5 — Search & Advanced Filtering
- [ ] Elasticsearch setup
- [ ] Index listings on create/update
- [ ] Full-text search endpoint
- [ ] Filter by: make, model, year, price, city, mileage, fuel, transmission, body type
- [ ] Sort by: newest, price, mileage, year
- [ ] Pagination with URL state
- [ ] Search results page (UI)
- [ ] Filter sidebar component
- [ ] Active filters display

## Phase 6 — Homepage & Listing Cards
- [ ] Hero search bar
- [ ] Featured listings section
- [ ] Popular makes section
- [ ] Listing card component
- [ ] Recent listings section
- [ ] Homepage assembly

## Phase 7 — Car Detail Page
- [ ] Image gallery with lightbox
- [ ] Full spec table
- [ ] Seller info card
- [ ] WhatsApp / call CTA
- [ ] Contact seller form
- [ ] Related listings
- [ ] View count tracking
- [ ] Share listing (URL copy, WhatsApp)
- [ ] SEO meta tags per listing

## Phase 8 — Dealer Profiles
- [ ] Dealer registration flow
- [ ] Dealer profile public page
- [ ] Dealer inventory listing
- [ ] Dealer verification badge (admin)

## Phase 9 — User Dashboard
- [ ] Dashboard home with stats
- [ ] My ads management (edit/delete/renew)
- [ ] Account settings page
- [ ] Change password

## Phase 10 — Favorites & Messaging
- [ ] Save / unsave listings
- [ ] Saved listings page
- [ ] Start conversation (contact seller)
- [ ] Conversations list page
- [ ] Message thread view
- [ ] Real-time updates (polling or WebSocket)

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
