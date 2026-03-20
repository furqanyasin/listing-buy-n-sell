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
    default: 'CNC Machine Bazaar — Buy & Sell Industrial Machinery',
    template: '%s | CNC Machine Bazaar',
  },
  description:
    'Pakistan\'s leading industrial machinery marketplace. Buy, sell, and discover CNC machines, laser cutters, and equipment worldwide.',
  keywords: ['cnc machines', 'industrial machinery', 'laser cutter', 'cnc mill', 'cnc lathe', 'used machines', 'pakistan'],
  authors: [{ name: 'CNC Machine Bazaar' }],
  creator: 'CNC Machine Bazaar',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'CNC Machine Bazaar',
    title: 'CNC Machine Bazaar — Buy & Sell Industrial Machinery',
    description: 'Pakistan\'s leading industrial machinery marketplace.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CNC Machine Bazaar',
    description: 'Pakistan\'s leading industrial machinery marketplace.',
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
