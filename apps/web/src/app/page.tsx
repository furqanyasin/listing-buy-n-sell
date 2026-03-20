import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FeaturedSection } from '@/components/listings/featured-section'
import { MakesSection } from '@/components/listings/makes-section'
import Link from 'next/link'
import { Cog, Search, Shield, TrendingUp, Star } from 'lucide-react'

// ─── Feature cards ────────────────────────────────────────────────────────────

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Find the right machine with advanced filters — brand, type, year, city, and more.',
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    desc: 'Every listing is reviewed. Inspections available for buyer confidence.',
  },
  {
    icon: TrendingUp,
    title: 'Price Guide',
    desc: 'Know the fair market value before you buy or sell any machine.',
  },
  {
    icon: Star,
    title: 'Trusted Suppliers',
    desc: 'Verified suppliers with ratings, reviews, and full inventory access.',
  },
]

// ─── Hero search bar ─────────────────────────────────────────────────────────

function HeroSearchBar() {
  return (
    <div className="bg-white rounded-2xl shadow-modal p-2 flex flex-col sm:flex-row gap-2">
      <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-surface-200 rounded-xl">
        <Cog className="h-5 w-5 text-surface-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by brand, type or keyword..."
          className="flex-1 text-sm outline-none text-surface-800 placeholder:text-surface-400 bg-transparent"
        />
      </div>
      <Button size="lg" className="sm:px-8 rounded-xl gap-2" asChild>
        <Link href="/cars">
          <Search className="h-4 w-4" />
          Search Machines
        </Link>
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <PageWrapper noPadding>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 75% 20%, #f97316 0%, transparent 40%)',
          }}
        />

        <div className="container mx-auto relative py-16 sm:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
              Pakistan&apos;s #1 Industrial Machinery Marketplace
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance">
              Buy & Sell Machines{' '}
              <span className="text-brand-400">with Confidence</span>
            </h1>

            <p className="text-surface-300 text-lg sm:text-xl mb-10 leading-relaxed">
              Thousands of verified machine listings. Find CNC mills, lathes, laser cutters
              and more — or reach buyers worldwide.
            </p>

            <HeroSearchBar />

            <p className="mt-4 text-surface-400 text-sm">
              Popular:{' '}
              {['Haas VF-2', 'Mazak Quick Turn', 'DMG Mori', 'Trumpf Laser'].map(
                (machine, i) => (
                  <span key={machine}>
                    <Link
                      href={`/cars?q=${encodeURIComponent(machine)}`}
                      className="text-surface-300 hover:text-white underline underline-offset-2 transition-colors"
                    >
                      {machine}
                    </Link>
                    {i < 3 && <span className="mx-2 text-surface-600">·</span>}
                  </span>
                ),
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="bg-brand-500">
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-white text-center">
            {[
              { value: '10,000+', label: 'Active Listings' },
              { value: '500+', label: 'Verified Suppliers' },
              { value: '50+', label: 'Cities' },
              { value: '500K+', label: 'Monthly Visitors' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold">{stat.value}</p>
                <p className="text-brand-100 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <FeaturedSection />

      {/* Browse by brand */}
      <MakesSection />

      {/* Features */}
      <section className="container mx-auto py-14">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-surface-900">Why CNC Machine Bazaar?</h2>
          <p className="text-surface-500 mt-2">
            Everything you need to buy or sell industrial machinery
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center hover:shadow-card-hover transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-brand-500" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-surface-500 leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-16">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Sell Your Machine?</h2>
          <p className="text-brand-100 text-lg mb-8">
            List your equipment for free and reach buyers across Pakistan and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-brand-50"
              asChild
            >
              <Link href="/post-ad">List Your Machine</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/cars">Browse Machines</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
