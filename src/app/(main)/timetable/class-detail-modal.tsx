// src/app/(main)/timetable/class-detail-modal.tsx
'use client'

import Link from 'next/link'
import {
  Clock,
  MapPin,
  Users,
  Flame,
  Calendar,
  User,
  Dumbbell,
  X,
  Info,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { DIFFICULTY_LEVELS, DAYS_OF_WEEK_LABELS } from '@/lib/constants'

interface ClassDetailModalProps {
  classItem: any
  isOpen: boolean
  onClose: () => void
}

export function ClassDetailModal({ classItem, isOpen, onClose }: ClassDetailModalProps) {
  if (!classItem) return null

  const classType = classItem.class_type
  const instructor = classItem.instructor

  const difficultyLevel = DIFFICULTY_LEVELS.find(
    (d) => d.value === classType?.difficulty_level
  )

  const formatTime = (time: string) => time.slice(0, 5)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start gap-4">
            {/* Class Icon */}
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${classType?.color}20` || '#ADFF2F20' }}
            >
              <Dumbbell
                className="h-7 w-7"
                style={{ color: classType?.color || '#ADFF2F' }}
              />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl">{classType?.name || 'Class'}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {DAYS_OF_WEEK_LABELS[classItem.day_of_week]}
                <span>•</span>
                <Clock className="h-4 w-4" />
                {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="space-y-6 mt-4">
          {/* Description */}
          {classType?.description && (
            <p className="text-muted-foreground">{classType.description}</p>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">{classType?.duration_minutes || 60} minutes</p>
            </div>

            {/* Difficulty */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-2 w-2 rounded-full',
                        i < (classType?.difficulty_level || 1)
                          ? 'bg-brand-lime-500'
                          : 'bg-muted-foreground/30'
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium text-sm">{difficultyLevel?.label || 'All Levels'}</span>
              </div>
            </div>

            {/* Location */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Location</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-lime-500" />
                <p className="font-medium">{classItem.location || 'Fitness Studio'}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-1">Capacity</p>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-lime-500" />
                <p className="font-medium">
                  Max {classItem.max_capacity || classType?.max_capacity || 20}
                </p>
              </div>
            </div>
          </div>

          {/* Calories */}
          {classType?.calories_burn_estimate && (
            <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-4 flex items-center gap-3">
              <Flame className="h-6 w-6 text-orange-500" />
              <div>
                <p className="font-medium">Estimated Calorie Burn</p>
                <p className="text-sm text-muted-foreground">
                  ~{classType.calories_burn_estimate} calories per session
                </p>
              </div>
            </div>
          )}

          {/* Instructor */}
          {instructor && (
            <>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{instructor.name}</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
              </div>
            </>
          )}

          {/* Equipment Needed */}
          {classType?.equipment_needed && classType.equipment_needed.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Equipment Provided</p>
                <div className="flex flex-wrap gap-2">
                  {classType.equipment_needed.map((item: string) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Booking Info */}
          <div className="rounded-lg bg-brand-lime-500/10 border border-brand-lime-500/20 p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-brand-lime-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-brand-lime-500 mb-1">Booking Required</p>
                <p className="text-muted-foreground">
                  Book via the New Bodies Gym app or call{' '}
                  <a href="tel:01298 72006" className="text-brand-lime-500 hover:underline">
                    01298 72006
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button
            className="flex-1 bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
            asChild
          >
            <Link href="/booking">Book This Class</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}