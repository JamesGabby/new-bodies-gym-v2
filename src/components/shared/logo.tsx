// src/components/shared/logo.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { memo, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ============ Types ============
type LogoSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg'
type RoundedVariant = 'none' | 'sm' | 'md' | 'lg' | 'full'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: LogoSize
  linkToHome?: boolean
}

interface LogoWithImageProps extends LogoProps {
  src?: string
  alt?: string
  rounded?: RoundedVariant
}

// ============ Constants ============
const ICON_SIZE_CLASSES: Record<LogoSize, string> = {
  xxs: 'h-4 w-4',
  xs: 'h-5 w-5',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
}

const TEXT_SIZE_CLASSES: Record<LogoSize, string> = {
  xxs: 'text-xs',
  xs: 'text-sm',
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

const SUBTEXT_SIZE_CLASSES: Record<LogoSize, string> = {
  xxs: 'text-[8px]',
  xs: 'text-[10px]',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const IMAGE_DIMENSIONS: Record<LogoSize, { width: number; height: number }> = {
  xxs: { width: 16, height: 16 },
  xs: { width: 20, height: 20 },
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 56, height: 56 },
}

const GAP_CLASSES: Record<LogoSize, string> = {
  xxs: 'gap-1',
  xs: 'gap-1.5',
  sm: 'gap-2',
  md: 'gap-2.5',
  lg: 'gap-3',
}

const ROUNDED_CLASSES: Record<RoundedVariant, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

// ============ Helper Components ============
interface LogoWrapperProps {
  linkToHome: boolean
  children: ReactNode
  className?: string
}

function LogoWrapper({ linkToHome, children, className }: LogoWrapperProps) {
  if (!linkToHome) {
    return <>{children}</>
  }

  return (
    <Link
      href="/"
      aria-label="Go to homepage"
      className={cn(
        'rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-500',
        className
      )}
    >
      {children}
    </Link>
  )
}

interface LogoTextProps {
  size: LogoSize
}

function LogoText({ size }: LogoTextProps) {
  return (
    <div className="flex flex-col leading-none">
      <span className={cn('font-bold tracking-tight', TEXT_SIZE_CLASSES[size])}>
        <span className="text-foreground">new</span>
        <span className="text-brand-lime-500">bodies</span>
      </span>
      <span
        className={cn(
          'font-semibold text-brand-lime-500',
          SUBTEXT_SIZE_CLASSES[size]
        )}
      >
        gym
      </span>
    </div>
  )
}

function LogoIcon({ size }: { size: LogoSize }) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-lg bg-brand-lime-500',
        ICON_SIZE_CLASSES[size]
      )}
      aria-hidden="true"
    >
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
  )
}

// ============ Main Components ============
export const Logo = memo(function Logo({
  className,
  showText = true,
  size = 'md',
  linkToHome = true,
}: LogoProps) {
  return (
    <LogoWrapper linkToHome={linkToHome}>
      <div className={cn('flex items-center', GAP_CLASSES[size], className)}>
        <LogoIcon size={size} />
        {showText && <LogoText size={size} />}
      </div>
    </LogoWrapper>
  )
})

export const LogoWithImage = memo(function LogoWithImage({
  className,
  size = 'md',
  linkToHome = true,
  showText = true,
  src = '/logo.png',
  alt = 'New Bodies Gym',
  rounded = 'md',
}: LogoWithImageProps) {
  const { width, height } = IMAGE_DIMENSIONS[size]

  return (
    <LogoWrapper linkToHome={linkToHome}>
      <div className={cn('flex items-center', GAP_CLASSES[size], className)}>
        <div
          className={cn(
            'relative flex-shrink-0 overflow-hidden',
            ROUNDED_CLASSES[rounded]
          )}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={cn('object-cover', ROUNDED_CLASSES[rounded])}
            priority
          />
        </div>
        {showText && <LogoText size={size} />}
      </div>
    </LogoWrapper>
  )
})

// ============ Default Export ============
export default Logo