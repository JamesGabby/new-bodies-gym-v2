// src/components/shared/error-boundary.tsx
'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-6">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        We apologize for the inconvenience. An error occurred while processing your
        request.
      </p>

      {error.digest && (
        <p className="text-xs text-muted-foreground mb-6">
          Error ID: {error.digest}
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Not Found Component
export function NotFound({
  title = 'Page Not Found',
  description = "Sorry, we couldn't find the page you're looking for.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-[120px] font-bold text-brand-lime-500/20 leading-none mb-4">
        404
      </div>

      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button asChild className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400">
          <Link href="/" className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}