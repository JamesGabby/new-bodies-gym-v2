// src/components/home/app-download-section.tsx (continued)
'use client'

import { motion } from 'framer-motion'
import { Smartphone, Calendar, Bell, BarChart3, Apple, PlayCircle } from 'lucide-react'

import { Section } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

const appFeatures = [
  {
    icon: Calendar,
    title: 'Book Classes',
    description: 'Reserve your spot in any class with just a tap',
  },
  {
    icon: Bell,
    title: 'Get Reminders',
    description: 'Never miss a class with push notifications',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    description: 'Monitor your fitness journey over time',
  },
]

export function AppDownloadSection() {
  return (
    <Section background="muted" className="py-20 lg:py-28 overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-sm font-semibold text-brand-lime-500 uppercase tracking-wider mb-2">
            Download Our App
          </span>
          <h2 className="heading-2 mb-4">
            Your Gym in Your Pocket
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Book classes, manage your membership, and track your fitness journey - all from the New Bodies Gym app.
          </p>

          {/* App Features */}
          <div className="space-y-4 mb-8">
            {appFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lime-500/10">
                  <feature.icon className="h-5 w-5 text-brand-lime-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-14 px-6"
              asChild
            >
              <a
                href={siteConfig.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Apple className="mr-3 h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 h-14 px-6"
              asChild
            >
              <a
                href={siteConfig.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayCircle className="mr-3 h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs opacity-80">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative hidden lg:flex justify-center"
        >
          <div className="relative">
            {/* Phone Frame */}
            <div className="relative w-[280px] h-[560px] rounded-[3rem] bg-brand-charcoal-800 p-3 shadow-2xl">
              {/* Screen */}
              <div className="h-full w-full rounded-[2.5rem] bg-brand-charcoal-900 overflow-hidden">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 bg-brand-charcoal-800">
                  <span className="text-xs text-white">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 rounded-sm bg-white/50" />
                    <div className="w-4 h-2 rounded-sm bg-white/50" />
                    <div className="w-6 h-2 rounded-sm bg-brand-lime-500" />
                  </div>
                </div>

                {/* App Content Preview */}
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-brand-lime-500 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-brand-charcoal-900" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">New Bodies Gym</h4>
                      <p className="text-xs text-white/60">Welcome back, Sarah!</p>
                    </div>
                  </div>

                  {/* Today's Booking */}
                  <div className="rounded-xl bg-brand-charcoal-800 p-4 mb-4">
                    <p className="text-xs text-white/60 mb-2">Today's Booking</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm">Spin Class</p>
                        <p className="text-xs text-white/60">10:30 AM - 11:30 AM</p>
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-brand-lime-500 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-brand-charcoal-900" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-brand-lime-500/10 p-3 text-center">
                      <Calendar className="h-5 w-5 text-brand-lime-500 mx-auto mb-1" />
                      <p className="text-xs text-white">Book Class</p>
                    </div>
                    <div className="rounded-xl bg-brand-lime-500/10 p-3 text-center">
                      <BarChart3 className="h-5 w-5 text-brand-lime-500 mx-auto mb-1" />
                      <p className="text-xs text-white">My Stats</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-brand-charcoal-800 rounded-b-2xl" />
            </div>

            {/* Floating Notification */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -right-4 top-1/3 rounded-xl bg-white p-3 shadow-xl w-48"
            >
              <div className="flex items-start gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-lime-500 flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-brand-charcoal-900" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-charcoal-900">Class Reminder</p>
                  <p className="text-[10px] text-brand-charcoal-600">Spin starts in 30 mins</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, x: -20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="absolute -left-8 bottom-1/4 rounded-xl bg-brand-lime-500 p-3 shadow-xl"
            >
              <p className="text-xs font-semibold text-brand-charcoal-900 mb-1">This Week</p>
              <p className="text-2xl font-bold text-brand-charcoal-900">5</p>
              <p className="text-[10px] text-brand-charcoal-700">classes attended</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}