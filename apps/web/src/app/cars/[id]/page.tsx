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
    if (!res.ok) return { title: 'Listing Not Found — PW Clone' }

    const json = await res.json()
    const listing = json.data ?? json

    const title = `${listing.title} — PW Clone`
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
    return { title: 'Car Listing — PW Clone' }
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params
  return <ListingDetailClient id={id} />
}
