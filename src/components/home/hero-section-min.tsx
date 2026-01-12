// src/components/home/hero-section.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Calendar, Users, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: 'Transform Your Body',
      subtitle: 'Start Your Fitness Journey Today',
      image: '/images/hero/gym-main.jpg',
    },
    {
      title: 'Group Classes',
      subtitle: 'Find Your Perfect Workout',
      image: '/images/hero/classes.jpg',
    },
    {
      title: 'Expert Training',
      subtitle: 'Personal Training Available',
      image: '/images/hero/training.jpg',
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section className="relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-brand-charcoal-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-brand-lime-500/10 blur-[120px]" />
      </div>

      {/* Background Image Slideshow */}
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              currentSlide === index ? 'opacity-20' : 'opacity-0'
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal-900 via-brand-charcoal-900/80 to-transparent" />
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-6 bg-brand-lime-500/10 text-brand-lime-500 border-brand-lime-500/20 px-4 py-1.5">
                <span className="mr-2">🏋️</span>
                {siteConfig.motto}
              </Badge>
            </motion.div>

            {/* Heading */}
            <h1 className="heading-1 mb-6">
              <span className="text-foreground">Your Journey to a</span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-brand-lime-400 to-brand-lime-600">
                Stronger You
              </span>
              <br />
              <span className="text-foreground">Starts Here</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Join Buxton's most welcoming gym with state-of-the-art facilities,
              expert trainers, and group classes for all fitness levels. Your
              first step to transformation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400 shadow-glow text-base h-12 px-8"
                asChild
              >
                <Link href="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-brand-lime-500/50 text-foreground hover:bg-brand-lime-500/10 h-12 px-8"
                asChild
              >
                <Link href="/timetable">
                  <Calendar className="mr-2 h-5 w-5" />
                  View Timetable
                </Link>
              </Button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-lime-500" />
                <span>Open 6am - 9:30pm</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-lime-500" />
                <span>All Abilities Welcome</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-brand-lime-500" />
                <span>Classes Included</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Card */}
            <div className="relative rounded-2xl bg-gradient-to-br from-brand-charcoal-800 to-brand-charcoal-900 p-1 shadow-2xl">
              <div className="rounded-xl bg-brand-charcoal-900 p-6">
                {/* Gym Stats Preview */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-lg bg-brand-charcoal-800/50 p-4 text-center">
                    <p className="text-3xl font-bold text-brand-lime-500">18+</p>
                    <p className="text-sm text-muted-foreground">Facilities</p>
                  </div>
                  <div className="rounded-lg bg-brand-charcoal-800/50 p-4 text-center">
                    <p className="text-3xl font-bold text-brand-lime-500">25+</p>
                    <p className="text-sm text-muted-foreground">Weekly Classes</p>
                  </div>
                </div>

                {/* Today's Classes Preview */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Today's Classes
                  </h3>
                  <ClassPreviewItem
                    name="Pilates"
                    time="9:30am"
                    spots={5}
                    color="bg-green-500"
                  />
                  <ClassPreviewItem
                    name="Spin"
                    time="10:30am"
                    spots={8}
                    color="bg-red-500"
                  />
                  <ClassPreviewItem
                    name="Bodytone"
                    time="6:00pm"
                    spots={12}
                    color="bg-blue-500"
                  />
                </div>

                {/* Book Now Button */}
                <Button
                  className="w-full mt-6 bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
                  asChild
                >
                  <Link href="/booking">Book a Class</Link>
                </Button>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -left-8 top-1/4 rounded-xl bg-brand-charcoal-800 border border-brand-charcoal-700 p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-lime-500/20">
                  <Users className="h-5 w-5 text-brand-lime-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">500+</p>
                  <p className="text-xs text-muted-foreground">Active Members</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-4 bottom-1/4 rounded-xl bg-brand-lime-500 p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-charcoal-900/20">
                  <span className="text-xl">⭐</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-brand-charcoal-900">4.9 Rating</p>
                  <p className="text-xs text-brand-charcoal-700">Google Reviews</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-8 w-5 rounded-full border-2 border-muted-foreground/30 p-1"
          >
            <div className="h-2 w-1 rounded-full bg-brand-lime-500 mx-auto" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

// Class Preview Item Component
function ClassPreviewItem({
  name,
  time,
  spots,
  color,
}: {
  name: string
  time: string
  spots: number
  color: string
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-brand-charcoal-800/50 p-3">
      <div className="flex items-center gap-3">
        <div className={cn('h-2 w-2 rounded-full', color)} />
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <Badge variant="secondary" className="text-xs">
        {spots} spots
      </Badge>
    </div>
  )
}