'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Car,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

const menuItems = [
  { label: 'My Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Ads', href: '/dashboard/ads', icon: Car },
  { label: 'Saved Cars', href: '/dashboard/saved', icon: Heart },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Account Settings', href: '/dashboard/settings', icon: Settings },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserMenu() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    clearAuth()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
    router.push('/')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-2 h-10 rounded-lg hover:bg-surface-100"
        >
          <Avatar size="sm">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:block text-sm font-medium text-surface-800 max-w-[120px] truncate">
            {user.name}
          </span>
          <ChevronDown className="h-4 w-4 text-surface-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-surface-900 truncate">{user.name}</span>
            <span className="text-xs text-surface-500 truncate">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn('flex items-center gap-2 cursor-pointer')}
              >
                <item.icon className="h-4 w-4 text-surface-500" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
