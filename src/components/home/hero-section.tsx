// src/components/home/hero-section.tsx
'use client'

import { useEffect, useState, useMemo, memo, useCallback } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Calendar, Users, Dumbbell, Star, ChevronRight, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'

// Move static data outside component to prevent recreation
const stats = [
  { value: '500+', label: 'Active Members', icon: Users },
  { value: '25+', label: 'Weekly Classes', icon: Calendar },
  { value: '18+', label: 'Facilities', icon: Dumbbell },
  { value: '4.8', label: 'Google Rating', icon: Star },
] as const

const todaysClasses = [
  { name: 'Pilates', time: '9:30am', instructor: 'Sarah', spots: 5, color: 'bg-emerald-500' },
  { name: 'Spin', time: '10:30am', instructor: 'Mike', spots: 3, color: 'bg-rose-500' },
  { name: 'Bodytone', time: '6:00pm', instructor: 'Emma', spots: 12, color: 'bg-blue-500' },
] as const

// Memoized sub-components
const StatCard = memo(function StatCard({ 
  stat, 
  index, 
  shouldAnimate 
}: { 
  stat: typeof stats[number]
  index: number
  shouldAnimate: boolean 
}) {
  const Icon = stat.icon
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      className="group relative p-4 rounded-xl bg-card/80 border border-border hover:border-brand-lime-500/30 transition-colors duration-300 backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-lime-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
      <Icon className="h-5 w-5 text-brand-lime-500 mb-2" />
      <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
      <p className="text-xs lg:text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  )
})

const ClassCard = memo(function ClassCard({ 
  cls, 
  isActive, 
  onClick 
}: { 
  cls: typeof todaysClasses[number]
  isActive: boolean
  onClick: () => void 
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-between rounded-xl bg-muted/50 p-4 border-2 transition-all duration-300 cursor-pointer hover:bg-muted/80",
        isActive 
          ? "border-brand-lime-500/30 bg-muted/80 scale-[1.02]" 
          : "border-transparent"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-lime-500 rounded-r-full" />
      )}
      
      <div className="flex items-center gap-4">
        <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center', cls.color + '/20')}>
          <div className={cn('h-3 w-3 rounded-full', cls.color)} />
        </div>
        <div>
          <p className="font-semibold text-foreground">{cls.name}</p>
          <p className="text-sm text-muted-foreground">
            {cls.time} · {cls.instructor}
          </p>
        </div>
      </div>
      
      <Badge 
        variant="secondary" 
        className={cn(
          "text-xs font-medium",
          cls.spots <= 3 
            ? "bg-rose-500/20 text-rose-600 dark:text-rose-400" 
            : "bg-secondary text-secondary-foreground"
        )}
      >
        {cls.spots <= 3 ? `Only ${cls.spots} left!` : `${cls.spots} spots`}
      </Badge>
    </div>
  )
})

// Static background component - adapts to theme
const HeroBackground = memo(function HeroBackground({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/30">
      {/* Grid pattern - adapts to theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Glow effects */}
      {!prefersReducedMotion ? (
        <>
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-brand-lime-500/10 dark:bg-brand-lime-500/20 blur-[150px] animate-pulse-slow" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-brand-lime-400/5 dark:bg-brand-lime-400/10 blur-[120px] animate-pulse-slower" />
        </>
      ) : (
        <>
          <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-brand-lime-500/10 dark:bg-brand-lime-500/15 blur-[150px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-brand-lime-400/5 dark:bg-brand-lime-400/10 blur-[120px]" />
        </>
      )}
    </div>
  )
})

export function HeroSection() {
  const [activeClass, setActiveClass] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  // Memoize animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }), [])

  // Auto-rotate classes
  useEffect(() => {
    if (prefersReducedMotion) return
    
    const timer = setInterval(() => {
      setActiveClass((prev) => (prev + 1) % todaysClasses.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [prefersReducedMotion])

  // Memoize click handler
  const handleClassClick = useCallback((index: number) => {
    setActiveClass(index)
  }, [])

  return (
    <section className="relative min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      <HeroBackground prefersReducedMotion={!!prefersReducedMotion} />

      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <Badge className="mb-6 bg-brand-lime-500/10 text-brand-lime-600 dark:text-brand-lime-500 border-brand-lime-500/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              {siteConfig.motto}
            </Badge>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              <span className="text-foreground">Your Journey to a</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime-400 via-brand-lime-500 to-brand-lime-400">
                Stronger You
              </span>
              <br />
              <span className="text-foreground">Starts Here</span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Join Buxton's most welcoming gym with state-of-the-art facilities,
              expert trainers, and group classes for{' '}
              <span className="text-brand-lime-600 dark:text-brand-lime-500 font-medium">all fitness levels</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
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
                className="group border-border bg-card/50 text-foreground hover:bg-card hover:border-brand-lime-500/50 h-14 px-8 backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link href="/timetable">
                  <Calendar className="mr-2 h-5 w-5 text-brand-lime-500" />
                  View Timetable
                  <ChevronRight className="ml-1 h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <StatCard 
                  key={stat.label} 
                  stat={stat} 
                  index={index} 
                  shouldAnimate={!prefersReducedMotion}
                />
              ))}
            </div>
          </motion.div>

          {/* Hero Visual - Interactive Class Card */}
          <div className="relative hidden lg:block">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-lime-500/10 via-brand-lime-400/5 to-brand-lime-500/10 dark:from-brand-lime-500/20 dark:via-brand-lime-400/10 dark:to-brand-lime-500/20 rounded-3xl blur-xl opacity-50" />
            
            <div className="relative rounded-2xl bg-gradient-to-br from-card to-muted/50 p-1 shadow-2xl border border-border">
              <div className="rounded-xl bg-card/95 backdrop-blur-xl p-6">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Today's Classes</h3>
                    <p className="text-sm text-muted-foreground">Book your spot now</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">Live</span>
                  </div>
                </div>

                {/* Classes List */}
                <div className="space-y-3 mb-6">
                  {todaysClasses.map((cls, index) => (
                    <ClassCard
                      key={cls.name}
                      cls={cls}
                      isActive={activeClass === index}
                      onClick={() => handleClassClick(index)}
                    />
                  ))}
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {todaysClasses.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleClassClick(index)}
                      aria-label={`Show class ${index + 1}`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        activeClass === index 
                          ? "w-6 bg-brand-lime-500" 
                          : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
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

            {/* Floating Cards */}
            <div className="absolute -left-12 top-1/4 rounded-xl bg-card/95 backdrop-blur-xl border border-border p-4 shadow-xl hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-lime-500/20 to-brand-lime-600/10">
                  <Users className="h-6 w-6 text-brand-lime-500" />
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground">Happy Members</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-8 bottom-1/3 rounded-xl bg-gradient-to-br from-brand-lime-500 to-brand-lime-600 p-4 shadow-xl shadow-brand-lime-500/30 hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-charcoal-900/20">
                  <Star className="h-5 w-5 text-brand-charcoal-900 fill-brand-charcoal-900" />
                </div>
                <div>
                  <p className="font-bold text-brand-charcoal-900">4.8 Rating</p>
                  <p className="text-xs text-brand-charcoal-700">120+ Reviews</p>
                </div>
              </div>
            </div>

            {/* Open Now Badge */}
            <Badge className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 px-3 py-1.5 backdrop-blur-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Open Now
            </Badge>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="h-10 w-6 rounded-full border-2 border-border p-1.5 flex justify-center">
          <div className="h-2 w-1 rounded-full bg-brand-lime-500 animate-bounce" />
        </div>
      </div>
    </section>
  )
}