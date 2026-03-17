import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message displayed below the textarea with red styling */
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <textarea
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base
            'flex w-full rounded-lg border bg-white px-3 py-2 text-sm text-surface-900',
            'min-h-[100px] resize-y',
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
            className,
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
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

Textarea.displayName = 'Textarea'

export { Textarea }
