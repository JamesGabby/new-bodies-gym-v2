// src/components/layout/header.tsx
'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  User,
  LogOut,
  Settings,
  CalendarCheck,
  LayoutDashboard,
  Sun,
  Moon,
  ChevronDown,
  Clock,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { LogoWithImage } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { mainNavigation } from '@/config/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import { MobileNav } from './mobile-nav'
import { AnnouncementBannerClient } from '../home/announcement-banner-client'

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { user, profile, isAuthenticated, isAdmin, isStaff, getFullName, hasActiveMembership } =
    useAuthStore()

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effect with throttling for performance
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }, [])

  const isActiveLink = useCallback((href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }, [pathname])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  return (
    <TooltipProvider delayDuration={300}>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/85 backdrop-blur-xl border-b border-border/50 shadow-sm'
            : 'bg-background/60 dark:bg-background/40 backdrop-blur-md'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between lg:h-[72px]">
            {/* Logo */}
            <div className="flex items-center">
              <LogoWithImage size="lg" />
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1 bg-muted/40 dark:bg-muted/20 rounded-full px-2 py-1.5 border border-border/50">
                {mainNavigation.map((item) => {
                  const isActive = isActiveLink(item.href)
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full',
                        'hover:text-brand-lime-600 dark:hover:text-brand-lime-400',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-500 focus-visible:ring-offset-2',
                        isActive
                          ? 'text-brand-charcoal-900 dark:text-brand-charcoal-900'
                          : 'text-foreground/70 hover:text-foreground'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 bg-brand-lime-500 rounded-full -z-10 shadow-md shadow-brand-lime-500/25"
                          transition={{ 
                            type: 'spring', 
                            bounce: 0.15, 
                            duration: 0.5 
                          }}
                        />
                      )}
                      <span className="flex items-center gap-2">
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.title}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Theme Toggle - Improved with tooltip */}
              {mounted && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className={cn(
                        'hidden sm:flex h-9 w-9 rounded-full',
                        'hover:bg-muted/80 hover:text-foreground',
                        'transition-all duration-200'
                      )}
                    >
                      <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Auth Buttons / User Menu */}
              {mounted && (
                <>
                  {isAuthenticated() ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            'relative h-10 gap-2 px-1.5 sm:px-2 rounded-full',
                            'hover:bg-muted/80',
                            'transition-all duration-200',
                            'focus-visible:ring-2 focus-visible:ring-brand-lime-500 focus-visible:ring-offset-2'
                          )}
                        >
                          <div className="relative">
                            <Avatar className="h-8 w-8 border-2 border-brand-lime-500/20 transition-all duration-200 group-hover:border-brand-lime-500/40">
                              <AvatarImage
                                src={profile?.avatar_url || undefined}
                                alt={getFullName()}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-brand-lime-400 to-brand-lime-600 text-brand-charcoal-900 text-xs font-bold">
                                {getInitials(getFullName() || user?.email || 'U')}
                              </AvatarFallback>
                            </Avatar>
                            {/* Online indicator */}
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                          </div>
                          
                          <span className="hidden md:flex flex-col items-start">
                            <span className="text-sm font-medium text-foreground leading-tight">
                              {profile?.first_name || 'User'}
                            </span>
                            {hasActiveMembership() ? (
                              <Badge
                                variant="secondary"
                                className="h-4 px-1.5 text-[10px] bg-brand-lime-500/15 text-brand-lime-600 dark:text-brand-lime-400 border-0"
                              >
                                Member
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">
                                Free account
                              </span>
                            )}
                          </span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      
                      <DropdownMenuContent 
                        align="end" 
                        className="w-64 p-2"
                        sideOffset={8}
                      >
                        {/* User Header */}
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 mb-2">
                          <Avatar className="h-10 w-10 border-2 border-brand-lime-500/20">
                            <AvatarImage src={profile?.avatar_url || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-brand-lime-400 to-brand-lime-600 text-brand-charcoal-900 text-sm font-bold">
                              {getInitials(getFullName() || user?.email || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {getFullName()}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        <DropdownMenuSeparator className="my-2" />

                        {/* Quick Actions */}
                        <div className="space-y-1">
                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                            <Link href="/dashboard/bookings" className="flex items-center gap-3 py-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <CalendarCheck className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">My Bookings</p>
                                <p className="text-xs text-muted-foreground">View upcoming classes</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                            <Link href="/dashboard/profile" className="flex items-center gap-3 py-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Profile</p>
                                <p className="text-xs text-muted-foreground">Manage your account</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                            <Link href="/dashboard/settings" className="flex items-center gap-3 py-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/10 text-gray-600 dark:text-gray-400">
                                <Settings className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Settings</p>
                                <p className="text-xs text-muted-foreground">Preferences & security</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>

                          {(isAdmin() || isStaff()) && (
                            <>
                              <DropdownMenuSeparator className="my-2" />
                              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                                <Link href="/admin" className="flex items-center gap-3 py-2.5">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-lime-500/10 text-brand-lime-600 dark:text-brand-lime-400">
                                    <LayoutDashboard className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">Admin Dashboard</p>
                                    <p className="text-xs text-muted-foreground">Manage the gym</p>
                                  </div>
                                  <Badge variant="outline" className="text-[10px] h-5 border-brand-lime-500/30 text-brand-lime-600 dark:text-brand-lime-400">
                                    Staff
                                  </Badge>
                                </Link>
                              </DropdownMenuItem>
                            </>
                          )}
                        </div>

                        <DropdownMenuSeparator className="my-2" />
                        
                        {/* Sign Out */}
                        <DropdownMenuItem
                          onClick={handleSignOut}
                          className="rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 py-2.5"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          <span className="font-medium">Sign Out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="hidden sm:flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        asChild 
                        className="text-foreground hover:bg-muted/80 rounded-full px-4"
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button 
                        asChild 
                        className={cn(
                          'bg-brand-lime-500 text-brand-charcoal-900 font-semibold',
                          'hover:bg-brand-lime-400',
                          'shadow-md shadow-brand-lime-500/20 hover:shadow-lg hover:shadow-brand-lime-500/30',
                          'transition-all duration-200',
                          'rounded-full px-5'
                        )}
                      >
                        <Link href="/signup">
                          Join Now
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Trigger - Improved */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      'lg:hidden h-10 w-10 rounded-full',
                      'hover:bg-muted/80',
                      'transition-all duration-200'
                    )}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-full sm:w-[380px] p-0 bg-background border-l border-border/50 [&>button]:hidden"
                >
                  <MobileNav
                    onClose={() => setIsMobileMenuOpen(false)}
                    isAuthenticated={isAuthenticated()}
                    isAdmin={isAdmin()}
                    isStaff={isStaff()}
                    profile={profile}
                    onSignOut={handleSignOut}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Gym Open Status Banner */}
        <GymStatusBanner isScrolled={isScrolled} />
        <Suspense fallback={null}>
          <AnnouncementBannerClient />
        </Suspense>
      </header>
    </TooltipProvider>
  )
}

// Gym Status Banner Component - Enhanced
function GymStatusBanner({ isScrolled }: { isScrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [closingTime, setClosingTime] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const checkIfOpen = () => {
      const now = new Date()
      const day = now.getDay()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours + minutes / 60

      // Determine closing time based on day
      let closeTime: number
      let closeTimeStr: string

      // Weekend: 9am - 3pm
      if (day === 0 || day === 6) {
        closeTime = 15
        closeTimeStr = '3:00 PM'
        setIsOpen(currentTime >= 9 && currentTime < closeTime)
      }
      // Friday: 6am - 8pm
      else if (day === 5) {
        closeTime = 20
        closeTimeStr = '8:00 PM'
        setIsOpen(currentTime >= 6 && currentTime < closeTime)
      }
      // Mon-Thu: 6am - 9:30pm
      else {
        closeTime = 21.5
        closeTimeStr = '9:30 PM'
        setIsOpen(currentTime >= 6 && currentTime < closeTime)
      }

      setClosingTime(closeTimeStr)
    }

    checkIfOpen()
    const interval = setInterval(checkIfOpen, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {!isScrolled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'border-t overflow-hidden',
            isOpen 
              ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20' 
              : 'bg-muted/50 dark:bg-muted/30 border-border/50'
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-3 py-2 text-xs sm:text-sm">
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={cn(
                      'absolute inline-flex h-full w-full rounded-full opacity-75',
                      isOpen ? 'bg-emerald-500 animate-ping' : 'bg-red-500'
                    )}
                  />
                  <span
                    className={cn(
                      'relative inline-flex h-2.5 w-2.5 rounded-full',
                      isOpen ? 'bg-emerald-500' : 'bg-red-500'
                    )}
                  />
                </span>
                
                <span className={cn(
                  'font-semibold',
                  isOpen 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                )}>
                  {isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <span className="text-muted-foreground/50">•</span>

              {/* Additional Info */}
              {isOpen ? (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Closes at <span className="font-medium text-foreground/80">{closingTime}</span>
                  </span>
                </div>
              ) : (
                <Link 
                  href="/contact#hours" 
                  className={cn(
                    'flex items-center gap-1.5 text-muted-foreground',
                    'hover:text-foreground transition-colors',
                    'underline-offset-4 hover:underline'
                  )}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>See opening hours</span>
                </Link>
              )}

              <span className="hidden sm:inline text-muted-foreground/50">•</span>

              {/* Tagline - Hidden on mobile */}
              <span className="hidden sm:inline text-muted-foreground">
                Where everyone is welcome
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}