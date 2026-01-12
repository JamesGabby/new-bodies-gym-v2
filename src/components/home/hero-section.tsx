// src/components/home/hero-section.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar, Users, Clock, Dumbbell, Star, ChevronRight, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

const stats = [
  { value: '500+', label: 'Active Members', icon: Users },
  { value: '25+', label: 'Weekly Classes', icon: Calendar },
  { value: '18+', label: 'Facilities', icon: Dumbbell },
  { value: '4.8', label: 'Google Rating', icon: Star },
]

const todaysClasses = [
  { name: 'Pilates', time: '9:30am', instructor: 'Sarah', spots: 5, color: 'bg-emerald-500' },
  { name: 'Spin', time: '10:30am', instructor: 'Mike', spots: 3, color: 'bg-rose-500' },
  { name: 'Bodytone', time: '6:00pm', instructor: 'Emma', spots: 12, color: 'bg-blue-500' },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [activeClass, setActiveClass] = useState(0)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setActiveClass((prev) => (prev + 1) % todaysClasses.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 bg-brand-charcoal-900">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-brand-lime-500/20 blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-brand-lime-400/10 blur-[120px]"
        />
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('/images/noise.png')]" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-6 bg-brand-lime-500/10 text-brand-lime-500 border-brand-lime-500/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="mr-2 h-4 w-4" />
                {siteConfig.motto}
              </Badge>
            </motion.div>

            {/* Heading with Better Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              <span className="text-white">Your Journey to a</span>
              <br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime-400 via-brand-lime-500 to-brand-lime-400 animate-gradient">
                  Stronger You
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-brand-lime-500/0 via-brand-lime-500 to-brand-lime-500/0 origin-left"
                />
              </span>
              <br />
              <span className="text-white">Starts Here</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Join Buxton's most welcoming gym with state-of-the-art facilities,
              expert trainers, and group classes for{' '}
              <span className="text-brand-lime-500 font-medium">all fitness levels</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <Button
                size="lg"
                className="group bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400 shadow-lg shadow-brand-lime-500/25 hover:shadow-brand-lime-500/40 transition-all duration-300 text-base h-14 px-8 font-semibold"
                asChild
              >
                <Link href="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-brand-charcoal-600 bg-brand-charcoal-800/50 text-white hover:bg-brand-charcoal-800 hover:border-brand-lime-500/50 h-14 px-8 backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link href="/timetable">
                  <Calendar className="mr-2 h-5 w-5 text-brand-lime-500" />
                  View Timetable
                  <ChevronRight className="ml-1 h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="group relative p-4 rounded-xl bg-brand-charcoal-800/30 border border-brand-charcoal-700/50 hover:border-brand-lime-500/30 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <stat.icon className="h-5 w-5 text-brand-lime-500 mb-2" />
                  <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Visual - Interactive Class Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-lime-500/20 via-brand-lime-400/10 to-brand-lime-500/20 rounded-3xl blur-xl opacity-50" />
              
              <div className="relative rounded-2xl bg-gradient-to-br from-brand-charcoal-800 to-brand-charcoal-900 p-1 shadow-2xl">
                <div className="rounded-xl bg-brand-charcoal-900/90 backdrop-blur-xl p-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-white text-lg">Today's Classes</h3>
                      <p className="text-sm text-muted-foreground">Book your spot now</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-emerald-500 font-medium">Live</span>
                    </div>
                  </div>

                  {/* Classes List */}
                  <div className="space-y-3 mb-6">
                    {todaysClasses.map((cls, index) => (
                      <motion.div
  initial={false}
  key={cls.name}
  animate={{
    scale: activeClass === index ? 1.02 : 1,
  }}
  className={cn(
    "relative flex items-center justify-between rounded-xl bg-brand-charcoal-800/50 p-4 border-2 transition-all duration-300 cursor-pointer hover:bg-brand-charcoal-800/80",
    activeClass === index 
      ? "border-brand-lime-500/30 bg-brand-charcoal-800/80" 
      : "border-transparent"
  )}
>
                        {/* Active Indicator */}
                        {activeClass === index && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-lime-500 rounded-r-full"
                          />
                        )}
                        
                        <div className="flex items-center gap-4">
                          <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', cls.color + '/20')}>
                            <div className={cn('h-3 w-3 rounded-full', cls.color)} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{cls.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {cls.time} · {cls.instructor}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-xs font-medium",
                              cls.spots <= 3 
                                ? "bg-rose-500/20 text-rose-400" 
                                : "bg-brand-charcoal-700 text-white"
                            )}
                          >
                            {cls.spots <= 3 ? `Only ${cls.spots} left!` : `${cls.spots} spots`}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center gap-2 mb-6">
                    {todaysClasses.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveClass(index)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          activeClass === index 
                            ? "w-6 bg-brand-lime-500" 
                            : "w-1.5 bg-brand-charcoal-600 hover:bg-brand-charcoal-500"
                        )}
                      />
                    ))}
                  </div>

                  {/* Book Now Button */}
                  <Button
                    className="w-full bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400 h-12 font-semibold shadow-lg shadow-brand-lime-500/20 transition-all duration-300 hover:shadow-brand-lime-500/40"
                    asChild
                  >
                    <Link href="/booking">
                      Book a Class
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -left-12 top-1/4 rounded-xl bg-brand-charcoal-800/90 backdrop-blur-xl border border-brand-charcoal-700/50 p-4 shadow-xl cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-lime-500/20 to-brand-lime-600/10">
                  <Users className="h-6 w-6 text-brand-lime-500" />
                </div>
                <div>
                  <p className="font-bold text-lg text-white">500+</p>
                  <p className="text-xs text-muted-foreground">Happy Members</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -right-8 bottom-1/3 rounded-xl bg-gradient-to-br from-brand-lime-500 to-brand-lime-600 p-4 shadow-xl shadow-brand-lime-500/30 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-charcoal-900/20">
                  <Star className="h-5 w-5 text-brand-charcoal-900 fill-brand-charcoal-900" />
                </div>
                <div>
                  <p className="font-bold text-brand-charcoal-900">4.8 Rating</p>
                  <p className="text-xs text-brand-charcoal-700">120+ Reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Open Now Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="absolute top-4 right-4"
            >
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1.5 backdrop-blur-sm">
                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Open Now
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-10 w-6 rounded-full border-2 border-brand-charcoal-600 p-1.5 flex justify-center"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-brand-lime-500"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}