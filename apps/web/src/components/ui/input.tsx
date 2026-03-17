import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Error message displayed below the input with red styling */
  error?: string
  /** Icon rendered inside the left side of the input */
  leftIcon?: React.ReactNode
  /** Icon rendered inside the right side of the input */
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-surface-400">
              {leftIcon}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900',
              'placeholder:text-surface-400',
              'transition-colors duration-150',
              // Border default
              'border-surface-200',
              // Focus
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0 focus:border-brand-500',
              // Error
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-50',
              // Icon padding
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              className,
            )}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="pointer-events-none absolute right-3 flex items-center text-surface-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p
            id={props.id ? `${props.id}-error` : undefined}
            className="flex items-center gap-1 text-xs text-red-600"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
