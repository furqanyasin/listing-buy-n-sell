import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, Tag } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { BlogPostClient } from './blog-post-client'

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'
    const res = await fetch(`${baseUrl}/blog/${slug}`, { next: { revalidate: 300 } })
    if (!res.ok) return { title: 'Blog | CNC Machine Bazaar' }
    const json = await res.json()
    const post = json.data
    return {
      title: `${post.title} | CNC Machine Bazaar Blog`,
      description: post.excerpt ?? post.body?.substring(0, 160),
      openGraph: {
        title: post.title,
        description: post.excerpt ?? undefined,
        images: post.coverImage ? [post.coverImage] : [],
      },
    }
  } catch {
    return { title: 'Blog | CNC Machine Bazaar' }
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <PageWrapper contained>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>
        <Suspense fallback={<BlogPostSkeleton />}>
          <BlogPostClient slug={slug} />
        </Suspense>
      </div>
    </PageWrapper>
  )
}

function BlogPostSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="aspect-video rounded-2xl" />
      <div className="space-y-2 pt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  )
}
