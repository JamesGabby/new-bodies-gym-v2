// src/components/shared/logo.tsx
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  linkToHome?: boolean
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function Logo({
  className,
  showText = true,
  size = 'md',
  linkToHome = true,
}: LogoProps) {
  const content = (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo Icon - You can replace this with an actual image */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg bg-brand-lime-500',
          sizeClasses[size]
        )}
      >
        {/* Placeholder for logo - replace with actual logo image */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-3/4 w-3/4 text-brand-charcoal-900"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4C10.5 4 9.5 5 9.5 6.5C9.5 8 10.5 9 12 9C13.5 9 14.5 8 14.5 6.5C14.5 5 13.5 4 12 4Z"
            fill="currentColor"
          />
          <path
            d="M20 9H17V11H15V9H9V11H7V9H4V11H7V15H4V17H7V21H9V17H15V21H17V17H20V15H17V11H20V9ZM15 15H9V11H15V15Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-bold tracking-tight',
              textSizeClasses[size]
            )}
          >
            <span className="text-foreground">new</span>
            <span className="text-brand-lime-500">bodies</span>
          </span>
          <span
            className={cn(
              'font-semibold text-brand-lime-500',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
            )}
          >
            gym
          </span>
        </div>
      )}
    </div>
  )

  if (linkToHome) {
    return (
      <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-500 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}

// Alternative Logo with Image
export function LogoWithImage({
  className,
  size = 'md',
  linkToHome = true,
}: Omit<LogoProps, 'showText'>) {
  const imageSizes = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 53 },
    lg: { width: 200, height: 67 },
  }

  const content = (
    <div className={cn('relative', className)}>
      <Image
        src="/images/logo.png"
        alt="New Bodies Gym"
        width={imageSizes[size].width}
        height={imageSizes[size].height}
        className="object-contain"
        priority
      />
    </div>
  )

  if (linkToHome) {
    return (
      <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-500 rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}