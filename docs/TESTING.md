# Testing Guide — PW Clone

This document walks through verifying every feature works correctly, both locally and on the deployed Vercel frontend + hosted API.

---

## Architecture Overview (Production)

```
Browser → Vercel (Next.js frontend) → Railway/Render (NestJS API) → Neon/Supabase (PostgreSQL) + Upstash (Redis)
```

> **Important:** NestJS cannot run on Vercel (serverless limitation). The API must be deployed separately. This guide assumes:
> - **Frontend**: Vercel
> - **API**: Railway, Render, or Fly.io
> - **Database**: Neon, Supabase, or Railway PostgreSQL
> - **Redis**: Upstash Redis

---

## Part 1 — Pre-Flight: Verify Environment Variables

### Vercel (Frontend)

Go to **Vercel Dashboard → Project → Settings → Environment Variables** and confirm these are set:

| Variable | Example Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-api.railway.app/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |

### API Host (Railway / Render / Fly.io)

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `REDIS_URL` | Full Redis connection string |
| `JWT_SECRET` | Long random string (min 32 chars) |
| `JWT_REFRESH_SECRET` | Different long random string |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `FRONTEND_URL` | Your Vercel URL (for CORS) |
| `NODE_ENV` | `production` |

---

## Part 2 — API Health Check

Open your browser or use curl/Postman.

### 1. Base Health

```
GET https://your-api.railway.app/api/v1
```

Expected: `200 OK` with a response body (app controller response).

### 2. Swagger Docs (dev only)

If `NODE_ENV !== production`:
```
GET https://your-api.railway.app/api/docs
```
Swagger UI should load. Use this to test individual endpoints manually.

### 3. Reference Data (confirms DB is seeded)

```
GET https://your-api.railway.app/api/v1/reference/makes
```

Expected: JSON array of 18 car makes (Toyota, Honda, Suzuki, etc.).

```
GET https://your-api.railway.app/api/v1/reference/cities
```

Expected: JSON array of 30 Pakistani cities.

> If these return empty arrays → run the seed: `npm run db:seed` in `apps/api`.

---

## Part 3 — Frontend Smoke Test

Open your Vercel URL and verify these pages load without a white screen or 404.

| Page | URL | Expected |
|---|---|---|
| Homepage | `/` | Hero, stats bar, featured listings section |
| Listings | `/cars` | Filter sidebar, search bar, listing grid |
| Blog | `/blog` | Blog grid (empty is OK before seeding posts) |
| Dealers | `/dealers` | Dealer directory grid |
| Login | `/auth/login` | Login form |
| Register | `/auth/register` | Registration form |

**Red flags:**
- White screen → check browser console for JS errors (usually a missing env var)
- "Network Error" on API calls → `NEXT_PUBLIC_API_URL` is wrong or API is down
- CORS error in console → `FRONTEND_URL` on the API doesn't match your Vercel URL

---

## Part 4 — Authentication Flow

### Register a New Account

1. Go to `/auth/register`
2. Fill in: Name, Email, Password (min 8 chars, at least one uppercase + number)
3. Submit → should redirect to `/dashboard`
4. Header should show your name + avatar initials

### Login

1. Go to `/auth/login`
2. Enter the credentials you just created
3. Submit → redirects to `/dashboard`

### Admin Login

1. Go to `/auth/login`
2. Email: `admin@pw-clone.com`
3. Password: `Admin@123456`
4. Submit → header shows "Admin Panel" in the user menu dropdown

### Protected Route Redirect

1. Log out (click your name → Sign Out)
2. Try visiting `/dashboard` directly
3. Expected: redirected to `/auth/login?redirect=/dashboard`
4. After login, redirected back to `/dashboard`

### Forgot Password

1. Go to `/auth/forgot-password`
2. Enter a registered email
3. Submit → success message appears
4. In dev mode: reset token is logged to the API console (not emailed)
5. Copy the token from API logs → go to `/auth/reset-password?token=<token>`
6. Set a new password → redirects to login

---

## Part 5 — Listings

### Browse

1. Go to `/cars`
2. Listings grid should show (if seeded) or be empty with "No results" message
3. Apply filters: Make, City, Price range → URL updates with query params (shareable links)
4. Type in search box → results filter by title/make/model/city
5. Active filter chips appear above the grid with an X to remove each

### Post an Ad

1. Log in as any user
2. Click "Post Ad" button in header
3. **Step 1 — Vehicle Info:**
   - Select Make → Model dropdown populates automatically
   - Fill in year, mileage, fuel type, transmission, body type, colour, condition, city
   - Click Next
4. **Step 2 — Pricing & Details:**
   - Enter price in PKR (e.g. `2500000` = 25 Lakh)
   - Write a description (min required)
   - Click Next
5. **Step 3 — Photos:**
   - Upload at least one image (JPEG/PNG/WebP, max 10 MB)
   - Watch upload progress bar
   - Images appear as preview grid with ✓ status
   - Click "Post Ad"
6. Expected: toast "Ad submitted for review" → redirected to `/dashboard`
7. Listing appears in dashboard with "Under Review" badge

### View Listing Detail

1. Go to `/cars`
2. Click any listing card
3. Verify:
   - Image gallery with lightbox (click image → fullscreen, arrow keys navigate, Esc closes)
   - Specs grid (year, mileage, fuel, transmission)
   - Seller contact card with phone number
   - WhatsApp button (opens `wa.me/` link in new tab)
   - Share button (Web Share API or clipboard fallback)
   - Related listings at bottom (same make/model)
4. Check browser source (Ctrl+U) → search for `application/ld+json` → Schema.org Vehicle markup should be present

### Admin Approve a Listing

1. Log in as admin
2. Go to `/dashboard/admin/listings`
3. Listings you submitted will appear as "Pending"
4. Click **Approve** → listing status changes
5. Go to `/cars` → the approved listing should now appear in the grid

---

## Part 6 — Favorites

1. Log in as any non-admin user
2. Browse `/cars`
3. Hover a listing card → red heart icon appears (top-right of image)
4. Click the heart → fills red (optimistic update)
5. Refresh the page → heart stays filled (persisted)
6. Go to `/dashboard/saved` → listing appears in the saved grid
7. Click the heart again to unfavorite → removed from saved grid

**Also test on listing detail:**
1. Open `/cars/:id`
2. Click "Save Car" button → heart fills
3. Go to `/dashboard/saved` → appears there too

---

## Part 7 — Messaging

1. **Setup:** Log in as User A, find an active listing posted by User B (use two different accounts)
2. Open the listing detail page
3. Click **"Chat with Seller"**
4. Expected: creates/finds conversation → navigates to `/dashboard/messages/:id`
5. Type a message → press Enter or click Send button
6. Open the same conversation as User B → message appears
7. Message from User B shows on the **left (grey)**, your messages on the **right (blue)**
8. Unread badge appears on `/dashboard/messages` row and header notification bell

**Polling test:**
- Keep two browser windows open (one as each user)
- Send a message in one → within 3 seconds it appears in the other

---

## Part 8 — Dealer Profiles

### Register as a Dealer

1. Log in as a regular user
2. Go to `/dealers/register`
3. Fill in dealer name, phone, city, description
4. Submit → toast "Dealer profile created" → user role upgrades to DEALER

### Verify a Dealer (Admin)

1. Log in as admin
2. Go to Swagger docs or use curl:
   ```
   PATCH /api/v1/dealers/:dealerId/verify
   Authorization: Bearer <admin-token>
   ```
3. Dealer page now shows "Verified" badge

### Leave a Dealer Review

1. Log in as a different user (not the dealer owner)
2. Go to `/dealers/:slug`
3. Scroll to "Reviews" section
4. Click stars to set rating (1–5)
5. Optionally type a comment
6. Click "Submit Review"
7. Review appears in the list with your name and star row

---

## Part 9 — Blog

### Read a Post (requires creating one first)

1. Log in as admin
2. Go to `/dashboard/admin/blog`
3. Click **New Post**
4. Fill in:
   - Title: `Top 5 Budget Cars in Pakistan 2024`
   - Slug: auto-fills from title (click on Slug field after tabbing away from Title)
   - Body: write at least 10 characters
   - Status: **Published**
5. Click "Create Post"
6. Go to `/blog` → post appears in the grid
7. Click the post → `/blog/top-5-budget-cars-in-pakistan-2024` opens

### Category Filter

1. Create 2 more posts with different categories (e.g. "News", "Reviews")
2. Go to `/blog`
3. Category pills appear at top
4. Click a category → grid filters to matching posts only
5. Click the same pill again (or "All") → resets filter

---

## Part 10 — Notifications

1. Approve a listing (as admin) → the listing owner should get a notification
   - **Note:** Automatic notification creation on approval requires calling `NotificationsService` inside `AdminService.approveListing()`. Currently the service is wired but not auto-triggered — you can test by calling `POST /api/v1/notifications` via Swagger (dev only) or by adding the trigger manually.
2. Go to `/dashboard/notifications`
3. Unread items shown with blue highlight
4. Click a notification → it becomes read (white background)
5. Header bell badge count decreases
6. Click "Mark all read" → all become read, badge disappears

---

## Part 11 — Admin Panel

### Stats Dashboard

1. Log in as admin
2. Go to `/dashboard/admin`
3. Stat cards show: Total Users, Active Listings, Pending Review, Total Dealers

### Listings Moderation

1. Post a listing as a regular user (stays Pending)
2. Log in as admin → go to `/dashboard/admin/listings`
3. The listing appears in the queue
4. Click **Reject** → type a reason → "Confirm" → listing moves to Rejected
5. The poster can see "Rejected" badge in their dashboard

### User Management

1. Go to `/dashboard/admin/users`
2. All registered users appear with their role and listing count
3. Change a user's role via the dropdown → toast "Role updated"
4. Click **Ban** next to a user → row turns red, button changes to "Unban"

---

## Part 12 — User Dashboard

### Settings

1. Log in → go to `/dashboard/settings`
2. Click the camera icon on the avatar → upload a photo (goes to Cloudinary)
3. Update your display name and phone number → Save
4. Header avatar updates immediately

### Change Password

1. In `/dashboard/settings`, scroll to "Change Password" section
2. Enter current password, new password, confirm new password
3. Submit → toast "Password updated"
4. Log out → log back in with new password

### Edit a Listing

1. Go to `/dashboard`
2. Click the pencil icon on one of your listings
3. Change the price or description
4. Save → toast "Listing updated" → redirects back to dashboard

---

## Part 13 — SEO Checks

### Sitemap

```
GET https://your-project.vercel.app/sitemap.xml
```

Expected: valid XML with `<url>` entries for homepage, `/cars`, `/dealers`, `/blog`, plus individual listing and dealer URLs.

### Open Graph Preview

Use [opengraph.xyz](https://www.opengraph.xyz) or [metatags.io](https://metatags.io):

1. Paste a listing URL: `https://your-project.vercel.app/cars/:id`
2. Verify: title, description, and cover image (first listing photo) appear correctly

### Schema.org Markup

1. Open a listing detail page
2. View page source (Ctrl+U)
3. Search for `application/ld+json`
4. Should see a `Vehicle` schema block with name, brand, model, price, mileage, fuelType

Validate at [schema.org/Vehicle](https://validator.schema.org) by pasting the JSON-LD block.

---

## Part 14 — Mobile Responsiveness

Test on a real phone or use Chrome DevTools (F12 → Toggle Device Toolbar):

| Test | Expected |
|---|---|
| Homepage | Hero text readable, stats bar wraps cleanly |
| `/cars` | Filter sidebar hidden → accessible via "Filters" button |
| Listing card | Full width, heart icon visible |
| Header | Hamburger menu opens slide-out nav |
| Message thread | Send bar sticks to bottom of screen |
| Admin listings | Cards stack vertically, approve/reject buttons readable |

---

## Part 15 — Common Issues & Fixes

| Symptom | Cause | Fix |
|---|---|---|
| "Network Error" on all API calls | `NEXT_PUBLIC_API_URL` not set or wrong | Check Vercel env vars, redeploy |
| CORS error in browser console | `FRONTEND_URL` on API doesn't match Vercel URL | Update env var on API host, restart API |
| Login redirects to login again | Cookie `pw_auth_token` not being set | Check if API and frontend are same domain; cookie must be set client-side in auth store |
| Images not loading | Cloudinary domain not in `next.config.ts` remotePatterns | Already configured for `res.cloudinary.com` |
| "Slug already in use" on blog post | Duplicate slug | Change the slug field |
| Listing stays Pending | Admin hasn't approved it | Go to `/dashboard/admin/listings` → Approve |
| No makes in Post Ad form | DB not seeded | Run `npm run db:seed` in `apps/api` |
| 401 after refresh | JWT secrets differ between deploys | Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are identical across restarts |
| Notification count never clears | `useMarkRead` not firing | Check browser console for errors on the notifications page |

---

## Quick Checklist (Copy to clipboard before each deploy)

```
AUTH
[ ] Register new account
[ ] Login / logout
[ ] Protected route redirect
[ ] Admin login (admin@pw-clone.com / Admin@123456)

LISTINGS
[ ] Post Ad (3-step form + image upload)
[ ] Image appears in Cloudinary
[ ] Admin approves listing
[ ] Listing shows in /cars grid
[ ] Listing detail: lightbox, WhatsApp, share, related

FAVORITES
[ ] Heart toggle on listing card
[ ] Heart toggle on listing detail
[ ] /dashboard/saved shows saved listings

MESSAGES
[ ] Start conversation from listing detail
[ ] Send and receive messages (two users)
[ ] Unread badge shown

DEALERS
[ ] Register as dealer
[ ] Dealer appears in /dealers
[ ] Leave a review with star rating

BLOG
[ ] Create blog post as admin
[ ] Post appears in /blog
[ ] Category filter works

NOTIFICATIONS
[ ] Bell count updates
[ ] Mark as read
[ ] Mark all read

ADMIN
[ ] Stats dashboard
[ ] Approve/reject listing
[ ] Change user role

SEO
[ ] /sitemap.xml returns XML
[ ] Schema.org markup in listing detail source
[ ] OG image appears in preview tools
```
