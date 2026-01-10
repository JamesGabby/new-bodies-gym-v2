// src/components/home/gym-rules-section.tsx
'use client'

import { motion } from 'framer-motion'
import {
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  Heart,
  Smartphone,
  Phone,
} from 'lucide-react'

import { Section } from '@/components/shared/section'
import { siteConfig } from '@/config/site'

const rules = [
  {
    icon: CalendarCheck,
    title: 'Book Your Class',
    description:
      'Book your class place via the booking link or New Bodies App. Non-members can call to book.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: CreditCard,
    title: 'Membership Required',
    description:
      'Valid live membership required to book classes online. Non-members welcome via phone booking.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Train Safely',
    description:
      'Train safely at all times, put equipment back after use, and respect others training around you.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Heart,
    title: 'Enjoy Your Training',
    description:
      "Most of all, enjoy your training! We're here to help you achieve your fitness goals.",
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
]

export function GymRulesSection() {
  return (
    <Section background="muted" className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-semibold text-brand-lime-500 uppercase tracking-wider mb-2">
            Important Information
          </span>
          <h2 className="heading-2 mb-4">Gym Open & Everyone Welcome</h2>
          <p className="text-lg text-muted-foreground">
            Booking is not essential to use the gym - just for classes. Please
            follow the guidance below.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 rounded-xl border border-border bg-card p-6"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${rule.bgColor}`}
              >
                <rule.icon className={`h-6 w-6 ${rule.color}`} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{rule.title}</h3>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Options */}
        <div className="rounded-2xl bg-brand-charcoal-800 p-6 lg:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* App Download */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-lime-500/10">
                <Smartphone className="h-6 w-6 text-brand-lime-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-white">Download the App</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Book classes easily via the New Bodies Gym App
                </p>
                <div className="flex gap-2">
                  <a
                    href={siteConfig.links.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-lime-500 hover:underline"
                  >
                    iOS App Store
                  </a>
                  <span className="text-muted-foreground">|</span>
                  <a
                    href={siteConfig.links.playStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-lime-500 hover:underline"
                  >
                    Google Play
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Booking */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-lime-500/10">
                <Phone className="h-6 w-6 text-brand-lime-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-white">Non-Members</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Call to book a class or arrange a visit
                </p>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-lg font-semibold text-brand-lime-500 hover:underline"
                >
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}