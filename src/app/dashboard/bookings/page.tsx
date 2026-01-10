// src/app/dashboard/bookings/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserBookingsView } from './user-bookings-view'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CalendarPlus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Bookings',
  description: 'View and manage your class bookings at New Bodies Gym.',
}

export default async function UserBookingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/dashboard/bookings')
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Bookings"
        description="View and manage your upcoming and past class bookings"
      >
        <Button
          asChild
          className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
        >
          <Link href="/booking">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book a Class
          </Link>
        </Button>
      </PageHeader>

      <UserBookingsView />
    </div>
  )
}