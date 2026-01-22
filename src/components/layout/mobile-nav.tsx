// src/components/layout/mobile-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  User,
  LogOut,
  Settings,
  CalendarCheck,
  LayoutDashboard,
  Sun,
  Moon,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  X,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { LogoWithImage } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mainNavigation } from '@/config/navigation'
import { siteConfig } from '@/config/site'
import { getInitials } from '@/lib/utils'
import { Profile } from '@/types'

interface MobileNavProps {
  onClose: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
  profile: Profile | null
  onSignOut: () => void
}

export function MobileNav({
  onClose,
  isAuthenticated,
  isAdmin,
  isStaff,
  profile,
  onSignOut,
}: MobileNavProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = () => {
    onSignOut()
    onClose()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <LogoWithImage size="sm" linkToHome={false} />

        {/* Animated Close Button */}
        <button
          onClick={onClose}
          className={cn(
            'group relative flex h-11 w-11 items-center justify-center rounded-xl',
            'bg-gradient-to-br from-muted/80 to-muted/40',
            'border border-border',
            'shadow-sm hover:shadow-md',
            'transition-all duration-300 ease-out',
            'hover:scale-105 hover:border-brand-lime-500/30',
            'active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-500 focus-visible:ring-offset-2'
          )}
          aria-label="Close menu"
        >
          {/* Background glow on hover */}
          <span className="absolute inset-0 rounded-xl bg-brand-lime-500/0 group-hover:bg-brand-lime-500/10 transition-colors duration-300" />

          {/* Icon with rotation on hover */}
          <X className={cn(
            'h-5 w-5 text-muted-foreground',
            'transition-all duration-300',
            'group-hover:text-foreground group-hover:rotate-90'
          )} />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-6">
          {/* User Info (if authenticated) */}
          {isAuthenticated && profile && (
            <div className="mb-6">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-brand-lime-500 text-brand-charcoal-900 font-semibold">
                    {getInitials(
                      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
                      profile.email
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-lime-500/10 text-brand-lime-500'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-brand-lime-500" />
                  )}
                </Link>
              )
            })}
          </nav>

          <Separator className="my-6" />

          {/* User Navigation (if authenticated) */}
          {isAuthenticated ? (
            <>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </p>
              <nav className="space-y-1">
                <Link
                  href="/dashboard/bookings"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <CalendarCheck className="h-5 w-5" />
                  My Bookings
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <User className="h-5 w-5" />
                  Profile
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Link>

                {(isAdmin || isStaff) && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Admin Dashboard
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Staff
                    </Badge>
                  </Link>
                )}
              </nav>

              <Separator className="my-6" />
            </>
          ) : (
            <>
              {/* Auth Buttons */}
              <div className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-center"
                  onClick={onClose}
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
                  onClick={onClose}
                >
                  <Link href="/signup">Join Now</Link>
                </Button>
              </div>

              <Separator className="my-6" />
            </>
          )}

          {/* Contact Info */}
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact Us
          </p>
          <div className="space-y-3 px-3">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-lime-500 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-lime-500 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {siteConfig.contact.email}
            </a>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{siteConfig.contact.address.full}</span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-3">
            <span className="text-sm font-medium">Dark Mode</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="gap-2"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark
                </>
              )}
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      {isAuthenticated && (
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  )
}