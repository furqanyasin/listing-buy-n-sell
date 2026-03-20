export interface ReviewAuthor {
  id: string
  name: string
  avatarUrl: string | null
}

export interface Review {
  id: string
  rating: number
  body: string | null
  createdAt: string
  reviewer: ReviewAuthor
}

export interface ReviewsResponse {
  reviews: Review[]
  averageRating: number | null
  count: number
}

export interface CreateReviewRequest {
  targetUserId?: string
  targetDealerId?: string
  rating: number
  body?: string
}
