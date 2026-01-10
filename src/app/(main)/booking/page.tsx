// src/app/(main)/booking/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BookingView } from './booking-view'

export const metadata: Metadata = {
  title: 'Book a Class',
  description: 'Book your spot in a class at New Bodies Gym. Easy online booking for all group fitness classes.',
}

export default async function BookingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/booking')
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-12 lg:py-16 bg-brand-charcoal-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="heading-1 text-white mb-4">Book a Class</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Select a date and choose from available classes. All classes are included in your membership.
          </p>
        </div>
      </section>

      {/* Booking Interface */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <BookingView />
        </div>
      </section>
    </>
  )
}