// src/components/home/timetable-preview.tsx
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { Section, SectionHeader } from '@/components/shared/section'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { DAYS_OF_WEEK_LABELS } from '@/lib/constants'

// Get current day of week
function getCurrentDay(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

export async function TimetablePreview() {
  const supabase = await createClient()
  const currentDay = getCurrentDay()

  // Fetch today's and tomorrow's classes
  const daysToShow = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDayIndex = daysToShow.indexOf(currentDay)
  const displayDays = currentDay === 'sunday' 
    ? daysToShow.slice(0, 3) 
    : daysToShow.slice(Math.max(0, currentDayIndex), Math.max(0, currentDayIndex) + 3)

  const { data: schedule } = await supabase
    .from('class_schedule')
    .select(`
      *,
      class_type:class_types (
        id,
        name,
        slug,
        color,
        duration_minutes
      ),
      instructor:instructors (
        id,
        name
      )
    `)
    .eq('is_active', true)
    .in('day_of_week', displayDays.length > 0 ? displayDays : ['monday', 'tuesday', 'wednesday'])
    .order('start_time', { ascending: true })

  // Group by day
  const groupedSchedule = (schedule || []).reduce((acc, item) => {
    const day = item.day_of_week
    if (!acc[day]) acc[day] = []
    acc[day].push(item)
    return acc
  }, {} as Record<string, typeof schedule>)

  const displayDaysFinal = displayDays.length > 0 ? displayDays : ['monday', 'tuesday', 'wednesday']

  return (
    <Section background="muted" className="py-20 lg:py-28">
      <SectionHeader
        subtitle="Group Exercise"
        title="Class Timetable"
        description="All classes are included in your membership. Book your spot via our app or website."
      />

      {/* Timetable Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {displayDaysFinal.map((day) => {
          const classes = groupedSchedule[day] || []
          const isToday = day === currentDay

          return (
            <div
              key={day}
              className={cn(
                'rounded-2xl border bg-card p-6 transition-all',
                isToday
                  ? 'border-brand-lime-500/50 ring-2 ring-brand-lime-500/20'
                  : 'border-border'
              )}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {DAYS_OF_WEEK_LABELS[day]}
                  </h3>
                  {isToday && (
                    <Badge className="bg-brand-lime-500 text-brand-charcoal-900">
                      Today
                    </Badge>
                  )}
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Classes List */}
              {classes.length > 0 ? (
                <div className="space-y-3">
                  {classes.slice(0, 5).map((classItem: any) => (
                    <ClassItem
                      key={classItem.id}
                      name={classItem.class_type?.name || 'Class'}
                      time={`${classItem.start_time.slice(0, 5)} - ${classItem.end_time.slice(0, 5)}`}
                      color={classItem.class_type?.color || '#ADFF2F'}
                      instructor={classItem.instructor?.name}
                    />
                  ))}
                  {classes.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{classes.length - 5} more classes
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No classes scheduled</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          size="lg"
          className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
          asChild
        >
          <Link href="/timetable">
            View Full Timetable
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/booking">Book a Class</Link>
        </Button>
      </div>

      {/* Note */}
      <p className="text-center text-sm text-muted-foreground mt-6">
        <strong>Booking required for all classes</strong> via your membership app
        or email newbodiesgym@hotmail.co.uk
      </p>
    </Section>
  )
}

// Class Item Component
function ClassItem({
  name,
  time,
  color,
  instructor,
}: {
  name: string
  time: string
  color: string
  instructor?: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted">
      <div
        className="h-10 w-1 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        {instructor && (
          <p className="text-xs text-muted-foreground truncate">
            with {instructor}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
        <Clock className="h-3 w-3" />
        {time}
      </div>
    </div>
  )
}