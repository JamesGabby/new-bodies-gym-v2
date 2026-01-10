// src/app/dashboard/dashboard-nav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarCheck, User, Settings, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

const dashboardNav = [
  {
    title: 'My Bookings',
    href: '/dashboard/bookings',
    icon: CalendarCheck,
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Membership',
    href: '/dashboard/membership',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-24 space-y-1">
      {dashboardNav.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-lime-500 text-brand-charcoal-900'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className={cn('h-5 w-5', isActive && 'text-brand-charcoal-900')} />
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}