'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/auth.store'
import { toggleFavoriteApi, getFavoritesApi, getFavoriteIdsApi } from '@/lib/api/favorites'

export function useFavoriteIds() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['favorites', 'ids'],
    queryFn: getFavoriteIdsApi,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })
}

export function useFavorites() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesApi,
    enabled: isAuthenticated,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleFavoriteApi,
    // Optimistic update: flip the ID in the cached list immediately
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites', 'ids'] })
      const previous = queryClient.getQueryData<string[]>(['favorites', 'ids']) ?? []
      const isFavorited = previous.includes(listingId)
      queryClient.setQueryData<string[]>(
        ['favorites', 'ids'],
        isFavorited ? previous.filter((id) => id !== listingId) : [...previous, listingId],
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['favorites', 'ids'], context.previous)
      }
      toast.error('Failed to update favorites')
    },
    onSuccess: (result) => {
      if (result.isFavorited) toast.success('Added to saved cars')
      else toast.success('Removed from saved cars')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
