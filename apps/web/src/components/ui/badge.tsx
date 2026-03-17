import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-full px-2.5 py-0.5',
    'text-xs font-semibold leading-none',
    'transition-colors duration-150',
    'select-none',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-brand-500 text-white',
        secondary:
          'bg-surface-100 text-surface-700',
        success:
          'bg-green-100 text-green-800',
        destructive:
          'bg-red-100 text-red-700',
        warning:
          'bg-yellow-100 text-yellow-800',
        outline:
          'border border-surface-300 text-surface-700 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, className }))}
        {...props}
      />
    )
  },
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
