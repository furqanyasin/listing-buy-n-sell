'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createReviewApi, getDealerReviewsApi, getUserReviewsApi } from '@/lib/api/reviews'
import type { CreateReviewRequest } from '@pw-clone/types'

export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => getUserReviewsApi(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDealerReviews(dealerId: string) {
  return useQuery({
    queryKey: ['reviews', 'dealer', dealerId],
    queryFn: () => getDealerReviewsApi(dealerId),
    enabled: !!dealerId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateReview(targetId: string, type: 'user' | 'dealer') {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateReviewRequest) => createReviewApi(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['reviews', type, targetId],
      })
      toast.success('Review submitted')
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message ?? 'Failed to submit review')
    },
  })
}
