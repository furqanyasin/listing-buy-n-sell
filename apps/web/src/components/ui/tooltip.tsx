import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

// ─── Re-export Provider & Root ────────────────────────────────────────────────

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

// ─── TooltipContent ───────────────────────────────────────────────────────────

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        // Shape & color
        'z-50 rounded-md px-3 py-1.5',
        'bg-surface-900 text-white text-xs font-medium leading-snug',
        'shadow-modal',
        // Max width to prevent very wide tooltips
        'max-w-xs break-words',
        // Slide-in animations keyed on data-side attribute
        'data-[state=delayed-open]:animate-in data-[state=closed]:animate-out',
        'data-[state=delayed-open]:fade-in-0 data-[state=closed]:fade-out-0',
        'data-[state=delayed-open]:zoom-in-95 data-[state=closed]:zoom-out-95',
        'data-[side=top]:slide-in-from-bottom-2',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        className,
      )}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow
        className="fill-surface-900"
        width={10}
        height={5}
      />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
))

TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
