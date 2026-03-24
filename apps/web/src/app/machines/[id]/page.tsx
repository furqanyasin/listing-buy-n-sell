import type { Metadata } from 'next'
import { ListingDetailClient } from './listing-detail-client'

type Props = { params: Promise<{ id: string }> }

// ─── SEO metadata ─────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

  try {
    const res = await fetch(`${apiUrl}/listings/${id}`, {
      next: { revalidate: 300 }, // cache 5 min
    })
    if (!res.ok) return { title: 'Listing Not Found — CNC Machine Bazaar' }

    const json = await res.json()
    const listing = json.data ?? json

    const title = `${listing.title} — CNC Machine Bazaar`
    const description = (listing.description ?? '').slice(0, 155)
    const image: string | undefined = listing.images?.[0]?.url

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: image ? [{ url: image, width: 1280, height: 960 }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : [],
      },
    }
  } catch {
    return { title: 'Machine Listing — CNC Machine Bazaar' }
  }
}

// ─── Schema.org Product markup ────────────────────────────────────────────────

async function getListingForSchema(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'
    const res = await fetch(`${apiUrl}/listings/${id}`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? json
  } catch {
    return null
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  const listing = await getListingForSchema(id)

  const schema = listing
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: listing.title,
        description: listing.description,
        brand: { '@type': 'Brand', name: listing.make?.name },
        model: listing.model?.name,
        productionDate: listing.year?.toString(),
        itemCondition:
          listing.condition === 'NEW'
            ? 'https://schema.org/NewCondition'
            : 'https://schema.org/UsedCondition',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price: listing.price,
          availability: 'https://schema.org/InStock',
          url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cncmachinebazaar.com'}/machines/${id}`,
        },
        image: listing.images?.[0]?.url,
      }
    : null

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ListingDetailClient id={id} />
    </>
  )
}
