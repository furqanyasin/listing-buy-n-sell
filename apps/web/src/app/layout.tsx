import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PW Clone — Buy & Sell Cars in Pakistan',
    template: '%s | PW Clone',
  },
  description:
    'Pakistan\'s leading automotive marketplace. Buy, sell, and discover cars, bikes, and vehicles.',
  keywords: ['cars', 'vehicles', 'pakistan', 'buy car', 'sell car', 'used cars'],
  authors: [{ name: 'PW Clone' }],
  creator: 'PW Clone',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'PW Clone',
    title: 'PW Clone — Buy & Sell Cars in Pakistan',
    description: 'Pakistan\'s leading automotive marketplace.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PW Clone',
    description: 'Pakistan\'s leading automotive marketplace.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
