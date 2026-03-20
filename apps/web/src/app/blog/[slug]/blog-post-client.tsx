'use client'

import Image from 'next/image'
import { Calendar, Eye, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useBlogPost } from '@/lib/hooks/use-blog'

export function BlogPostClient({ slug }: { slug: string }) {
  const { data: post, isLoading, isError } = useBlogPost(slug)

  if (isLoading) {
    return (
      <div className="py-20 text-center text-surface-400 text-sm">Loading...</div>
    )
  }

  if (isError || !post) {
    return (
      <div className="py-20 text-center text-surface-400">
        <p className="font-medium">Post not found.</p>
      </div>
    )
  }

  return (
    <article>
      {/* Title */}
      <h1 className="text-3xl font-bold text-surface-900 leading-tight">{post.title}</h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-surface-400">
        <div className="flex items-center gap-2">
          {post.author.avatarUrl ? (
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium text-surface-700">{post.author.name}</span>
        </div>
        {post.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString('en-PK', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          {post.viewsCount} views
        </span>
        {post.category && (
          <Badge variant="secondary">
            <Tag className="h-3 w-3 mr-1" />
            {post.category}
          </Badge>
        )}
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative aspect-video rounded-2xl overflow-hidden mt-6 bg-surface-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="mt-6 text-lg text-surface-600 font-medium italic border-l-4 border-brand-400 pl-4">
          {post.excerpt}
        </p>
      )}

      {/* Body (rendered as prose) */}
      <div className="mt-8 prose prose-surface max-w-none text-surface-800 leading-relaxed whitespace-pre-wrap">
        {post.body}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-surface-100">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </article>
  )
}
