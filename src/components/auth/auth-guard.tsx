// src/components/auth/auth-guard.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { Loading } from '@/components/shared/loading'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  requireStaff?: boolean
  fallback?: React.ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireStaff = false,
  fallback,
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isAdmin, isStaff, isLoading, isInitialized } = useAuthStore()

  useEffect(() => {
    if (!isInitialized || isLoading) return

    if (requireAuth && !isAuthenticated()) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)
      return
    }

    if (requireAdmin && !isAdmin()) {
      router.push('/')
      return
    }

    if (requireStaff && !isStaff()) {
      router.push('/')
      return
    }
  }, [
    isAuthenticated,
    isAdmin,
    isStaff,
    isLoading,
    isInitialized,
    requireAuth,
    requireAdmin,
    requireStaff,
    pathname,
    router,
  ])

  // Show loading state
  if (!isInitialized || isLoading) {
    return fallback || <Loading fullScreen text="Loading..." />
  }

  // Check authentication
  if (requireAuth && !isAuthenticated()) {
    return fallback || <Loading fullScreen text="Redirecting..." />
  }

  // Check admin
  if (requireAdmin && !isAdmin()) {
    return fallback || <Loading fullScreen text="Redirecting..." />
  }

  // Check staff
  if (requireStaff && !isStaff()) {
    return fallback || <Loading fullScreen text="Redirecting..." />
  }

  return <>{children}</>
}