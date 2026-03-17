'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ListingFilters, PaginatedResponse, ListingCard } from '@pw-clone/types'
import {
  getListingsApi,
  getFeaturedListingsApi,
  getListingApi,
  getMyListingsApi,
  getMyListingApi,
  updateListingApi,
  deleteListingApi,
} from '@/lib/api/listings'
import type { CreateListingRequest } from '@pw-clone/types'

export function useListings(filters: ListingFilters = {}) {
  return useQuery<PaginatedResponse<ListingCard>>({
    queryKey: ['listings', filters],
    queryFn: () => getListingsApi(filters),
  })
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: getFeaturedListingsApi,
    staleTime: 1000 * 60 * 5,
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listings', id],
    queryFn: () => getListingApi(id),
    enabled: !!id,
  })
}

export function useMyListings() {
  return useQuery({
    queryKey: ['listings', 'mine'],
    queryFn: getMyListingsApi,
  })
}

export function useRelatedListings(makeId: string, modelId: string, excludeId: string) {
  return useQuery({
    queryKey: ['listings', 'related', makeId, modelId, excludeId],
    queryFn: () => getListingsApi({ makeId, modelId, limit: 5, page: 1 }),
    enabled: !!makeId && !!modelId,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data.filter((l) => l.id !== excludeId).slice(0, 4),
  })
}

export function useMyListing(id: string) {
  return useQuery({
    queryKey: ['listings', 'mine', id],
    queryFn: () => getMyListingApi(id),
    enabled: !!id,
  })
}

export function useUpdateListing(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<CreateListingRequest>) => updateListingApi(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] })
      toast.success('Listing updated')
    },
    onError: () => toast.error('Failed to update listing'),
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteListingApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['listings'] })
      toast.success('Listing deleted')
    },
    onError: () => toast.error('Failed to delete listing'),
  })
}
