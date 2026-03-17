# Module M01 — Phase 1: Design System

**Status:** Complete
**Date:** 2026-03-17
**Depends on:** M00 (Phase 0)

---

## What Was Built

### Design Tokens (`tailwind.config.ts` + `globals.css`)
- **Brand palette:** `brand-50` → `brand-950` (orange, base `#f97316`)
- **Surface palette:** `surface-50` → `surface-950` (neutral gray scale)
- **CSS custom properties:** `--radius`, `--primary`, `--background`, etc. (dark mode ready)
- **Custom shadows:** `shadow-card`, `shadow-card-hover`, `shadow-modal`
- **Custom spacing:** `18, 22, 88, 100, 112, 128`
- **Custom screens:** `xs: 480px`, `2xl: 1400px`
- **Custom container:** centered with responsive padding
- **Inter** font via `next/font/google`

---

## Component Inventory

### Atomic Primitives (`apps/web/src/components/ui/`)

| Component | File | Key API |
|-----------|------|---------|
| Button | `button.tsx` | `variant`, `size`, `asChild`, `isLoading` |
| Badge | `badge.tsx` | `variant` (default/secondary/success/destructive/warning/outline) |
| Avatar | `avatar.tsx` | `size` (sm/default/lg/xl), `AvatarImage`, `AvatarFallback` |
| Spinner | `spinner.tsx` | `variant` (default/white/gray), `size` |
| Skeleton | `skeleton.tsx` | `SkeletonCard`, `SkeletonListingCard` presets |
| Card | `card.tsx` | `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription` |
| Separator | `separator.tsx` | `orientation` (horizontal/vertical) |
| Tooltip | `tooltip.tsx` | `TooltipProvider`, `TooltipTrigger`, `TooltipContent` |

### Form Components (`apps/web/src/components/ui/`)

| Component | File | Key API |
|-----------|------|---------|
| Label | `label.tsx` | `required` asterisk |
| Input | `input.tsx` | `leftIcon`, `rightIcon`, `error` |
| Textarea | `textarea.tsx` | `error`, `resize-y` |
| Select | `select.tsx` | Full Radix family, `error` on trigger |
| Checkbox | `checkbox.tsx` | `CheckboxWithLabel` compound, `description` |

### Overlay Components (`apps/web/src/components/ui/`)

| Component | File | Key API |
|-----------|------|---------|
| Dialog | `dialog.tsx` | Radix, backdrop blur, `DialogHeader/Footer/Title/Description/Close` |
| DropdownMenu | `dropdown-menu.tsx` | Full Radix, sub-menus, radio/checkbox items, shortcut |
| Tabs | `tabs.tsx` | Radix, pill style, `TabsList/Trigger/Content` |
| Pagination | `pagination.tsx` | `currentPage/totalPages/onPageChange`, `PaginationInfo` |
| ScrollArea | `scroll-area.tsx` | Radix, branded scrollbar |

### Layout Components (`apps/web/src/components/layout/`)

| Component | Purpose |
|-----------|---------|
| `header/header.tsx` | Sticky header, scroll shadow, logo, desktop nav, mobile hamburger |
| `header/nav-config.ts` | NAV_LINKS and USER_MENU_LINKS data |
| `header/user-menu.tsx` | Avatar dropdown with user account links + logout |
| `header/mobile-menu.tsx` | Radix Dialog slide-out with nested nav, expandable sections, auth |
| `footer.tsx` | 4-column grid, social, app store CTAs, bottom legal bar |
| `page-wrapper.tsx` | `noPadding`, `contained`, `hideFooter` variants |

### State (`apps/web/src/store/`)

| Store | File | Purpose |
|-------|------|---------|
| Auth | `auth.store.ts` | Zustand + persist. `user`, `accessToken`, `isAuthenticated`. `setAuth/clearAuth/setLoading` |

---

## Architecture Decisions

1. **shadcn/ui pattern** — All components use CVA + forwardRef + Radix primitives. Same API as shadcn/ui so dropping in shadcn components later is zero-friction.

2. **All components in `apps/web`** — Not in `packages/ui` yet. The shared `packages/ui` package only exports `cn()`. Components move there only if the mobile app also needs them, avoiding premature abstraction.

3. **No barrel re-exports from layout to UI** — `@/components/ui` and `@/components/layout` are separate import paths to keep tree-shaking clean.

4. **Zustand auth store persisted to localStorage** — Simple and works without a cookie setup. Phase 2 will flesh out real token management with httpOnly cookies for production security.

5. **Mobile menu as Dialog** — Uses Radix Dialog with `fixed inset-y-0 left-0` CSS to achieve slide-in behavior without a separate sheet component.

6. **Homepage uses only skeleton placeholders** — Sections for Featured Cars and Popular Makes render `SkeletonListingCard` / `Skeleton` grids. Real data connects in Phase 4 (Listings) and Phase 3 (Reference Data).

---

## File Structure

```
apps/web/src/
├── app/
│   ├── globals.css           Design tokens (CSS vars + Tailwind layers)
│   ├── layout.tsx            Root layout (Inter font, Providers, metadata)
│   └── page.tsx              Homepage (Hero, stats, skeletons, features, CTA)
├── components/
│   ├── ui/
│   │   ├── index.ts          Barrel export for all 18 components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── spinner.tsx
│   │   ├── skeleton.tsx
│   │   ├── card.tsx
│   │   ├── separator.tsx
│   │   ├── tooltip.tsx
│   │   ├── label.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── pagination.tsx
│   │   └── scroll-area.tsx
│   └── layout/
│       ├── index.ts
│       ├── page-wrapper.tsx
│       ├── footer.tsx
│       └── header/
│           ├── header.tsx
│           ├── nav-config.ts
│           ├── user-menu.tsx
│           └── mobile-menu.tsx
├── lib/
│   └── utils.ts              cn() helper
└── store/
    └── auth.store.ts         Zustand auth state
```

---

## Next Step

**Phase 2 — Authentication**: Build the NestJS auth module (register, login, JWT, refresh token, email verification, password reset) + all frontend auth pages (login, register, forgot password).
