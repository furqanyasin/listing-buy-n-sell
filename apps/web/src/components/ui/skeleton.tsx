import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Base Skeleton ─────────────────────────────────────────────────────────────

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-md bg-surface-200', className)}
      {...props}
    />
  ),
)

Skeleton.displayName = 'Skeleton'

// ─── SkeletonCard ──────────────────────────────────────────────────────────────
// Generic card preset: image area + 3 text lines

const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-surface-200 bg-white p-4 shadow-card space-y-3',
      className,
    )}
    {...props}
  >
    {/* Image placeholder */}
    <Skeleton className="h-40 w-full rounded-lg" />
    {/* Title */}
    <Skeleton className="h-4 w-3/4" />
    {/* Subtitle */}
    <Skeleton className="h-3 w-1/2" />
    {/* Body line */}
    <Skeleton className="h-3 w-5/6" />
  </div>
))

SkeletonCard.displayName = 'SkeletonCard'

// ─── SkeletonListingCard ───────────────────────────────────────────────────────
// Preset for car listing card: image + title + price + specs row

const SkeletonListingCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-surface-200 bg-white overflow-hidden shadow-card',
      className,
    )}
    {...props}
  >
    {/* Car image area */}
    <Skeleton className="h-48 w-full rounded-none" />

    <div className="p-4 space-y-3">
      {/* Car title (e.g. "Toyota Corolla 2022") */}
      <Skeleton className="h-5 w-3/4" />

      {/* Price */}
      <Skeleton className="h-6 w-1/3" />

      {/* Specs row — 3 small chips side by side */}
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>

      {/* Location + date line */}
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
))

SkeletonListingCard.displayName = 'SkeletonListingCard'

export { Skeleton, SkeletonCard, SkeletonListingCard }
