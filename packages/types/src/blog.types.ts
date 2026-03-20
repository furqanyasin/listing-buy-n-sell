export interface BlogAuthor {
  id: string
  name: string
  avatarUrl: string | null
}

export interface BlogPostCard {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  category: string | null
  tags: string[]
  status?: string
  viewsCount: number
  publishedAt: string | null
  createdAt: string
  author: BlogAuthor
}

export interface BlogPost extends BlogPostCard {
  body: string
  status: string
  updatedAt: string
}

export interface CreateBlogPostRequest {
  title: string
  slug: string
  excerpt?: string
  body: string
  coverImage?: string
  category?: string
  tags?: string[]
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export interface UpdateBlogPostRequest extends Partial<CreateBlogPostRequest> {}
