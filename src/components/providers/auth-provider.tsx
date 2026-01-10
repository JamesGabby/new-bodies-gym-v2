// src/components/providers/auth-provider.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const {
    setUser,
    setProfile,
    setMembership,
    setIsLoading,
    setIsInitialized,
    reset,
  } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
          })

          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setProfile(profile)
          }

          // Fetch active membership
          const { data: membership } = await supabase
            .from('memberships')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (membership) {
            setMembership(membership)
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
        })

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setProfile(profile)
        }

        // Fetch active membership
        const { data: membership } = await supabase
          .from('memberships')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (membership) {
          setMembership(membership)
        }

        router.refresh()
      } else if (event === 'SIGNED_OUT') {
        reset()
        router.refresh()
        router.push('/')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, setUser, setProfile, setMembership, setIsLoading, setIsInitialized, reset])

  return <>{children}</>
}