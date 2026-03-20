'use client'

import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminBlogPosts, useDeleteBlogPost } from '@/lib/hooks/use-blog'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  PUBLISHED: 'default',
  DRAFT: 'secondary',
  ARCHIVED: 'outline',
}

export default function AdminBlogPage() {
  const { data: posts, isLoading } = useAdminBlogPosts()
  const deleteMutation = useDeleteBlogPost()

  return (
    <PageWrapper contained>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-surface-900">Blog Management</h1>
          <Button asChild>
            <Link href="/dashboard/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 border border-surface-100 rounded-xl hover:bg-surface-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-900 truncate">{post.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-surface-400">
                    <span>/{post.slug}</span>
                    {post.category && <span>· {post.category}</span>}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewsCount}
                    </span>
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[post.status ?? 'DRAFT'] ?? 'outline'}>
                  {post.status ?? 'DRAFT'}
                </Badge>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/admin/blog/${post.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      if (confirm('Delete this post?')) {
                        deleteMutation.mutate(post.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-surface-400">
            <p>No blog posts yet.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/admin/blog/new">Write your first post</Link>
            </Button>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
