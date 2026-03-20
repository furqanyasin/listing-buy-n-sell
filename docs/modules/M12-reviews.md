# M12 — Reviews & Ratings

## Overview

Phase 12 adds a review system for sellers and dealers with star ratings and average score.

## Schema

`Review` — `reviewerId`, optional `targetUserId` or `targetDealerId`, `rating` (1-5 integer), optional `body`.

## Business Rules

- Either `targetUserId` or `targetDealerId` must be provided (not both)
- Cannot review yourself

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/reviews` | JWT | Leave review (user or dealer) |
| GET | `/reviews/user/:userId` | Public | Reviews for a user + avg rating |
| GET | `/reviews/dealer/:dealerId` | Public | Reviews for a dealer + avg rating |

Response shape: `{ reviews: Review[], averageRating: number | null, count: number }`

## Frontend

- `StarRow` component — 5-star display (filled/empty amber stars)
- `ReviewsSection` component on `/dealers/[slug]` — shows reviews + leave-review form (authenticated only)
- `useUserReviews(userId)`, `useDealerReviews(dealerId)`, `useCreateReview(targetId, type)` hooks
