// src/components/layout/header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  CalendarCheck,
  LayoutDashboard,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { mainNavigation } from '@/config/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import { MobileNav } from './mobile-nav'

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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavigation.map((item) => {
              const isActive = isActiveLink(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium transition-colors rounded-lg',
                    'hover:text-brand-lime-500',
                    isActive
                      ? 'text-brand-lime-500'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.title}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-brand-lime-500/10 rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden sm:flex"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}

            {/* Auth Buttons / User Menu */}
            {isAuthenticated() ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 gap-2 px-2 hover:bg-brand-lime-500/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || undefined}
                        alt={getFullName()}
                      />
                      <AvatarFallback className="bg-brand-lime-500 text-brand-charcoal-900 text-xs font-semibold">
                        {getInitials(getFullName() || user?.email || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {profile?.first_name || 'User'}
                      </span>
                      {hasActiveMembership() && (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1 text-[10px] bg-brand-lime-500/20 text-brand-lime-500"
                        >
                          Member
                        </Badge>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{getFullName()}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/bookings" className="cursor-pointer">
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  {(isAdmin() || isStaff()) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400">
                  <Link href="/signup">Join Now</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 p-0">
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
    </header>
  )
}

// Gym Status Banner Component
function GymStatusBanner({ isScrolled }: { isScrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkIfOpen = () => {
      const now = new Date()
      const day = now.getDay()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const currentTime = hours + minutes / 60

      // Weekend: 9am - 3pm
      if (day === 0 || day === 6) {
        setIsOpen(currentTime >= 9 && currentTime < 15)
        return
      }

      // Friday: 6am - 8pm
      if (day === 5) {
        setIsOpen(currentTime >= 6 && currentTime < 20)
        return
      }

      // Mon-Thu: 6am - 9:30pm
      setIsOpen(currentTime >= 6 && currentTime < 21.5)
    }

    checkIfOpen()
    const interval = setInterval(checkIfOpen, 60000) // Check every minute

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
          className="bg-brand-charcoal-800 border-t border-brand-charcoal-700"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 py-1.5 text-xs sm:text-sm">
              <span
                className={cn(
                  'flex h-2 w-2 rounded-full',
                  isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                )}
              />
              <span className="text-muted-foreground">
                {isOpen ? (
                  <>
                    <span className="text-green-500 font-medium">Open Now</span>
                    {' · '}
                    <span>Where everyone is welcome</span>
                  </>
                ) : (
                  <>
                    <span className="text-red-400 font-medium">Currently Closed</span>
                    {' · '}
                    <span>See opening hours</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}