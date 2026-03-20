import { apiClient } from './client'
import type { CreateReviewRequest, ReviewsResponse } from '@pw-clone/types'

export async function createReviewApi(dto: CreateReviewRequest) {
  const res = await apiClient.post('/reviews', dto)
  return res.data.data
}

export async function getUserReviewsApi(userId: string): Promise<ReviewsResponse> {
  const res = await apiClient.get<{ data: ReviewsResponse }>(`/reviews/user/${userId}`)
  return res.data.data
}

export async function getDealerReviewsApi(dealerId: string): Promise<ReviewsResponse> {
  const res = await apiClient.get<{ data: ReviewsResponse }>(`/reviews/dealer/${dealerId}`)
  return res.data.data
}
