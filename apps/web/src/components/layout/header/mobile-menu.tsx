'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { NAV_LINKS, USER_MENU_LINKS } from './nav-config'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { isAuthenticated, user, clearAuth } = useAuthStore()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )
  }

  const handleLogout = () => {
    clearAuth()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="fixed inset-y-0 left-0 h-full w-[85vw] max-w-sm rounded-none border-r shadow-2xl p-0 flex flex-col gap-0"
        style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">CMB</span>
            </div>
            <span className="font-bold text-surface-900 text-lg">CNC Machine Bazaar</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-surface-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_LINKS.map((link) => {
            const isExpanded = expandedItems.includes(link.label)
            const isActive = pathname.startsWith(link.href)

            if (link.children?.length) {
              return (
                <div key={link.label}>
                  <button
                    onClick={() => toggleExpand(link.label)}
                    className={cn(
                      'flex items-center justify-between w-full px-5 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-brand-600 bg-brand-50'
                        : 'text-surface-700 hover:text-surface-900 hover:bg-surface-50',
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="bg-surface-50 border-y border-surface-100">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center gap-2 pl-10 pr-5 py-2.5 text-sm transition-colors',
                            pathname === child.href
                              ? 'text-brand-600 font-medium'
                              : 'text-surface-600 hover:text-surface-900',
                          )}
                        >
                          <ChevronRight className="h-3.5 w-3.5 text-surface-400" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  'flex items-center w-full px-5 py-3 text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-brand-600 bg-brand-50 border-l-2 border-brand-500'
                    : 'text-surface-700 hover:text-surface-900 hover:bg-surface-50',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* Auth section */}
        <div className="p-5 space-y-3">
          {isAuthenticated && user ? (
            <>
              <div className="px-1 py-2">
                <p className="text-sm font-semibold text-surface-900">{user.name}</p>
                <p className="text-xs text-surface-500">{user.email}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                {USER_MENU_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center w-full px-3 py-2 text-sm text-surface-700 hover:text-surface-900 hover:bg-surface-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="w-full" asChild onClick={onClose}>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className="w-full" asChild onClick={onClose}>
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
