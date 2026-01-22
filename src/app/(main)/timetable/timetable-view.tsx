// src/app/(main)/timetable/timetable-view.tsx
'use client'

import { useState, useMemo, useCallback } from 'react'
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Info, 
  X,
  Loader2,
  CalendarDays,
  List,
  LayoutGrid
} from 'lucide-react'

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { ClassCard } from './class-card'
import { ClassDetailModal } from './class-detail-modal'
import { DAYS_OF_WEEK, DAYS_OF_WEEK_LABELS } from '@/lib/constants'

type ViewMode = 'week' | 'day' | 'list'

// Accessible view mode button component
function ViewModeButton({ 
  mode, 
  currentMode, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  mode: ViewMode
  currentMode: ViewMode
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  const isActive = mode === currentMode
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            aria-pressed={isActive}
            aria-label={`Switch to ${label}`}
            className={cn(
              'flex items-center justify-center p-2.5 rounded-lg transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-500 focus-visible:ring-offset-2',
              isActive 
                ? 'bg-brand-lime-500 text-brand-charcoal-900 shadow-md' 
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="ml-2 text-sm font-medium hidden sm:inline">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="sm:hidden">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Filter chip component for active filters
function FilterChip({ 
  label, 
  onRemove 
}: { 
  label: string
  onRemove: () => void 
}) {
  return (
    <Badge 
      variant="secondary" 
      className="pl-2 pr-1 py-1 gap-1 bg-brand-lime-500/10 text-brand-lime-600 border-brand-lime-500/20"
    >
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-1 rounded-full p-0.5 hover:bg-brand-lime-500/20 transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}

// Loading skeleton for week view
function WeekViewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/50">
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="p-3 space-y-2 min-h-[200px]">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Empty state component
function EmptyState({ message, icon: Icon = Calendar }: { message: string; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground max-w-sm">{message}</p>
    </div>
  )
}

export function TimetableView() {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string>(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
  })
  const [selectedClassType, setSelectedClassType] = useState<string>('all')
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { data: schedule, isLoading, error } = useClassSchedule()
  const { data: classTypes } = useClassTypes()
  const { data: instructors } = useInstructors()

  // Get current week dates
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })

  // Get current day name
  const getCurrentDayName = useCallback((): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
  }, [])

  const currentDay = getCurrentDayName()

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
      grouped[day] = filteredSchedule
        .filter((item: any) => item.day_of_week === day)
        .sort((a: any, b: any) => {
          // Sort by time
          const timeA = a.start_time || '00:00'
          const timeB = b.start_time || '00:00'
          return timeA.localeCompare(timeB)
        })
    })
    return grouped
  }, [filteredSchedule])

  // Total classes count for feedback
  const totalFilteredClasses = filteredSchedule.length
  const totalClasses = schedule?.length || 0

  // Navigate weeks
  const prevWeek = () => setSelectedDate(subWeeks(selectedDate, 1))
  const nextWeek = () => setSelectedDate(addWeeks(selectedDate, 1))
  const goToToday = () => {
    setSelectedDate(new Date())
    setSelectedDay(currentDay)
  }

  // Handle class click
  const handleClassClick = useCallback((classItem: any) => {
    setSelectedClass(classItem)
    setIsDetailOpen(true)
  }, [])

  // Clear filters
  const clearFilters = () => {
    setSelectedClassType('all')
    setSelectedInstructor('all')
  }

  const hasFilters = selectedClassType !== 'all' || selectedInstructor !== 'all'

  // Get filter labels for chips
  const getClassTypeName = (id: string) => classTypes?.find((t: any) => t.id === id)?.name
  const getInstructorName = (id: string) => instructors?.find((i: any) => i.id === id)?.name

  return (
    <div className="space-y-6">
      {/* Booking Info Banner - Collapsible on mobile */}
      <Alert className="bg-gradient-to-r from-brand-lime-500/10 to-brand-lime-500/5 border-brand-lime-500/30">
        <Info className="h-4 w-4 text-brand-lime-500 shrink-0" />
        <AlertDescription className="text-sm">
          <span className="font-medium text-brand-lime-600">Booking required for all classes.</span>{' '}
          <span className="text-muted-foreground">
            Book via your membership app, email{' '}
            <a 
              href="mailto:newbodiesgym@hotmail.co.uk" 
              className="text-brand-lime-600 hover:underline font-medium"
            >
              newbodiesgym@hotmail.co.uk
            </a>
            , or call{' '}
            <a 
              href="tel:01298 72006" 
              className="text-brand-lime-600 hover:underline font-medium"
            >
              01298 72006
            </a>
          </span>
        </AlertDescription>
      </Alert>

      {/* Controls Section - Better visual grouping */}
      <div className="flex flex-col gap-4">
        {/* Top row: View modes and filters */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* View Mode Toggle */}
          <div 
            className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl w-fit"
            role="group"
            aria-label="View mode selection"
          >
            <ViewModeButton 
              mode="week" 
              currentMode={viewMode} 
              onClick={() => setViewMode('week')}
              icon={LayoutGrid}
              label="Week"
            />
            <ViewModeButton 
              mode="day" 
              currentMode={viewMode} 
              onClick={() => setViewMode('day')}
              icon={CalendarDays}
              label="Day"
            />
            <ViewModeButton 
              mode="list" 
              currentMode={viewMode} 
              onClick={() => setViewMode('list')}
              icon={List}
              label="List"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedClassType} onValueChange={setSelectedClassType}>
              <SelectTrigger 
                className="w-[150px] bg-background"
                aria-label="Filter by class type"
              >
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classTypes?.map((type: any) => (
                  <SelectItem key={type.id} value={type.id}>
                    <span className="flex items-center gap-2">
                      {type.color && (
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: type.color }}
                        />
                      )}
                      {type.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
              <SelectTrigger 
                className="w-[150px] bg-background"
                aria-label="Filter by instructor"
              >
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
          </div>
        </div>

        {/* Active filters row */}
        {hasFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedClassType !== 'all' && (
              <FilterChip 
                label={getClassTypeName(selectedClassType) || 'Class'} 
                onRemove={() => setSelectedClassType('all')} 
              />
            )}
            {selectedInstructor !== 'all' && (
              <FilterChip 
                label={getInstructorName(selectedInstructor) || 'Instructor'} 
                onRemove={() => setSelectedInstructor('all')} 
              />
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs h-7 px-2"
            >
              Clear all
            </Button>
            <span className="text-xs text-muted-foreground ml-auto">
              Showing {totalFilteredClasses} of {totalClasses} classes
            </span>
          </div>
        )}
      </div>

      {/* Week Navigation - Improved design */}
      {viewMode === 'week' && (
        <div className="flex items-center justify-between bg-muted/30 rounded-xl p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevWeek}
            className="gap-1"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm sm:text-base">
              {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              className="h-7 text-xs bg-background"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Today
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextWeek}
            className="gap-1"
            aria-label="Next week"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <WeekViewSkeleton />}

      {/* Error State */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load class schedule. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}

      {/* Week View - Improved grid and cards */}
      {viewMode === 'week' && !isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {DAYS_OF_WEEK.slice(0, 6).map((day) => {
            const isCurrentDay = day === currentDay
            const classes = scheduleByDay[day] || []

            return (
              <div
                key={day}
                className={cn(
                  'rounded-xl border bg-card overflow-hidden transition-all duration-200',
                  isCurrentDay && 'border-brand-lime-500 ring-2 ring-brand-lime-500/20 shadow-lg shadow-brand-lime-500/5'
                )}
                role="region"
                aria-label={`${DAYS_OF_WEEK_LABELS[day]} schedule`}
              >
                {/* Day Header */}
                <div
                  className={cn(
                    'px-4 py-3 border-b',
                    isCurrentDay 
                      ? 'bg-gradient-to-r from-brand-lime-500/15 to-brand-lime-500/5' 
                      : 'bg-muted/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={cn(
                      'font-semibold text-sm',
                      isCurrentDay && 'text-brand-lime-600'
                    )}>
                      {DAYS_OF_WEEK_LABELS[day]}
                    </h3>
                    {isCurrentDay && (
                      <Badge className="bg-brand-lime-500 text-brand-charcoal-900 text-[10px] px-1.5 py-0">
                        Today
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                  </p>
                </div>

                {/* Classes */}
                <div className="p-2 space-y-2 min-h-[180px] max-h-[400px] overflow-y-auto">
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
                    <div className="flex flex-col items-center justify-center h-[160px] text-center px-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">No classes scheduled</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Day View - Fixed functionality */}
      {viewMode === 'day' && !isLoading && !error && (
        <div className="space-y-6">
          {/* Day Selector - Horizontal scroll on mobile */}
          <div 
            className="flex gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
            role="tablist"
            aria-label="Select day"
          >
            {DAYS_OF_WEEK.slice(0, 6).map((day) => {
              const isCurrentDay = day === currentDay
              const isSelected = day === selectedDay
              const classCount = (scheduleByDay[day] || []).length

              return (
                <button
                  key={day}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`${day}-panel`}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'flex flex-col items-center min-w-[80px] px-4 py-3 rounded-xl transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime-500',
                    isSelected 
                      ? 'bg-brand-lime-500 text-brand-charcoal-900 shadow-md' 
                      : 'bg-muted/50 hover:bg-muted',
                    isCurrentDay && !isSelected && 'ring-2 ring-brand-lime-500/30'
                  )}
                >
                  <span className={cn(
                    'text-xs font-medium',
                    isSelected ? 'text-brand-charcoal-700' : 'text-muted-foreground'
                  )}>
                    {DAYS_OF_WEEK_LABELS[day].slice(0, 3)}
                  </span>
                  <span className="text-lg font-bold mt-0.5">
                    {classCount}
                  </span>
                  {isCurrentDay && (
                    <span className={cn(
                      'text-[10px] mt-0.5',
                      isSelected ? 'text-brand-charcoal-600' : 'text-brand-lime-600'
                    )}>
                      Today
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Selected Day's Classes */}
          <div 
            id={`${selectedDay}-panel`}
            role="tabpanel"
            aria-label={`${DAYS_OF_WEEK_LABELS[selectedDay]} classes`}
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {DAYS_OF_WEEK_LABELS[selectedDay]}
              {selectedDay === currentDay && (
                <Badge className="bg-brand-lime-500 text-brand-charcoal-900">Today</Badge>
              )}
              <span className="text-sm font-normal text-muted-foreground ml-auto">
                {(scheduleByDay[selectedDay] || []).length} classes
              </span>
            </h2>
            
            {(scheduleByDay[selectedDay] || []).length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(scheduleByDay[selectedDay] || []).map((classItem: any) => (
                  <ClassCard
                    key={classItem.id}
                    classItem={classItem}
                    onClick={() => handleClassClick(classItem)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message={`No classes scheduled for ${DAYS_OF_WEEK_LABELS[selectedDay]}`} />
            )}
          </div>
        </div>
      )}

      {/* List View - Better grouping and visual hierarchy */}
      {viewMode === 'list' && !isLoading && !error && (
        <div className="space-y-8">
          {DAYS_OF_WEEK.slice(0, 6).map((day) => {
            const classes = scheduleByDay[day] || []
            const isCurrentDay = day === currentDay

            return (
              <section 
                key={day}
                aria-labelledby={`${day}-heading`}
                className={cn(
                  'rounded-xl border overflow-hidden',
                  isCurrentDay && 'border-brand-lime-500/50'
                )}
              >
                {/* Day Header */}
                <div className={cn(
                  'px-4 py-3 border-b flex items-center justify-between',
                  isCurrentDay 
                    ? 'bg-gradient-to-r from-brand-lime-500/15 to-transparent' 
                    : 'bg-muted/30'
                )}>
                  <h3 
                    id={`${day}-heading`}
                    className={cn(
                      'font-semibold flex items-center gap-2',
                      isCurrentDay && 'text-brand-lime-600'
                    )}
                  >
                    {DAYS_OF_WEEK_LABELS[day]}
                    {isCurrentDay && (
                      <Badge className="bg-brand-lime-500 text-brand-charcoal-900 text-xs">
                        Today
                      </Badge>
                    )}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>

                {/* Classes */}
                <div className="p-4">
                  {classes.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {classes.map((classItem: any) => (
                        <ClassCard
                          key={classItem.id}
                          classItem={classItem}
                          onClick={() => handleClassClick(classItem)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No classes scheduled
                    </p>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {/* Weekend Info - More prominent and useful */}
      <div className="rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-sm flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-brand-lime-500" />
            Saturday
          </h4>
          <p className="text-sm text-muted-foreground">
            Circuit Training: 9:30am – 10:30am
          </p>
        </div>
        <div className="w-px bg-border hidden sm:block" />
        <div className="flex-1">
          <h4 className="font-medium text-sm flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Sunday
          </h4>
          <p className="text-sm text-muted-foreground">
            Gym open for general use. No scheduled classes.
          </p>
        </div>
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