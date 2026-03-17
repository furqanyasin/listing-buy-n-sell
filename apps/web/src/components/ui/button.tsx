import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles shared by all variants
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-lg text-sm font-semibold',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none',
  ],
  {
    variants: {
      variant: {
        default:
          'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm',
        secondary:
          'bg-surface-100 text-surface-800 hover:bg-surface-200 active:bg-surface-300 shadow-sm',
        outline:
          'border border-surface-200 bg-white text-surface-800 hover:bg-surface-50 hover:border-surface-300 active:bg-surface-100 shadow-sm',
        ghost:
          'text-surface-700 hover:bg-surface-100 hover:text-surface-900 active:bg-surface-200',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
        link: 'text-brand-500 underline-offset-4 hover:underline hover:text-brand-600 p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base rounded-xl',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the button as a child component (e.g. Next.js Link) */
  asChild?: boolean
  /** Show an inline spinner and disable the button */
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
