// src/components/home/testimonials-section.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

import { Section, SectionHeader } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Thompson',
    role: 'Member for 3 years',
    avatar: null,
    rating: 5,
    content:
      "New Bodies Gym has completely transformed my fitness journey. The staff are incredibly supportive, and the facilities are top-notch. The group classes are my favorite - especially the Spin sessions! It's more than a gym, it's a community.",
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Member for 1 year',
    avatar: null,
    rating: 5,
    content:
      "As someone who was nervous about joining a gym, I couldn't have picked a better place. The 'everyone is welcome' motto is absolutely true. The Power Zone has everything I need for my training, and the personal trainers are excellent.",
  },
  {
    id: 3,
    name: 'Emma Davis',
    role: 'Member for 2 years',
    avatar: null,
    rating: 5,
    content:
      "The Ladies Only Zone was a game-changer for me. I feel comfortable and confident working out. The variety of classes included in the membership is amazing - I've tried everything from Pilates to Box HIIT!",
  },
  {
    id: 4,
    name: 'Michael Brown',
    role: 'Member for 6 months',
    avatar: null,
    rating: 5,
    content:
      "Best gym in Buxton by far! The Olympic lifting area is well-equipped, and the atmosphere is always motivating. The early opening times are perfect for my schedule. Highly recommend to anyone serious about their fitness.",
  },
  {
    id: 5,
    name: 'Lisa Chen',
    role: 'Member for 4 years',
    avatar: null,
    rating: 5,
    content:
      "I've been coming here for years and it just keeps getting better. The recent additions like the virtual spin studio and calisthenics zone show they're always improving. The protein bar is a great bonus after a workout!",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const next = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <Section background="default" className="py-20 lg:py-28">
      <SectionHeader
        subtitle="Testimonials"
        title="What Our Members Say"
        description="Don't just take our word for it - hear from the New Bodies Gym community."
      />

      <div className="max-w-4xl mx-auto">
        {/* Testimonial Card */}
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-8 lg:p-12">
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 opacity-10">
            <Quote className="h-24 w-24 text-brand-lime-500" />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-brand-lime-500 text-brand-lime-500"
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-lg lg:text-xl text-foreground mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={testimonials[currentIndex].avatar || undefined} />
                  <AvatarFallback className="bg-brand-lime-500 text-brand-charcoal-900 font-semibold">
                    {getInitials(testimonials[currentIndex].name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={cn(
                'h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'w-8 bg-brand-lime-500'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
            >
              <span className="sr-only">Go to testimonial {index + 1}</span>
            </button>
          ))}
        </div>

        {/* Google Reviews Link */}
        <div className="text-center mt-8">
          <a
            href="https://google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-lime-500 transition-colors"
          >
            <span>⭐ 4.9 rating on Google</span>
            <span className="text-brand-lime-500">View all reviews →</span>
          </a>
        </div>
      </div>
    </Section>
  )
}