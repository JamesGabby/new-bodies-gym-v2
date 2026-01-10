// src/app/(main)/facilities/page.tsx
import { Metadata } from 'next'
import * as LucideIcons from 'lucide-react'

import { Section, SectionHeader } from '@/components/shared/section'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Facilities',
  description:
    'Explore all the facilities at New Bodies Gym in Buxton. From cardio suites to Olympic lifting, ladies-only zone to group studios - we have everything you need.',
}

// Icon mapping
const iconComponents: Record<string, any> = {
  dumbbell: LucideIcons.Dumbbell,
  users: LucideIcons.Users,
  'heart-pulse': LucideIcons.HeartPulse,
  trophy: LucideIcons.Trophy,
  zap: LucideIcons.Zap,
  settings: LucideIcons.Settings,
  swords: LucideIcons.Swords,
  bike: LucideIcons.Bike,
  activity: LucideIcons.Activity,
  'user-check': LucideIcons.UserCheck,
  repeat: LucideIcons.Repeat,
  'cup-soda': LucideIcons.CupSoda,
  sun: LucideIcons.Sun,
  'shower-head': LucideIcons.Droplets,
  car: LucideIcons.Car,
  coffee: LucideIcons.Coffee,
  move: LucideIcons.Move,
}

// Group facilities by category
const facilityCategories = [
  {
    title: 'Training Areas',
    description: 'Multiple zones for every type of workout',
    facilities: siteConfig.facilities.filter((f) =>
      ['Large Mixed Gyms', 'Ladies Only Zone', 'Power Zone', 'Olympic Gym', 'Calisthenics Zone'].includes(f.name)
    ),
  },
  {
    title: 'Cardio & Classes',
    description: 'Get your heart pumping',
    facilities: siteConfig.facilities.filter((f) =>
      ['Cardio Suites', 'Virtual Spin Studio', 'Fitness Studio', 'Boxing Studio'].includes(f.name)
    ),
  },
  {
    title: 'Equipment',
    description: 'Top-quality equipment for all exercises',
    facilities: siteConfig.facilities.filter((f) =>
      ['Resistance Machines', 'Free Weights', 'Easyline Circuit'].includes(f.name)
    ),
  },
  {
    title: 'Services & Amenities',
    description: 'Everything else you need',
    facilities: siteConfig.facilities.filter((f) =>
      ['Personal Training', 'Protein & Smoothie Bar', 'Sundome', 'Changing & Showers', 'Free Parking', 'Coffee Machine'].includes(f.name)
    ),
  },
]

export default function FacilitiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-brand-charcoal-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="heading-1 text-white mb-4">Our Facilities</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            State-of-the-art equipment and dedicated training zones for every fitness goal.
            Explore everything New Bodies Gym has to offer.
          </p>
        </div>
      </section>

      {/* All Facilities Grid */}
      <Section background="default" className="py-16 lg:py-24">
        <SectionHeader
          subtitle="Everything You Need"
          title="Complete Gym Experience"
          description="From beginners to competitive athletes, we have the facilities to support your journey."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {siteConfig.facilities.map((facility, index) => {
            const IconComponent = iconComponents[facility.icon] || LucideIcons.Dumbbell

            return (
              <div
                key={facility.name}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-brand-lime-500/50 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-lime-500/10 text-brand-lime-500 transition-colors group-hover:bg-brand-lime-500 group-hover:text-brand-charcoal-900">
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{facility.name}</h3>
                <p className="text-sm text-muted-foreground">{facility.description}</p>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Categories */}
      {facilityCategories.map((category, categoryIndex) => (
        <Section
          key={category.title}
          background={categoryIndex % 2 === 0 ? 'muted' : 'default'}
          className="py-16 lg:py-20"
        >
          <div className="mb-12">
            <h2 className="heading-3 mb-2">{category.title}</h2>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {category.facilities.map((facility) => {
              const IconComponent = iconComponents[facility.icon] || LucideIcons.Dumbbell

              return (
                <div
                  key={facility.name}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-lime-500/10">
                    <IconComponent className="h-7 w-7 text-brand-lime-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{facility.name}</h3>
                    <p className="text-sm text-muted-foreground">{facility.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      ))}

      {/* CTA */}
      <Section background="default" className="py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="heading-2 mb-4">Ready to Experience It All?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join New Bodies Gym today and get access to all our facilities and classes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-brand-lime-500 px-8 py-3 font-semibold text-brand-charcoal-900 transition-colors hover:bg-brand-lime-400"
            >
              Join Now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-border px-8 py-3 font-semibold transition-colors hover:bg-muted"
            >
              Book a Tour
            </a>
          </div>
        </div>
      </Section>
    </>
  )
}