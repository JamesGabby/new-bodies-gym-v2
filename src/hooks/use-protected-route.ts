// src/hooks/use-protected-route.ts
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'

interface UseProtectedRouteOptions {
  redirectTo?: string
  requireAdmin?: boolean
  requireStaff?: boolean
  requireMembership?: boolean
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const {
    redirectTo = '/login',
    requireAdmin = false,
    requireStaff = false,
    requireMembership = false,
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const {
    isAuthenticated,
    isAdmin,
    isStaff,
    hasActiveMembership,
    isLoading,
    isInitialized,
  } = useAuthStore()

  useEffect(() => {
    if (!isInitialized || isLoading) return

    // Check authentication
    if (!isAuthenticated()) {
      const redirectUrl = `${redirectTo}?redirectTo=${encodeURIComponent(pathname)}`
      router.push(redirectUrl)
      return
    }

    // Check admin requirement
    if (requireAdmin && !isAdmin()) {
      router.push('/')
      return
    }

    // Check staff requirement
    if (requireStaff && !isStaff()) {
      router.push('/')
      return
    }

    // Check membership requirement
    if (requireMembership && !hasActiveMembership()) {
      router.push('/membership')
      return
    }
  }, [
    isAuthenticated,
    isAdmin,
    isStaff,
    hasActiveMembership,
    isLoading,
    isInitialized,
    requireAdmin,
    requireStaff,
    requireMembership,
    redirectTo,
    pathname,
    router,
  ])

  return {
    isLoading: isLoading || !isInitialized,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    isStaff: isStaff(),
    hasActiveMembership: hasActiveMembership(),
  }
}