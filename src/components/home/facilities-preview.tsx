// src/components/home/facilities-preview.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

import { Section, SectionHeader } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'

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

// Featured facilities (first 8)
const featuredFacilities = siteConfig.facilities.slice(0, 8)
const additionalCount = siteConfig.facilities.length - 8

export function FacilitiesPreview() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <Section background="default" className="py-20 lg:py-28">
      <SectionHeader
        subtitle="Our Facilities"
        title="Everything Under One Roof"
        description="From cardio to weights, group classes to personal training - we have everything you need for your fitness journey."
      />

      {/* Facilities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {featuredFacilities.map((facility, index) => {
          const IconComponent = iconComponents[facility.icon] || LucideIcons.Dumbbell
          const isHovered = hoveredIndex === index

          return (
            <motion.div
              key={facility.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                'group relative rounded-xl border bg-card p-5 transition-all cursor-pointer',
                isHovered
                  ? 'border-brand-lime-500 shadow-lg shadow-brand-lime-500/10'
                  : 'border-border hover:border-brand-lime-500/50'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-all',
                  isHovered
                    ? 'bg-brand-lime-500 text-brand-charcoal-900'
                    : 'bg-brand-lime-500/10 text-brand-lime-500'
                )}
              >
                <IconComponent className="h-6 w-6" />
              </div>

              {/* Name */}
              <h3 className="font-semibold text-sm mb-1">{facility.name}</h3>

              {/* Description (shown on hover) */}
              <AnimatePresence>
                {isHovered && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground"
                  >
                    {facility.description}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Check icon */}
              <div className="absolute top-3 right-3">
                <Check
                  className={cn(
                    'h-4 w-4 transition-colors',
                    isHovered ? 'text-brand-lime-500' : 'text-muted-foreground/30'
                  )}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* More facilities indicator */}
      {additionalCount > 0 && (
        <p className="text-center text-muted-foreground mb-8">
          Plus {additionalCount} more facilities including changing rooms, free parking, and more!
        </p>
      )}

      {/* Highlight Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <HighlightCard
          title="Ladies Only Zone"
          description="Dedicated training space for women"
          icon={LucideIcons.Heart}
          color="pink"
        />
        <HighlightCard
          title="Olympic Lifting"
          description="Fully equipped for serious lifters"
          icon={LucideIcons.Trophy}
          color="amber"
        />
        <HighlightCard
          title="Group Studios"
          description="Multiple studios for classes"
          icon={LucideIcons.Users}
          color="blue"
        />
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button
          size="lg"
          className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
          asChild
        >
          <Link href="/facilities">
            Explore All Facilities
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </Section>
  )
}

// Highlight Card Component
function HighlightCard({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string
  description: string
  icon: any
  color: 'pink' | 'amber' | 'blue'
}) {
  const colorClasses = {
    pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  }

  const iconColors = {
    pink: 'text-pink-500',
    amber: 'text-amber-500',
    blue: 'text-blue-500',
  }

  return (
    <div
      className={cn(
        'rounded-xl border bg-gradient-to-br p-6 text-center',
        colorClasses[color]
      )}
    >
      <Icon className={cn('h-8 w-8 mx-auto mb-3', iconColors[color])} />
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}