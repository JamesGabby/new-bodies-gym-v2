// src/app/(main)/booking/booking-card.tsx
'use client'

import { Clock, MapPin, Users, Flame, Check } from 'lucide-react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useHasBooked } from '@/hooks/use-bookings'
import { ClassInstanceWithDetails } from '@/types'
import { DIFFICULTY_LEVELS } from '@/lib/constants'

interface BookingCardProps {
  classInstance: ClassInstanceWithDetails
  onBook: (classInstance: ClassInstanceWithDetails) => void
  disabled?: boolean
}

export function BookingCard({ classInstance, onBook, disabled }: BookingCardProps) {
  const { data: hasBooked, isLoading: checkingBooking } = useHasBooked(classInstance.id)

  const classType = classInstance.class_type
  const instructor = classInstance.instructor

  const availableSpots = classInstance.max_capacity - classInstance.current_capacity
  const capacityPercentage = (classInstance.current_capacity / classInstance.max_capacity) * 100
  const isFull = availableSpots <= 0

  const difficultyLevel = DIFFICULTY_LEVELS.find(
    (d) => d.value === classType?.difficulty_level
  )

  const formatTime = (time: string) => time.slice(0, 5)

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        'rounded-xl border bg-card p-4 transition-all',
        hasBooked && 'border-brand-lime-500 bg-brand-lime-500/5',
        isFull && !hasBooked && 'opacity-75'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${classType?.color}20` || '#ADFF2F20' }}
          >
            <div
              className="h-6 w-6 rounded-full"
              style={{ backgroundColor: classType?.color || '#ADFF2F' }}
            />
          </div>
          <div>
            <h3 className="font-semibold">{classType?.name || 'Class'}</h3>
            {instructor && (
              <p className="text-sm text-muted-foreground">with {instructor.name}</p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {hasBooked ? (
          <Badge className="bg-brand-lime-500 text-brand-charcoal-900">
            <Check className="h-3 w-3 mr-1" />
            Booked
          </Badge>
        ) : isFull ? (
          <Badge variant="destructive">Full</Badge>
        ) : availableSpots <= 3 ? (
          <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
            {availableSpots} left
          </Badge>
        ) : null}
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {formatTime(classInstance.start_time)} - {formatTime(classInstance.end_time)}
          </span>
          <span className="text-xs">({classType?.duration_minutes || 60} min)</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{classInstance.location || 'Fitness Studio'}</span>
        </div>

        {classType?.calories_burn_estimate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>~{classType.calories_burn_estimate} cal</span>
          </div>
        )}
      </div>

      {/* Capacity */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Availability</span>
          <span className="font-medium">
            {classInstance.current_capacity}/{classInstance.max_capacity}
          </span>
        </div>
        <Progress
          value={capacityPercentage}
          className={cn(
            'h-2',
            capacityPercentage >= 90 && 'bg-red-500/20',
            capacityPercentage >= 70 && capacityPercentage < 90 && 'bg-orange-500/20'
          )}
        />
      </div>

      {/* Action Button */}
      {hasBooked ? (
        <Button variant="outline" className="w-full" disabled>
          <Check className="mr-2 h-4 w-4" />
          Already Booked
        </Button>
      ) : isFull ? (
        <Button variant="outline" className="w-full" disabled>
          Class Full - Join Waitlist
        </Button>
      ) : (
        <Button
          className="w-full bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
          onClick={() => onBook(classInstance)}
          disabled={disabled || checkingBooking}
        >
          Book Now
        </Button>
      )}
    </motion.div>
  )
}