// src/app/(main)/timetable/class-card.tsx
'use client'

import { Clock, MapPin, Users, User, Flame, Dumbbell } from 'lucide-react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DIFFICULTY_LEVELS } from '@/lib/constants'

interface ClassCardProps {
  classItem: any
  onClick?: () => void
  compact?: boolean
  showBookButton?: boolean
}

export function ClassCard({
  classItem,
  onClick,
  compact = false,
  showBookButton = false,
}: ClassCardProps) {
  const classType = classItem.class_type
  const instructor = classItem.instructor

  const difficultyLevel = DIFFICULTY_LEVELS.find(
    (d) => d.value === classType?.difficulty_level
  )

  // Format time
  const formatTime = (time: string) => {
    return time.slice(0, 5)
  }

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="group cursor-pointer rounded-lg bg-muted/50 p-3 transition-all hover:bg-muted hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          {/* Color Bar */}
          <div
            className="w-1 h-full min-h-[40px] rounded-full shrink-0"
            style={{ backgroundColor: classType?.color || '#ADFF2F' }}
          />

          <div className="flex-1 min-w-0">
            {/* Class Name */}
            <p className="font-medium text-sm truncate group-hover:text-brand-lime-500 transition-colors">
              {classType?.name || 'Class'}
            </p>

            {/* Time */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>
                {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
              </span>
            </div>

            {/* Instructor */}
            {instructor && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {instructor.name}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        'group cursor-pointer rounded-xl border bg-card p-4 transition-all',
        'hover:border-brand-lime-500/50 hover:shadow-lg'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Color Dot */}
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${classType?.color}20` || '#ADFF2F20' }}
          >
            <Dumbbell
              className="h-5 w-5"
              style={{ color: classType?.color || '#ADFF2F' }}
            />
          </div>
          <div>
            <h3 className="font-semibold group-hover:text-brand-lime-500 transition-colors">
              {classType?.name || 'Class'}
            </h3>
            {instructor && (
              <p className="text-sm text-muted-foreground">with {instructor.name}</p>
            )}
          </div>
        </div>

        {/* Difficulty Badge */}
        {difficultyLevel && (
          <Badge
            variant="secondary"
            className={cn('text-xs', `bg-${difficultyLevel.color}-500/10 text-${difficultyLevel.color}-500`)}
          >
            {difficultyLevel.label}
          </Badge>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        {/* Time */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
          </span>
          <span className="text-xs">({classType?.duration_minutes || 60} min)</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{classItem.location || 'Fitness Studio'}</span>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Max {classItem.max_capacity || classType?.max_capacity || 20} people</span>
        </div>

        {/* Calories */}
        {classType?.calories_burn_estimate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>~{classType.calories_burn_estimate} calories</span>
          </div>
        )}
      </div>

      {/* Description */}
      {classType?.description && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {classType.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Included in all memberships
        </span>
        <span className="text-xs text-brand-lime-500 group-hover:underline">
          View Details →
        </span>
      </div>
    </motion.div>
  )
}