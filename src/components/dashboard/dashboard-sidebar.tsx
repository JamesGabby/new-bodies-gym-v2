// src/components/dashboard/dashboard-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/types/database';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  History,
  CreditCard,
  User,
  Settings,
  Menu,
  ChevronLeft,
  Dumbbell,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Book a Class', href: '/dashboard/book', icon: Calendar },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: CalendarCheck },
  { name: 'Booking History', href: '/dashboard/history', icon: History },
  { name: 'Membership', href: '/dashboard/membership', icon: CreditCard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface DashboardSidebarProps {
  profile: Profile | null;
}

function SidebarContent({ profile, onNavigate }: { profile: Profile | null; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <Logo className="h-8 w-auto" />
        </Link>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.first_name} {profile?.last_name}
            </p>
            <Badge variant="outline" className="text-xs">
              {profile?.role || 'Member'}
            </Badge>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-border p-4 space-y-2">
        <Link href="/timetable">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Dumbbell className="h-4 w-4" />
            View Timetable
          </Button>
        </Link>
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Site
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent profile={profile} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card">
          <SidebarContent profile={profile} />
        </div>
      </aside>
    </>
  );
}