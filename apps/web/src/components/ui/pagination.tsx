import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Page range calculation ───────────────────────────────────────────────────

function generatePageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  // Total slots: siblingCount * 2 + first + last + current + 2 ellipsis = siblingCount*2 + 5
  const totalPageNumbers = siblingCount * 2 + 5

  // If total pages fit in one view, return all
  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

  const shouldShowLeftEllipsis = leftSiblingIndex > 2
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1

  const firstPageIndex = 1
  const lastPageIndex = totalPages

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
    return [...leftRange, 'ellipsis-end', totalPages]
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    )
    return [firstPageIndex, 'ellipsis-start', ...rightRange]
  }

  // Both ellipsis
  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i,
  )
  return [
    firstPageIndex,
    'ellipsis-start',
    ...middleRange,
    'ellipsis-end',
    lastPageIndex,
  ]
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      className,
    },
    ref,
  ) => {
    if (totalPages <= 1) return null

    const pageRange = generatePageRange(currentPage, totalPages, siblingCount)

    const isFirst = currentPage <= 1
    const isLast = currentPage >= totalPages

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn('flex items-center justify-center gap-1', className)}
      >
        {/* Previous */}
        <button
          onClick={() => !isFirst && onPageChange(currentPage - 1)}
          disabled={isFirst}
          aria-label="Go to previous page"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-surface-600',
            'border border-surface-200 bg-white',
            'transition-colors duration-150',
            'hover:bg-surface-50 hover:text-surface-900',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
            'disabled:pointer-events-none disabled:opacity-40',
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pageRange.map((page, idx) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={`${page}-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-surface-400 select-none"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <button
              key={page}
              onClick={() => !isActive && onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium',
                'border transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
                isActive
                  ? 'bg-brand-500 border-brand-500 text-white shadow-sm cursor-default'
                  : 'border-surface-200 bg-white text-surface-700 hover:bg-surface-50 hover:text-surface-900',
              )}
            >
              {page}
            </button>
          )
        })}

        {/* Next */}
        <button
          onClick={() => !isLast && onPageChange(currentPage + 1)}
          disabled={isLast}
          aria-label="Go to next page"
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-surface-600',
            'border border-surface-200 bg-white',
            'transition-colors duration-150',
            'hover:bg-surface-50 hover:text-surface-900',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
            'disabled:pointer-events-none disabled:opacity-40',
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    )
  },
)
Pagination.displayName = 'Pagination'

// ─── PaginationInfo ───────────────────────────────────────────────────────────

export interface PaginationInfoProps {
  currentPage: number
  pageSize: number
  totalItems: number
  className?: string
}

const PaginationInfo = ({
  currentPage,
  pageSize,
  totalItems,
  className,
}: PaginationInfoProps) => {
  const from = Math.min((currentPage - 1) * pageSize + 1, totalItems)
  const to = Math.min(currentPage * pageSize, totalItems)

  return (
    <p className={cn('text-sm text-surface-500', className)}>
      Showing{' '}
      <span className="font-medium text-surface-700">
        {from}–{to}
      </span>{' '}
      of{' '}
      <span className="font-medium text-surface-700">
        {totalItems.toLocaleString()}
      </span>{' '}
      results
    </p>
  )
}
PaginationInfo.displayName = 'PaginationInfo'

export { Pagination, PaginationInfo }
