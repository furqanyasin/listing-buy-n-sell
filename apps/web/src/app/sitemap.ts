import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cncmachinebazaar.com'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const json = await res.json()
    return json.data as T
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/cars`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/dealers`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${BASE_URL}/post-ad`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Dynamic: listings
  const listings = await fetchJson<{ data: { id: string; updatedAt: string }[] }>('/listings?limit=1000')
  const listingRoutes: MetadataRoute.Sitemap = (listings?.data ?? []).map((l) => ({
    url: `${BASE_URL}/cars/${l.id}`,
    lastModified: new Date(l.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic: suppliers
  const dealers = await fetchJson<{ slug: string; updatedAt: string }[]>('/dealers')
  const dealerRoutes: MetadataRoute.Sitemap = (dealers ?? []).map((d) => ({
    url: `${BASE_URL}/dealers/${d.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Dynamic: blog posts
  const posts = await fetchJson<{ slug: string; publishedAt: string }[]>('/blog')
  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...listingRoutes, ...dealerRoutes, ...blogRoutes]
}
