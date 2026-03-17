import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-surface-100 bg-white">
        <div className="container mx-auto h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <span className="text-white font-black text-base">PW</span>
            </div>
            <span className="font-extrabold text-surface-900 text-lg tracking-tight">
              PW Clone
            </span>
          </Link>
          <Link href="/cars" className="text-sm text-surface-500 hover:text-surface-900 transition-colors">
            Browse Cars
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>

      {/* Footer note */}
      <div className="text-center py-4 text-xs text-surface-400">
        © {new Date().getFullYear()} PW Clone ·
        <Link href="/privacy" className="hover:text-surface-600 ml-1">Privacy</Link> ·
        <Link href="/terms" className="hover:text-surface-600 ml-1">Terms</Link>
      </div>
    </div>
  )
}
