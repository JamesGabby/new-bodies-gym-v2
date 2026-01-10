// src/components/auth/user-avatar.tsx
'use client'

import { useState } from 'react'
import { User } from 'lucide-react'

import { cn, getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  email?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showFallbackIcon?: boolean
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-lg',
}

export function UserAvatar({
  src,
  name,
  email,
  size = 'md',
  className,
  showFallbackIcon = false,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false)

  const displayName = name || email || 'User'
  const initials = getInitials(displayName)

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {src && !imageError && (
        <AvatarImage
          src={src}
          alt={displayName}
          onError={() => setImageError(true)}
        />
      )}
      <AvatarFallback className="bg-brand-lime-500 text-brand-charcoal-900 font-semibold">
        {showFallbackIcon ? (
          <User className="h-1/2 w-1/2" />
        ) : (
          initials
        )}
      </AvatarFallback>
    </Avatar>
  )
}