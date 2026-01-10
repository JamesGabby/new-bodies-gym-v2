// src/components/home/features-section.tsx
'use client'

import { motion } from 'framer-motion'
import {
  Clock,
  Users,
  Dumbbell,
  Calendar,
  Heart,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'

import { Section, SectionHeader } from '@/components/shared/section'

const features = [
  {
    icon: Dumbbell,
    title: 'State-of-the-Art Equipment',
    description:
      'Full range of resistance machines, free weights, and cardio equipment for every fitness level.',
  },
  {
    icon: Calendar,
    title: 'Classes Included',
    description:
      'All group fitness classes are included in your membership - from Pilates to Spin to Box HIIT.',
  },
  {
    icon: Users,
    title: 'Welcoming Community',
    description:
      "Everyone is welcome at New Bodies. Whether you're a beginner or seasoned athlete, you'll feel at home.",
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description:
      'Open early and late to fit your schedule. Train when it works for you, 6 days a week.',
  },
  {
    icon: Heart,
    title: 'Ladies Only Zone',
    description:
      'Dedicated space for women to train comfortably and confidently.',
  },
  {
    icon: Shield,
    title: 'Expert Guidance',
    description:
      'Professional personal trainers available to help you achieve your goals safely.',
  },
  {
    icon: Sparkles,
    title: 'Premium Amenities',
    description:
      'Protein bar, coffee machine, changing facilities with showers, and free parking.',
  },
  {
    icon: Zap,
    title: 'Easy Booking',
    description:
      'Book classes via our app or website. Simple, fast, and convenient.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturesSection() {
  return (
    <Section background="default" className="py-20 lg:py-28">
      <SectionHeader
        subtitle="Why Choose Us"
        title="Everything You Need to Succeed"
        description="New Bodies Gym offers a complete fitness experience with top facilities, expert support, and a welcoming atmosphere."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-brand-lime-500/50 hover:shadow-lg hover:shadow-brand-lime-500/5"
          >
            {/* Icon */}
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-lime-500/10 text-brand-lime-500 transition-colors group-hover:bg-brand-lime-500 group-hover:text-brand-charcoal-900">
              <feature.icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>

            {/* Hover Gradient */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-brand-lime-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}