export interface NavLink {
  label: string
  href: string
  children?: NavLink[]
}

export const NAV_LINKS: NavLink[] = [
  {
    label: 'Buy Cars',
    href: '/cars',
  },
  {
    label: 'New Cars',
    href: '/new-cars',
    children: [
      { label: 'Browse New Cars', href: '/new-cars' },
      { label: 'Compare Cars', href: '/new-cars/compare' },
      { label: 'Car Reviews', href: '/new-cars/reviews' },
    ],
  },
  {
    label: 'Dealers',
    href: '/dealers',
  },
  {
    label: 'Prices',
    href: '/prices',
    children: [
      { label: 'Price Guide', href: '/prices' },
      { label: 'Used Car Prices', href: '/prices/used' },
      { label: 'New Car Prices', href: '/prices/new' },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
]

export const USER_MENU_LINKS = [
  { label: 'My Dashboard', href: '/dashboard' },
  { label: 'My Ads', href: '/dashboard/ads' },
  { label: 'Saved Cars', href: '/dashboard/saved' },
  { label: 'Messages', href: '/dashboard/messages' },
  { label: 'Account Settings', href: '/dashboard/settings' },
]
