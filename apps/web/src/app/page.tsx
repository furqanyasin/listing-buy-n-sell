import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton, SkeletonListingCard } from '@/components/ui/skeleton'
import Link from 'next/link'
import {
  Car,
  Search,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
} from 'lucide-react'

// ─── Feature cards ────────────────────────────────────────────────────────────

const features = [
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Find your perfect car with advanced filters — make, model, year, city, and more.',
  },
  {
    icon: Shield,
    title: 'Verified Listings',
    desc: 'Every listing is reviewed. Inspections available for buyer confidence.',
  },
  {
    icon: TrendingUp,
    title: 'Price Guide',
    desc: 'Know the fair market value before you buy or sell any vehicle.',
  },
  {
    icon: Star,
    title: 'Trusted Dealers',
    desc: 'Verified dealers with ratings, reviews, and full inventory access.',
  },
]

// ─── Hero search bar (placeholder — real search in Phase 5) ──────────────────

function HeroSearchBar() {
  return (
    <div className="bg-white rounded-2xl shadow-modal p-2 flex flex-col sm:flex-row gap-2">
      <div className="flex-1 flex items-center gap-3 px-4 py-2 border border-surface-200 rounded-xl">
        <Car className="h-5 w-5 text-surface-400 shrink-0" />
        <input
          type="text"
          placeholder="Search by make, model or keyword..."
          className="flex-1 text-sm outline-none text-surface-800 placeholder:text-surface-400 bg-transparent"
        />
      </div>
      <Button size="lg" className="sm:px-8 rounded-xl gap-2" asChild>
        <Link href="/cars">
          <Search className="h-4 w-4" />
          Search Cars
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
              🚗 Pakistan&apos;s #1 Automotive Marketplace
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance">
              Buy & Sell Cars{' '}
              <span className="text-brand-400">with Confidence</span>
            </h1>

            <p className="text-surface-300 text-lg sm:text-xl mb-10 leading-relaxed">
              Thousands of verified car listings across Pakistan. Find the perfect
              deal or reach millions of buyers instantly.
            </p>

            <HeroSearchBar />

            <p className="mt-4 text-surface-400 text-sm">
              Popular:{' '}
              {['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'KIA Sportage'].map(
                (car, i) => (
                  <span key={car}>
                    <Link
                      href={`/cars?q=${encodeURIComponent(car)}`}
                      className="text-surface-300 hover:text-white underline underline-offset-2 transition-colors"
                    >
                      {car}
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
              { value: '50,000+', label: 'Active Listings' },
              { value: '1,200+', label: 'Verified Dealers' },
              { value: '100+', label: 'Cities' },
              { value: '2M+', label: 'Monthly Visitors' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-extrabold">{stat.value}</p>
                <p className="text-brand-100 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings placeholder */}
      <section className="container mx-auto py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Featured Cars</h2>
            <p className="text-surface-500 text-sm mt-1">Hand-picked deals this week</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cars" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Skeleton placeholders — real listings in Phase 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonListingCard key={i} />
          ))}
        </div>
      </section>

      {/* Popular makes placeholder */}
      <section className="bg-surface-100 py-14">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-surface-900 mb-8 text-center">
            Browse by Brand
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto py-14">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-surface-900">Why PW Clone?</h2>
          <p className="text-surface-500 mt-2">
            Everything you need to buy or sell cars in Pakistan
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
          <h2 className="text-3xl font-extrabold mb-4">Ready to Sell Your Car?</h2>
          <p className="text-brand-100 text-lg mb-8">
            Post a free ad and reach millions of buyers across Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-brand-50"
              asChild
            >
              <Link href="/post-ad">Post a Free Ad</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/cars">Browse Cars</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
