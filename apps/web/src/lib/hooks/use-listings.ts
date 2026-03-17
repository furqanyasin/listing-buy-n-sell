'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { ListingFilters, PaginatedResponse, ListingCard } from '@pw-clone/types'
import {
  getListingsApi,
  getFeaturedListingsApi,
  getListingApi,
  getMyListingsApi,
  deleteListingApi,
} from '@/lib/api/listings'

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
