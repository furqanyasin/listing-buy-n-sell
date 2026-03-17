'use client'

import { useQuery } from '@tanstack/react-query'
import { getMakesApi, getModelsByMakeApi, getCitiesApi } from '@/lib/api/reference'

export function useMakes() {
  return useQuery({
    queryKey: ['reference', 'makes'],
    queryFn: getMakesApi,
    staleTime: 1000 * 60 * 60, // 1 hour — reference data changes rarely
  })
}

export function useModelsByMake(makeId: string | null) {
  return useQuery({
    queryKey: ['reference', 'models', makeId],
    queryFn: () => getModelsByMakeApi(makeId!),
    enabled: !!makeId,
    staleTime: 1000 * 60 * 60,
  })
}

export function useCities() {
  return useQuery({
    queryKey: ['reference', 'cities'],
    queryFn: getCitiesApi,
    staleTime: 1000 * 60 * 60,
  })
}
