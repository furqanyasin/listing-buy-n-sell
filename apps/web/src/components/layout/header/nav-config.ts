export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

export const NAV_LINKS: NavLink[] = [
  {
    label: 'Buy Machines',
    href: '/machines',
  },
  {
    label: 'Suppliers',
    href: '/suppliers',
  },
  {
    label: 'List Machine',
    href: '/list-machine',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
]

export const USER_MENU_LINKS = [
  { label: 'My Dashboard', href: '/dashboard' },
  { label: 'My Listings', href: '/dashboard' },
  { label: 'Saved Machines', href: '/dashboard/saved' },
  { label: 'Messages', href: '/dashboard/messages' },
  { label: 'Account Settings', href: '/dashboard/settings' },
]
