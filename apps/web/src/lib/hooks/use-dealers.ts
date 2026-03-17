'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  getDealersApi,
  getDealerApi,
  registerDealerApi,
  getMyDealerApi,
  updateDealerApi,
} from '@/lib/api/dealers'
import type { CreateDealerRequest } from '@pw-clone/types'

export function useDealers() {
  return useQuery({
    queryKey: ['dealers'],
    queryFn: getDealersApi,
    staleTime: 1000 * 60 * 5,
  })
}

export function useDealer(slug: string) {
  return useQuery({
    queryKey: ['dealers', slug],
    queryFn: () => getDealerApi(slug),
    enabled: !!slug,
  })
}

export function useMyDealer() {
  return useQuery({
    queryKey: ['dealers', 'me'],
    queryFn: getMyDealerApi,
    retry: false, // don't retry 404 (user has no dealer profile)
  })
}

export function useRegisterDealer() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateDealerRequest) => registerDealerApi(payload),
    onSuccess: (dealer) => {
      void queryClient.invalidateQueries({ queryKey: ['dealers'] })
      toast.success('Dealer profile created successfully!')
      router.push(`/dealers/${dealer.slug}`)
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const msg = error.response?.data?.message ?? 'Failed to create dealer profile.'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    },
  })
}

export function useUpdateDealer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateDealerRequest> }) =>
      updateDealerApi(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['dealers'] })
      toast.success('Dealer profile updated')
    },
    onError: () => toast.error('Failed to update dealer profile'),
  })
}
