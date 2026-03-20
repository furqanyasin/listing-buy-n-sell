'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Eye, Tag } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useBlogPosts, useBlogCategories } from '@/lib/hooks/use-blog'
import { cn } from '@/lib/utils'
import type { BlogPostCard } from '@pw-clone/types'

function BlogCard({ post }: { post: BlogPostCard }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="border border-surface-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
        <div className="relative aspect-video bg-surface-100">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Tag className="h-10 w-10 text-surface-300" />
            </div>
          )}
          {post.category && (
            <Badge className="absolute top-3 left-3" variant="secondary">
              {post.category}
            </Badge>
          )}
        </div>

        <div className="p-5">
          <h2 className="font-semibold text-surface-900 text-lg leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm text-surface-500 mt-2 line-clamp-2">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between mt-4 text-xs text-surface-400">
            <div className="flex items-center gap-1.5">
              {post.author.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span>{post.author.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.viewsCount}
              </span>
              {post.publishedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const { data: posts, isLoading } = useBlogPosts(selectedCategory)
  const { data: categories } = useBlogCategories()

  return (
    <PageWrapper contained>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900">Blog</h1>
          <p className="text-surface-500 mt-2">News, tips, and insights from the automotive world</p>
        </div>

        {/* Category filter */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                !selectedCategory
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'text-surface-600 border-surface-200 hover:border-brand-400',
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? undefined : cat)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'text-surface-600 border-surface-200 hover:border-brand-400',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-surface-100">
                <Skeleton className="aspect-video" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-2/5 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-surface-400">
            <Tag className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No blog posts yet</p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
