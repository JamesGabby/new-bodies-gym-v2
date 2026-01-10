// src/app/(main)/timetable/timetable-view.tsx
'use client'

import { useState, useMemo } from 'react'
import { format, startOfWeek, addDays, isSameDay, isToday, isBefore } from 'date-fns'
import { ChevronLeft, ChevronRight, Filter, Calendar, Info } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useClassSchedule, useClassTypes, useInstructors } from '@/hooks/use-bookings'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ClassCard } from './class-card'
import { ClassDetailModal } from './class-detail-modal'
import { DAYS_OF_WEEK, DAYS_OF_WEEK_LABELS } from '@/lib/constants'

type ViewMode = 'week' | 'day' | 'list'

export function TimetableView() {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedClassType, setSelectedClassType] = useState<string>('all')
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data: schedule, isLoading } = useClassSchedule()
  const { data: classTypes } = useClassTypes()
  const { data: instructors } = useInstructors()

  // Get current week dates
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Filter schedule
  const filteredSchedule = useMemo(() => {
    if (!schedule) return []

    return schedule.filter((item: any) => {
      if (selectedClassType !== 'all' && item.class_type?.id !== selectedClassType) {
        return false
      }
      if (selectedInstructor !== 'all' && item.instructor?.id !== selectedInstructor) {
        return false
      }
      return true
    })
  }, [schedule, selectedClassType, selectedInstructor])

  // Group schedule by day
  const scheduleByDay = useMemo(() => {
    const grouped: Record<string, any[]> = {}
    DAYS_OF_WEEK.forEach((day) => {
      grouped[day] = filteredSchedule.filter((item: any) => item.day_of_week === day)
    })
    return grouped
  }, [filteredSchedule])

  // Get current day name
  const getCurrentDayName = (): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
  }

  const currentDay = getCurrentDayName()

  // Navigate weeks
  const prevWeek = () => setSelectedDate(addDays(selectedDate, -7))
  const nextWeek = () => setSelectedDate(addDays(selectedDate, 7))
  const goToToday = () => setSelectedDate(new Date())

  // Handle class click
  const handleClassClick = (classItem: any) => {
    setSelectedClass(classItem)
    setIsDetailOpen(true)
  }

  // Clear filters
  const clearFilters = () => {
    setSelectedClassType('all')
    setSelectedInstructor('all')
  }

  const hasFilters = selectedClassType !== 'all' || selectedInstructor !== 'all'

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert className="bg-brand-lime-500/10 border-brand-lime-500/30">
        <Info className="h-4 w-4 text-brand-lime-500" />
        <AlertTitle className="text-brand-lime-500">Booking Required for All Classes</AlertTitle>
        <AlertDescription>
          Book via your membership app or email{' '}
          <a href="mailto:newbodiesgym@hotmail.co.uk" className="text-brand-lime-500 underline">
            newbodiesgym@hotmail.co.uk
          </a>
          . Non-members can call{' '}
          <a href="tel:01298 72006" className="text-brand-lime-500 underline">
            01298 72006
          </a>
          .
        </AlertDescription>
      </Alert>

      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="week">Week View</TabsTrigger>
            <TabsTrigger value="day">Day View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Type Filter */}
          <Select value={selectedClassType} onValueChange={setSelectedClassType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classTypes?.map((type: any) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Instructor Filter */}
          <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Instructors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Instructors</SelectItem>
              {instructors?.map((instructor: any) => (
                <SelectItem key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Week Navigation (for week view) */}
      {viewMode === 'week' && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {DAYS_OF_WEEK.slice(0, 6).map((day) => {
            const isCurrentDay = day === currentDay
            const classes = scheduleByDay[day] || []

            return (
              <div
                key={day}
                className={cn(
                  'rounded-xl border bg-card overflow-hidden',
                  isCurrentDay && 'border-brand-lime-500 ring-2 ring-brand-lime-500/20'
                )}
              >
                {/* Day Header */}
                <div
                  className={cn(
                    'px-4 py-3 border-b',
                    isCurrentDay ? 'bg-brand-lime-500/10' : 'bg-muted/50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={cn('font-semibold', isCurrentDay && 'text-brand-lime-500')}>
                      {DAYS_OF_WEEK_LABELS[day]}
                    </h3>
                    {isCurrentDay && (
                      <Badge className="bg-brand-lime-500 text-brand-charcoal-900 text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Classes */}
                <div className="p-3 space-y-2 min-h-[200px]">
                  {classes.length > 0 ? (
                    classes.map((classItem: any) => (
                      <ClassCard
                        key={classItem.id}
                        classItem={classItem}
                        onClick={() => handleClassClick(classItem)}
                        compact
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      No classes
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {DAYS_OF_WEEK.slice(0, 6).map((day) => {
              const isCurrentDay = day === currentDay

              return (
                <Button
                  key={day}
                  variant={selectedClassType === day ? 'default' : 'outline'}
                  onClick={() => setSelectedDate(new Date())}
                  className={cn(
                    'shrink-0',
                    isCurrentDay && 'border-brand-lime-500'
                  )}
                >
                  {DAYS_OF_WEEK_LABELS[day]}
                  {isCurrentDay && ' (Today)'}
                </Button>
              )
            })}
          </div>

          {/* Day's Classes */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(scheduleByDay[currentDay] || []).map((classItem: any) => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                onClick={() => handleClassClick(classItem)}
              />
            ))}
            {(scheduleByDay[currentDay] || []).length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No classes scheduled for today
              </div>
            )}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {DAYS_OF_WEEK.slice(0, 6).map((day) => {
            const classes = scheduleByDay[day] || []
            if (classes.length === 0) return null

            return (
              <div key={day}>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  {DAYS_OF_WEEK_LABELS[day]}
                  {day === currentDay && (
                    <Badge className="bg-brand-lime-500 text-brand-charcoal-900">Today</Badge>
                  )}
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {classes.map((classItem: any) => (
                    <ClassCard
                      key={classItem.id}
                      classItem={classItem}
                      onClick={() => handleClassClick(classItem)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Saturday Note */}
      <div className="rounded-xl bg-muted/50 p-4 text-sm">
        <p className="font-medium mb-1">Saturday Classes</p>
        <p className="text-muted-foreground">
          Saturday: Circuit Training 9:30am - 10:30am. Sunday: Gym open, no scheduled classes.
        </p>
      </div>

      {/* Class Detail Modal */}
      <ClassDetailModal
        classItem={selectedClass}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedClass(null)
        }}
      />
    </div>
  )
}