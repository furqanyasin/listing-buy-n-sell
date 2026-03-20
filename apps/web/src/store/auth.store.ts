'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@pw-clone/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  setAuth: (user: User, accessToken: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken) => {
        // Set a cookie so Next.js middleware can detect auth state
        if (typeof document !== 'undefined') {
          document.cookie = 'pw_auth_token=1; path=/; max-age=604800; SameSite=Lax'
        }
        set({ user, accessToken, isAuthenticated: true, isLoading: false })
      },

      clearAuth: () => {
        // Clear the middleware cookie on logout
        if (typeof document !== 'undefined') {
          document.cookie = 'pw_auth_token=; path=/; max-age=0; SameSite=Lax'
        }
        set({ user: null, accessToken: null, isAuthenticated: false })
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'pw-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
