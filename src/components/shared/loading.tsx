// src/components/shared/loading.tsx
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function Loading({
  className,
  size = 'md',
  text,
  fullScreen = false,
}: LoadingProps) {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-brand-lime-500', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

// Page Loading Skeleton
export function PageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  )
}

// Skeleton Components
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-6 animate-pulse',
        className
      )}
    >
      <div className="h-4 w-2/3 rounded bg-muted mb-4" />
      <div className="h-3 w-full rounded bg-muted mb-2" />
      <div className="h-3 w-4/5 rounded bg-muted" />
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 rounded bg-muted" />
        </td>
      ))}
    </tr>
  )
}

export function ClassCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-muted" />
        <div className="flex-1">
          <div className="h-4 w-1/2 rounded bg-muted mb-2" />
          <div className="h-3 w-1/3 rounded bg-muted" />
        </div>
        <div className="h-8 w-20 rounded bg-muted" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 rounded-full bg-muted" />
        <div className="flex-1">
          <div className="h-6 w-1/3 rounded bg-muted mb-2" />
          <div className="h-4 w-1/4 rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-10 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
        <div className="h-10 rounded bg-muted" />
      </div>
    </div>
  )
}

export function TimetableSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4">
          <div className="h-6 w-1/2 rounded bg-muted mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-16 rounded bg-muted" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}