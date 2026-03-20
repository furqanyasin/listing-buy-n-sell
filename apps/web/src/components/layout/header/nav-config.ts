export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

export const NAV_LINKS: NavLink[] = [
  {
    label: 'Buy Machines',
    href: '/cars',
  },
  {
    label: 'New Machines',
    href: '/new-cars',
    children: [
      { label: 'Browse New Machines', href: '/new-cars' },
      { label: 'Compare Machines', href: '/new-cars/compare' },
      { label: 'Machine Reviews', href: '/new-cars/reviews' },
    ],
  },
  {
    label: 'Suppliers',
    href: '/dealers',
  },
  {
    label: 'Prices',
    href: '/prices',
    children: [
      { label: 'Price Guide', href: '/prices' },
      { label: 'Used Machine Prices', href: '/prices/used' },
      { label: 'New Machine Prices', href: '/prices/new' },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
]

export const USER_MENU_LINKS = [
  { label: 'My Dashboard', href: '/dashboard' },
  { label: 'My Listings', href: '/dashboard/ads' },
  { label: 'Saved Machines', href: '/dashboard/saved' },
  { label: 'Messages', href: '/dashboard/messages' },
  { label: 'Account Settings', href: '/dashboard/settings' },
]
