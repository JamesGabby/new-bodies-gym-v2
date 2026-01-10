// src/components/auth/redirect-if-authenticated.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { Loading } from '@/components/shared/loading'

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode
  redirectTo?: string
}

export function RedirectIfAuthenticated({
  children,
  redirectTo = '/',
}: RedirectIfAuthenticatedProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore()

  useEffect(() => {
    if (!isInitialized || isLoading) return

    if (isAuthenticated()) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, isInitialized, redirectTo, router])

  if (!isInitialized || isLoading) {
    return <Loading fullScreen text="Loading..." />
  }

  if (isAuthenticated()) {
    return <Loading fullScreen text="Redirecting..." />
  }

  return <>{children}</>
}