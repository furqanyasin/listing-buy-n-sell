import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Checkbox ─────────────────────────────────────────────────────────────────

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded border border-surface-300 bg-white',
      'transition-colors duration-150',
      // Focus
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
      // Checked state
      'data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 data-[state=checked]:text-white',
      // Indeterminate state
      'data-[state=indeterminate]:bg-brand-500 data-[state=indeterminate]:border-brand-500 data-[state=indeterminate]:text-white',
      // Disabled
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-3 w-3 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// ─── CheckboxWithLabel ────────────────────────────────────────────────────────

export interface CheckboxWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Label text rendered next to the checkbox */
  label: React.ReactNode
  /** Optional description rendered below the label in muted text */
  description?: React.ReactNode
  /** ID used to associate the label with the checkbox (auto-generated if omitted) */
  id?: string
}

const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({ label, description, id, className, ...props }, ref) => {
  const generatedId = React.useId()
  const checkboxId = id ?? generatedId

  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <Checkbox ref={ref} id={checkboxId} {...props} />
      <div className="grid gap-0.5 leading-none">
        <label
          htmlFor={checkboxId}
          className="text-sm font-medium text-surface-700 cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-surface-500">{description}</p>
        )}
      </div>
    </div>
  )
})
CheckboxWithLabel.displayName = 'CheckboxWithLabel'

export { Checkbox, CheckboxWithLabel }
