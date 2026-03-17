import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Card ──────────────────────────────────────────────────────────────────────

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-surface-200 bg-white',
      'shadow-card transition-shadow duration-200 hover:shadow-card-hover',
      className,
    )}
    {...props}
  />
))

Card.displayName = 'Card'

// ─── CardHeader ────────────────────────────────────────────────────────────────

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col gap-1.5 px-6 pt-6', className)}
    {...props}
  />
))

CardHeader.displayName = 'CardHeader'

// ─── CardContent ───────────────────────────────────────────────────────────────

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('px-6 py-4', className)}
    {...props}
  />
))

CardContent.displayName = 'CardContent'

// ─── CardFooter ────────────────────────────────────────────────────────────────

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center px-6 pb-6 pt-0', className)}
    {...props}
  />
))

CardFooter.displayName = 'CardFooter'

// ─── CardTitle ─────────────────────────────────────────────────────────────────

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-tight tracking-tight text-surface-900',
      className,
    )}
    {...props}
  />
))

CardTitle.displayName = 'CardTitle'

// ─── CardDescription ──────────────────────────────────────────────────────────

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-surface-500 leading-relaxed', className)}
    {...props}
  />
))

CardDescription.displayName = 'CardDescription'

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }
