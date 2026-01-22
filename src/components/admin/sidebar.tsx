// src/components/admin/sidebar.tsx (continued)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarCheck,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Dumbbell,
  Bell,
  MessageSquare,
  LogOut,
  Home,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { LogoWithImage } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'

const sidebarNavigation = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
      },
      {
        title: 'Analytics',
        href: '/admin/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Members',
        href: '/admin/members',
        icon: Users,
      },
      {
        title: 'Classes',
        href: '/admin/classes',
        icon: Dumbbell,
      },
      {
        title: 'Schedule',
        href: '/admin/schedule',
        icon: Calendar,
      },
      {
        title: 'Bookings',
        href: '/admin/bookings',
        icon: CalendarCheck,
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        title: 'Announcements',
        href: '/admin/announcements',
        icon: Bell,
      },
      {
        title: 'Messages',
        href: '/admin/messages',
        icon: MessageSquare,
        badge: 'New',
      },
    ],
  },
  {
    title: 'Settings',
    items: [
      {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:h-20 lg:px-6">
        <LogoWithImage size="sm" />
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-6">
          {sidebarNavigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = isActiveLink(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-brand-lime-500 text-brand-charcoal-900 shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className={cn('h-5 w-5', isActive && 'text-brand-charcoal-900')} />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? 'secondary' : 'default'}
                          className={cn(
                            'text-xs',
                            isActive
                              ? 'bg-brand-charcoal-900/20 text-brand-charcoal-900'
                              : 'bg-brand-lime-500 text-brand-charcoal-900'
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/">
              <Home className="h-5 w-5" />
              Back to Website
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-border bg-card lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent onClose={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}