// src/components/admin/header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useAuthStore } from '@/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'

// Breadcrumb helper
function getBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean)
  return paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/')
    const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
    return { href, label }
  })
}

export function AdminHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { profile, getFullName } = useAuthStore()

  const breadcrumbs = getBreadcrumbs(pathname)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-8">
        {/* Left Side - Breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile menu spacer */}
          <div className="w-10 lg:hidden" />

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-muted-foreground">/</span>
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Page Title */}
          <h1 className="font-semibold sm:hidden">
            {breadcrumbs[breadcrumbs.length - 1]?.label || 'Dashboard'}
          </h1>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2 text-muted-foreground w-64 justify-start"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-lime-500 text-[10px] font-bold text-brand-charcoal-900">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                <Badge variant="secondary" className="text-xs">
                  3 new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <NotificationItem
                  title="New member signup"
                  description="John Smith just signed up for a monthly membership"
                  time="5 minutes ago"
                  unread
                />
                <NotificationItem
                  title="Class booking"
                  description="15 people have booked tomorrow's Spin class"
                  time="1 hour ago"
                  unread
                />
                <NotificationItem
                  title="Contact form submission"
                  description="New inquiry from Sarah Johnson"
                  time="2 hours ago"
                  unread
                />
                <NotificationItem
                  title="Membership expiring"
                  description="5 memberships expiring this week"
                  time="Yesterday"
                />
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/notifications" className="w-full justify-center">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-brand-lime-500 text-brand-charcoal-900 text-xs font-semibold">
                    {getInitials(getFullName() || 'A')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-medium">
                    {profile?.first_name || 'Admin'}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {profile?.role?.replace('_', ' ') || 'Staff'}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{getFullName()}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Command Dialog (Search) */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Search members, classes, bookings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => setIsSearchOpen(false)}>
              <Link href="/admin/members/new" className="flex items-center gap-2 w-full">
                Add New Member
              </Link>
            </CommandItem>
            <CommandItem onSelect={() => setIsSearchOpen(false)}>
              <Link href="/admin/classes/new" className="flex items-center gap-2 w-full">
                Create New Class
              </Link>
            </CommandItem>
            <CommandItem onSelect={() => setIsSearchOpen(false)}>
              <Link href="/admin/announcements/new" className="flex items-center gap-2 w-full">
                Create Announcement
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => setIsSearchOpen(false)}>
              <Link href="/admin" className="flex items-center gap-2 w-full">
                Dashboard
              </Link>
            </CommandItem>
            <CommandItem onSelect={() => setIsSearchOpen(false)}>
              <Link href="/admin/members" className="flex items-center gap-2 w-full">
                Members
              </Link>
            </CommandItem>
            <CommandItem onSelect={() => setIsSearchOpen(false)}>
              <Link href="/admin/bookings" className="flex items-center gap-2 w-full">
                Bookings
              </Link>
            </CommandItem>
            <CommandItem onSelect={() => setIsSearchOpen(false)}>
              <Link href="/admin/analytics" className="flex items-center gap-2 w-full">
                Analytics
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

// Notification Item Component
function NotificationItem({
  title,
  description,
  time,
  unread = false,
}: {
  title: string
  description: string
  time: string
  unread?: boolean
}) {
  return (
    <div
      className={cn(
        'flex gap-3 p-3 hover:bg-muted cursor-pointer transition-colors',
        unread && 'bg-brand-lime-500/5'
      )}
    >
      {unread && (
        <div className="mt-1.5">
          <span className="flex h-2 w-2 rounded-full bg-brand-lime-500" />
        </div>
      )}
      <div className={cn('flex-1 space-y-1', !unread && 'ml-5')}>
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}