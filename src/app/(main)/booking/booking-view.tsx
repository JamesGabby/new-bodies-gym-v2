// src/app/(main)/booking/booking-view.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import { format, addDays, isSameDay, isBefore, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useClassInstances, useClassTypes, useCreateBooking } from '@/hooks/use-bookings'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BookingCard } from './booking-card'
import { BookingConfirmModal } from './booking-confirm-modal'
import { ClassInstanceWithDetails } from '@/types'

export function BookingView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedClassType, setSelectedClassType] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<ClassInstanceWithDetails | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { hasActiveMembership } = useAuthStore()

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate date range (2 weeks)
  const startDate = format(selectedDate, 'yyyy-MM-dd')
  const endDate = format(addDays(selectedDate, 0), 'yyyy-MM-dd')

  const { data: classInstances, isLoading } = useClassInstances(startDate, endDate)

  const { data: classTypes } = useClassTypes()
  const createBooking = useCreateBooking()

  // Filter classes
  const filteredClasses = useMemo(() => {
    if (!classInstances) return []

    return classInstances.filter((instance) => {
      if (selectedClassType !== 'all' && instance.class_type_id !== selectedClassType) {
        return false
      }
      return true
    })
  }, [classInstances, selectedClassType])

  // Generate next 14 days for quick selection
  const nextDays = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))
  }, [])

  // Handle booking
  const handleBookClass = (classInstance: ClassInstanceWithDetails) => {
    setSelectedClass(classInstance)
    setIsConfirmOpen(true)
  }

  const confirmBooking = async () => {
    if (!selectedClass) return

    await createBooking.mutateAsync({
      classInstanceId: selectedClass.id,
    })

    setIsConfirmOpen(false)
    setSelectedClass(null)
  }

  // Check if date has classes
  const hasClassesOnDate = (date: Date): boolean => {
    if (!classInstances) return false
    return classInstances.some((instance) =>
      isSameDay(new Date(instance.date), date)
    )
  }

  // Navigate dates
  const prevDay = () => {
    const newDate = addDays(selectedDate, -1)
    if (!isBefore(newDate, startOfDay(new Date()))) {
      setSelectedDate(newDate)
    }
  }

  const nextDay = () => setSelectedDate(addDays(selectedDate, 1))

  // Don't render auth-dependent content until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        {/* Show a loading skeleton or minimal UI */}
        <div className="rounded-xl border bg-card p-4 animate-pulse h-32" />
        <div className="rounded-xl border bg-card p-4 animate-pulse h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Membership Check */}
      {!hasActiveMembership() && (
        <Alert variant="destructive">
          <AlertTitle>Active Membership Required</AlertTitle>
          <AlertDescription>
            You need an active membership to book classes online.{' '}
            <a href="/signup" className="underline font-medium">
              Join now
            </a>{' '}
            or call{' '}
            <a href="tel:01298 72006" className="underline font-medium">
              01298 72006
            </a>{' '}
            to book as a non-member.
          </AlertDescription>
        </Alert>
      )}

      {/* Date Selection */}
      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Date Navigator */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevDay}
              disabled={isBefore(addDays(selectedDate, -1), startOfDay(new Date()))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[200px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="icon" onClick={nextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Class Type Filter */}
          <Select value={selectedClassType} onValueChange={setSelectedClassType}>
            <SelectTrigger className="w-[180px]">
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
        </div>

        {/* Quick Date Selection */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {nextDays.slice(0, 7).map((date) => {
            const isSelected = isSameDay(date, selectedDate)
            const isToday = isSameDay(date, new Date())

            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  'flex flex-col items-center min-w-[60px] rounded-lg p-2 transition-colors',
                  isSelected
                    ? 'bg-brand-lime-500 text-brand-charcoal-900'
                    : 'hover:bg-muted'
                )}
              >
                <span className="text-xs font-medium">
                  {isToday ? 'Today' : format(date, 'EEE')}
                </span>
                <span className="text-lg font-bold">{format(date, 'd')}</span>
                <span className="text-xs">{format(date, 'MMM')}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Classes for Selected Date */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Classes on {format(selectedDate, 'EEEE, MMMM d')}
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-lime-500" />
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classInstance) => (
              <BookingCard
                key={classInstance.id}
                classInstance={classInstance}
                onBook={handleBookClass}
                disabled={!hasActiveMembership()}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-xl bg-muted/50">
            <p className="text-muted-foreground">
              No classes scheduled for this date
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try selecting a different date or class type
            </p>
          </div>
        )}
      </div>

      {/* Note */}
      <div className="text-sm text-muted-foreground text-center">
        <p>
          Classes fill up fast! Book early to secure your spot.
          <br />
          Cancellations must be made at least 2 hours before class time.
        </p>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmModal
        classInstance={selectedClass}
        isOpen={isConfirmOpen}
        isLoading={createBooking.isPending}
        onConfirm={confirmBooking}
        onClose={() => {
          setIsConfirmOpen(false)
          setSelectedClass(null)
        }}
      />
    </div>
  )
}