// src/components/home/cta-section.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone, MapPin, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-brand-charcoal-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-brand-lime-500/10 blur-[150px]" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-brand-lime-500 uppercase tracking-wider mb-4">
              Start Your Journey
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-white mb-6">
              Ready to Transform Your
              <br />
              <span className="text-brand-lime-500">Fitness Journey?</span>
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join Buxton's most welcoming gym today. Whether you're just starting out or
              looking to take your training to the next level, we're here to help.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400 shadow-glow h-14 px-8 text-base"
                asChild
              >
                <Link href="/signup">
                  Join Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base"
                asChild
              >
                <a href={`tel:${siteConfig.contact.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us: {siteConfig.contact.phone}
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {/* Address */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lime-500/10">
                  <MapPin className="h-5 w-5 text-brand-lime-500" />
                </div>
                <h3 className="font-semibold text-white">Location</h3>
              </div>
              <address className="text-sm text-white/70 not-italic">
                {siteConfig.contact.address.line1}
                <br />
                {siteConfig.contact.address.line2}
                <br />
                {siteConfig.contact.address.city}, {siteConfig.contact.address.postcode}
              </address>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.contact.address.full)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-lime-500 hover:underline mt-2 inline-block"
              >
                Get Directions →
              </a>
            </div>

            {/* Hours */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lime-500/10">
                  <Clock className="h-5 w-5 text-brand-lime-500" />
                </div>
                <h3 className="font-semibold text-white">Hours</h3>
              </div>
              <div className="text-sm text-white/70 space-y-1">
                <div className="flex justify-between">
                  <span>Mon - Thu</span>
                  <span>6:00am - 9:30pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>6:00am - 8:00pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Sat - Sun</span>
                  <span>9:00am - 3:00pm</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lime-500/10">
                  <Phone className="h-5 w-5 text-brand-lime-500" />
                </div>
                <h3 className="font-semibold text-white">Contact</h3>
              </div>
              <div className="text-sm text-white/70 space-y-2">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="block hover:text-brand-lime-500 transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="block hover:text-brand-lime-500 transition-colors truncate"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
              <Link
                href="/contact"
                className="text-sm text-brand-lime-500 hover:underline mt-2 inline-block"
              >
                Send a Message →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}