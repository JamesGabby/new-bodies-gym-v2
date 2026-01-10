// src/app/(main)/page.tsx
import { Metadata } from 'next'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { TimetablePreview } from '@/components/home/timetable-preview'
import { FacilitiesPreview } from '@/components/home/facilities-preview'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'
import { AnnouncementBanner } from '@/components/home/announcement-banner'
import { StatsSection } from '@/components/home/stats-section'
import { GymRulesSection } from '@/components/home/gym-rules-section'
import { AppDownloadSection } from '@/components/home/app-download-section'

export const metadata: Metadata = {
  title: 'New Bodies Gym - Where Everyone is Welcome',
  description:
    'New Bodies Gym in Buxton - Your local gym with state-of-the-art facilities, group fitness classes, personal training, and a welcoming community. Join us today!',
}

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TimetablePreview />
      <FacilitiesPreview />
      <GymRulesSection />
      <TestimonialsSection />
      <AppDownloadSection />
      <CTASection />
    </>
  )
}