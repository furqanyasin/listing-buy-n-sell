# Module 07 — Car Detail Page Enhancements

## Status: ✅ COMPLETE (Phase 7)

---

## Architecture Change

The detail page was split for SEO compatibility:

| File | Type | Purpose |
|---|---|---|
| `apps/web/src/app/cars/[id]/page.tsx` | Server Component | `generateMetadata` + renders client component |
| `apps/web/src/app/cars/[id]/listing-detail-client.tsx` | `'use client'` | All interactive UI |

---

## Features

### Image Lightbox (`ImageLightbox` component)
- Click main image or the expand button (↗ top-right) to open fullscreen overlay
- Keyboard nav: `←` / `→` arrows cycle images, `Esc` closes
- Dot indicator row shows current position
- `document.body.style.overflow = 'hidden'` prevents background scroll while open
- `useCallback` on prev/next to avoid stale closure in keyboard handler

### Related Listings
- Shown below the main content when ≥1 similar listing exists
- Hook: `useRelatedListings(makeId, modelId, excludeId)` — calls `/listings?makeId=X&modelId=Y&limit=5`, filters out current listing client-side, slices to 4
- Uses cached `ListingCard` components

### WhatsApp Deep Link
```typescript
function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 11) return '92' + digits.slice(1)
  if (digits.startsWith('92') && digits.length === 12) return digits
  return '92' + digits
}
// URL: https://wa.me/{number}?text=Hi%2C+I%27m+interested+in...
```
Handles Pakistani format `03XX-XXXXXXX` → `923XXXXXXXXX`. Hidden if seller has no phone.

### Share Button
```typescript
async function handleShare() {
  if (navigator.share) await navigator.share({ title, url })
  else { await navigator.clipboard.writeText(url); toast.success('Link copied!') }
}
```

### SEO Metadata (`generateMetadata`)
- Fetches `${NEXT_PUBLIC_API_URL}/listings/:id` on the server with `revalidate: 300`
- Returns `title`, `description` (first 155 chars), `openGraph` with image, `twitter:card`
- Wrapped in try/catch — returns generic fallback if API is unreachable (safe for CI builds)
