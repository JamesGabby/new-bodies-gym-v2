// src/app/(main)/timetable/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { TimetableView } from './timetable-view'
import { TimetableSkeleton } from '@/components/shared/loading'

export const metadata: Metadata = {
  title: 'Class Timetable',
  description:
    'View the weekly class timetable at New Bodies Gym. Pilates, Spin, HIIT, Yoga, and more. All classes included in membership.',
}

export default function TimetablePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-12 lg:py-16 bg-brand-charcoal-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="heading-1 text-white mb-4">Class Timetable</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            All classes are included in your membership. Book your spot via the app or website.
          </p>
        </div>
      </section>

      {/* Timetable */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={<TimetableSkeleton />}>
            <TimetableView />
          </Suspense>
        </div>
      </section>
    </>
  )
}