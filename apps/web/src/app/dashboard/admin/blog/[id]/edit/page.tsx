'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAdminBlogPost, useUpdateBlogPost } from '@/lib/hooks/use-blog'

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase kebab-case only'),
  excerpt: z.string().optional(),
  body: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

type FormData = z.infer<typeof schema>

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: post, isLoading } = useAdminBlogPost(id)
  const updateMutation = useUpdateBlogPost(id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        body: post.body,
        coverImage: post.coverImage ?? '',
        category: post.category ?? '',
        tags: post.tags?.join(', ') ?? '',
        status: post.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
      })
    }
  }, [post, reset])

  function onSubmit(data: FormData) {
    updateMutation.mutate(
      {
        ...data,
        coverImage: data.coverImage || undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      },
      {
        onSuccess: () => router.push('/dashboard/admin/blog'),
      },
    )
  }

  if (isLoading) {
    return (
      <PageWrapper contained>
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-surface-900 mb-6">Edit Blog Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label required>Title</Label>
            <Input {...register('title')} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label required>Slug</Label>
            <Input {...register('slug')} />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <Label>Excerpt</Label>
            <textarea
              {...register('excerpt')}
              rows={2}
              className="w-full rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
            />
          </div>

          <div>
            <Label required>Body</Label>
            <textarea
              {...register('body')}
              rows={12}
              className="w-full rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y font-mono"
            />
            {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
          </div>

          <div>
            <Label>Cover Image URL</Label>
            <Input {...register('coverImage')} type="url" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Input {...register('category')} />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input {...register('tags')} />
            </div>
          </div>

          <div>
            <Label required>Status</Label>
            <select
              {...register('status')}
              className="w-full rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={updateMutation.isPending} className="flex-1">
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/admin/blog')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  )
}
