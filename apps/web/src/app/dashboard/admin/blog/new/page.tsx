'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateBlogPost } from '@/lib/hooks/use-blog'

const schema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase kebab-case only'),
  excerpt: z.string().optional(),
  body: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']),
})

type FormData = z.infer<typeof schema>

export default function NewBlogPostPage() {
  const router = useRouter()
  const createMutation = useCreateBlogPost()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'DRAFT' },
  })

  const title = watch('title')

  function autoSlug() {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    setValue('slug', slug)
  }

  function onSubmit(data: FormData) {
    createMutation.mutate(
      {
        ...data,
        coverImage: data.coverImage || undefined,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        status: data.status as 'DRAFT' | 'PUBLISHED',
      },
      {
        onSuccess: () => router.push('/dashboard/admin/blog'),
      },
    )
  }

  return (
    <PageWrapper contained>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-surface-900 mb-6">New Blog Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label required>Title</Label>
            <Input {...register('title')} onBlur={autoSlug} placeholder="My awesome post" />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <Label required>Slug</Label>
            <Input {...register('slug')} placeholder="my-awesome-post" />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <Label>Excerpt</Label>
            <textarea
              {...register('excerpt')}
              rows={2}
              className="w-full rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
              placeholder="Short summary shown in listing cards"
            />
          </div>

          <div>
            <Label required>Body</Label>
            <textarea
              {...register('body')}
              rows={12}
              className="w-full rounded-xl border border-surface-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y font-mono"
              placeholder="Write your post content here..."
            />
            {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
          </div>

          <div>
            <Label>Cover Image URL</Label>
            <Input {...register('coverImage')} type="url" placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Input {...register('category')} placeholder="e.g. News, Tips" />
            </div>
            <div>
              <Label>Tags (comma-separated)</Label>
              <Input {...register('tags')} placeholder="toyota, review, 2024" />
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
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={createMutation.isPending} className="flex-1">
              {createMutation.isPending ? 'Creating...' : 'Create Post'}
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
