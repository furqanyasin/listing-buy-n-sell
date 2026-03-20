import { apiClient } from './client'
import type { BlogPost, BlogPostCard, CreateBlogPostRequest, UpdateBlogPostRequest } from '@pw-clone/types'

export async function getBlogPostsApi(category?: string): Promise<BlogPostCard[]> {
  const params = category ? { category } : {}
  const res = await apiClient.get<{ data: BlogPostCard[] }>('/blog', { params })
  return res.data.data
}

export async function getBlogCategoriesApi(): Promise<string[]> {
  const res = await apiClient.get<{ data: string[] }>('/blog/categories')
  return res.data.data
}

export async function getBlogPostApi(slug: string): Promise<BlogPost> {
  const res = await apiClient.get<{ data: BlogPost }>(`/blog/${slug}`)
  return res.data.data
}

export async function getAdminBlogPostsApi(): Promise<BlogPostCard[]> {
  const res = await apiClient.get<{ data: BlogPostCard[] }>('/blog/admin/all')
  return res.data.data
}

export async function getAdminBlogPostByIdApi(id: string): Promise<BlogPost> {
  const res = await apiClient.get<{ data: BlogPost }>(`/blog/admin/${id}`)
  return res.data.data
}

export async function createBlogPostApi(dto: CreateBlogPostRequest): Promise<BlogPost> {
  const res = await apiClient.post<{ data: BlogPost }>('/blog', dto)
  return res.data.data
}

export async function updateBlogPostApi(id: string, dto: UpdateBlogPostRequest): Promise<BlogPost> {
  const res = await apiClient.patch<{ data: BlogPost }>(`/blog/${id}`, dto)
  return res.data.data
}

export async function deleteBlogPostApi(id: string): Promise<void> {
  await apiClient.delete(`/blog/${id}`)
}
