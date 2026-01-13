// src/stores/auth-store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Profile, Membership } from '@/types'

interface AuthUser {
  id: string
  email: string
}

interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  membership: Membership | null
  isLoading: boolean
  isInitialized: boolean
  
  // Actions
  setUser: (user: AuthUser | null) => void
  setProfile: (profile: Profile | null) => void
  setMembership: (membership: Membership | null) => void
  setIsLoading: (isLoading: boolean) => void
  setIsInitialized: (isInitialized: boolean) => void
  reset: () => void
  
  // Computed (as functions)
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  isStaff: () => boolean
  hasActiveMembership: () => boolean
  getFullName: () => string
}

const initialState = {
  user: null,
  profile: null,
  membership: null,
  isLoading: true,
  isInitialized: false,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setMembership: (membership) => set({ membership }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsInitialized: (isInitialized) => set({ isInitialized }),
      
      reset: () => set(initialState),

      isAuthenticated: () => get().user !== null,
      
      isAdmin: () => {
        const profile = get().profile
        return profile?.role === 'admin' || profile?.role === 'super_admin'
      },
      
      isStaff: () => {
        const profile = get().profile
        return profile?.role === 'staff' || profile?.role === 'admin' || profile?.role === 'super_admin'
      },
      
      hasActiveMembership: () => {
        const membership = get().membership
        if (!membership) return false
        if (membership.status !== 'active') return false
        if (membership.end_date && new Date(membership.end_date) < new Date()) return false
        return true
      },
      
      getFullName: () => {
        const profile = get().profile
        if (!profile) return ''
        return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        profile: state.profile,
        membership: state.membership,
      }),
    }
  )
)