'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from './nav-config'
import { UserMenu } from './user-menu'
import { MobileMenu } from './mobile-menu'
import { useAuthStore } from '@/store/auth.store'
import { useUnreadCount } from '@/lib/hooks/use-notifications'

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm">
        <span className="text-white font-black text-base leading-none">CMB</span>
      </div>
      <div className="hidden sm:flex flex-col leading-none">
        <span className="font-extrabold text-surface-900 text-lg tracking-tight">
          CNC Machine Bazaar
        </span>
        <span className="text-[10px] text-surface-400 font-medium tracking-widest uppercase">
          CNC · Laser · More
        </span>
      </div>
    </Link>
  )
}

// ─── Desktop Nav Link ─────────────────────────────────────────────────────────

function DesktopNavLink({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'relative text-sm font-medium transition-colors py-1 px-0.5',
        'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:transition-all after:duration-200',
        isActive
          ? 'text-brand-600 after:bg-brand-500'
          : 'text-surface-700 hover:text-surface-900 after:bg-transparent hover:after:bg-surface-300',
      )}
    >
      {label}
    </Link>
  )
}

// ─── Main Header ─────────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStore()
  const { data: unreadData } = useUnreadCount()
  const unreadCount = unreadData?.count ?? 0
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full bg-white transition-shadow duration-200',
          scrolled ? 'shadow-md' : 'border-b border-surface-100',
        )}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left — Logo */}
            <Logo />

            {/* Center — Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {NAV_LINKS.map((link) => (
                <DesktopNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href)
                  }
                />
              ))}
            </nav>

            {/* Right — Actions */}
            <div className="flex items-center gap-2">
              {/* Search icon — mobile / small screens */}
              <Button
                variant="ghost"
                size="icon"
                className="text-surface-600 lg:hidden"
                aria-label="Search"
                asChild
              >
                <Link href="/machines">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-surface-600 hidden sm:inline-flex"
                    aria-label="Notifications"
                    asChild
                  >
                    <Link href="/dashboard/notifications">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* List Machine */}
                  <Button size="sm" className="hidden sm:inline-flex gap-1.5" asChild>
                    <Link href="/list-machine">
                      <Plus className="h-4 w-4" />
                      List Machine
                    </Link>
                  </Button>

                  {/* User Avatar Menu */}
                  <UserMenu />
                </>
              ) : (
                <>
                  {/* Desktop auth buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:inline-flex text-surface-700"
                    asChild
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button size="sm" className="hidden lg:inline-flex" asChild>
                    <Link href="/auth/register">Register</Link>
                  </Button>
                  {/* Mobile: List Machine shortcut */}
                  <Button size="sm" className="lg:hidden gap-1.5" asChild>
                    <Link href="/list-machine">
                      <Plus className="h-4 w-4" />
                      <span className="hidden xs:inline">List Machine</span>
                    </Link>
                  </Button>
                </>
              )}

              {/* Mobile Hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-surface-700"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
