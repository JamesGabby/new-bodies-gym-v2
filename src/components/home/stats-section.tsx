// src/components/home/stats-section.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Dumbbell, Calendar, Award } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: 500,
    suffix: '+',
    label: 'Active Members',
    description: 'Growing community',
  },
  {
    icon: Dumbbell,
    value: 18,
    suffix: '+',
    label: 'Facilities',
    description: 'State-of-the-art equipment',
  },
  {
    icon: Calendar,
    value: 25,
    suffix: '+',
    label: 'Weekly Classes',
    description: 'Included in membership',
  },
  {
    icon: Award,
    value: 15,
    suffix: '+',
    label: 'Years Experience',
    description: 'Trusted local gym',
  },
]

function AnimatedCounter({
  value,
  suffix = '',
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="text-4xl font-bold text-brand-lime-500 lg:text-5xl"
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {value}
          {suffix}
        </motion.span>
      )}
    </motion.span>
  )
}

export function StatsSection() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-brand-charcoal-900/50" />

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-brand-lime-500/10 mb-4">
                <stat.icon className="h-7 w-7 text-brand-lime-500" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 font-semibold text-foreground">{stat.label}</p>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}