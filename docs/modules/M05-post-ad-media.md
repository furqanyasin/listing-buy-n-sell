# Module 05 — Post Ad & Image Upload

## Status: ✅ COMPLETE (Phase 5)

---

## Backend

### Media Module (`apps/api/src/modules/media/`)

**Endpoint:** `POST /media/upload`
**Auth:** JWT required
**Content-Type:** `multipart/form-data`
**Field name:** `file`
**Limits:** 10 MB, JPEG/PNG/WebP only

**Service (`media.service.ts`):**
- Configures Cloudinary from env vars on construction (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
- `uploadImage(file)` — streams buffer to Cloudinary, returns `{ url, publicId }`
- Transformation: resize 1280×960, quality:auto, fetch_format:auto
- `deleteImage(publicId)` — calls `cloudinary.uploader.destroy`

**Controller (`media.controller.ts`):**
- Uses `FileInterceptor` with `memoryStorage()` (no temp files on disk)
- Multer `fileFilter` rejects non-image MIME types with `BadRequestException`

---

### Listing Images Endpoint

**Endpoint:** `POST /listings/:id/images`
**Auth:** JWT required (owner only)
**Body:** `{ images: [{ url, publicId, isPrimary?, order? }] }`

- Creates `ListingImage` records in Prisma
- Auto-assigns `isPrimary = true` to first image if no existing images
- Auto-assigns `order` based on existing image count

---

## Frontend

### Validators (`apps/web/src/lib/validators/listing.validators.ts`)

| Schema | Fields |
|---|---|
| `listingStep1Schema` | makeId, modelId, year, condition, bodyType, fuelType, transmission, mileage, color |
| `listingStep2Schema` | title, description, price, cityId, locationText? |
| `listingFullSchema` | merge of step1 + step2 |

### Media API (`apps/web/src/lib/api/media.ts`)

- `uploadImageApi(file: File)` → `{ url, publicId }`
- `addListingImagesApi(listingId, images[])` → void

### Post Ad Page (`apps/web/src/app/post-ad/page.tsx`)

3-step form with progress stepper:

1. **Step 1 — Vehicle Info:** Make, Model, Year, Condition, Body Type, Fuel Type, Transmission, Mileage, Color
2. **Step 2 — Pricing & Details:** Title, Description, Price, City, Location Text
3. **Step 3 — Photos:** Drag-and-drop or click to upload; preview grid with cover badge; per-image upload status indicator

**Submit flow:**
1. Upload images to `/media/upload` one by one → collect `{ url, publicId }[]`
2. `POST /listings` to create listing
3. `POST /listings/:id/images` to attach images

### Dashboard (`apps/web/src/app/dashboard/page.tsx`)

- Converted from static to `'use client'` — uses `useMyListings()`
- Stats: total ads, active ads, saved cars (0), total views (0)
- Listing row: thumbnail, title, specs, status badge, external link (if ACTIVE), delete button
- `useDeleteListing()` from `use-listings.ts` handles toast on success/error

---

## Type Fixes

`ListingCard` type updated in `packages/types/src/listing.types.ts`:
- `primaryImage: ListingImage | null` → `images: ListingImage[]`
- Added: `status`, `bodyType`, `locationText`
- City type: `Pick<City, 'id' | 'name' | 'province'>`
