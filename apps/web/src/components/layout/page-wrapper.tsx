import { Header } from './header/header'
import { Footer } from './footer'
import { cn } from '@/lib/utils'

interface PageWrapperProps {
  children: React.ReactNode
  /** Remove default top padding (e.g. for hero pages with full-bleed images) */
  noPadding?: boolean
  /** Constrain content to container width */
  contained?: boolean
  /** Extra classes on the main element */
  className?: string
  /** Hide the footer (e.g. for auth pages, post-ad form) */
  hideFooter?: boolean
}

export function PageWrapper({
  children,
  noPadding = false,
  contained = false,
  className,
  hideFooter = false,
}: PageWrapperProps) {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <Header />

      <main
        className={cn(
          'flex-1',
          !noPadding && 'py-6 sm:py-8',
          className,
        )}
      >
        {contained ? (
          <div className="container mx-auto">{children}</div>
        ) : (
          children
        )}
      </main>

      {!hideFooter && <Footer />}
    </div>
  )
}
