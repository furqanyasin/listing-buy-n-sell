'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createBlogPostApi,
  deleteBlogPostApi,
  getAdminBlogPostByIdApi,
  getAdminBlogPostsApi,
  getBlogCategoriesApi,
  getBlogPostApi,
  getBlogPostsApi,
  updateBlogPostApi,
} from '@/lib/api/blog'
import type { CreateBlogPostRequest, UpdateBlogPostRequest } from '@pw-clone/types'

export function useBlogPosts(category?: string) {
  return useQuery({
    queryKey: ['blog', 'posts', category ?? 'all'],
    queryFn: () => getBlogPostsApi(category),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: getBlogCategoriesApi,
    staleTime: 10 * 60 * 1000,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: () => getBlogPostApi(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminBlogPosts() {
  return useQuery({
    queryKey: ['blog', 'admin', 'all'],
    queryFn: getAdminBlogPostsApi,
  })
}

export function useAdminBlogPost(id: string) {
  return useQuery({
    queryKey: ['blog', 'admin', id],
    queryFn: () => getAdminBlogPostByIdApi(id),
    enabled: !!id,
  })
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateBlogPostRequest) => createBlogPostApi(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Blog post created')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to create post')
    },
  })
}

export function useUpdateBlogPost(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: UpdateBlogPostRequest) => updateBlogPostApi(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Blog post updated')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to update post')
    },
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBlogPostApi(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Blog post deleted')
    },
    onError: () => toast.error('Failed to delete post'),
  })
}
