// src/app/dashboard/bookings/user-bookings-view.tsx
'use client'

import { useState } from 'react'
import { format, isPast, isFuture, isToday } from 'date-fns'
import {
  Calendar,
  Clock,
  MapPin,
  User,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  History,
  CalendarCheck,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useUserBookings, useCancelBooking } from '@/hooks/use-bookings'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { BOOKING_STATUS_CONFIG } from '@/lib/constants'
import { BookingWithDetails } from '@/types'
import { Loading, CardSkeleton } from '@/components/shared/loading'

export function UserBookingsView() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const { data: bookings, isLoading, error } = useUserBookings()
  const cancelBooking = useCancelBooking()

  // Separate bookings
  const upcomingBookings = bookings?.filter((booking) => {
    const classDate = new Date(booking.class_instance.date)
    return (
      booking.status === 'confirmed' &&
      (isFuture(classDate) || isToday(classDate))
    )
  }) || []

  const pastBookings = bookings?.filter((booking) => {
    const classDate = new Date(booking.class_instance.date)
    return isPast(classDate) && !isToday(classDate)
  }) || []

  const cancelledBookings = bookings?.filter(
    (booking) => booking.status === 'cancelled'
  ) || []

  // Handle cancel
  const handleCancelClick = (bookingId: string) => {
    setCancelBookingId(bookingId)
  }

  const confirmCancel = async () => {
    if (!cancelBookingId) return

    await cancelBooking.mutateAsync({
      bookingId: cancelBookingId,
      reason: cancelReason || undefined,
    })

    setCancelBookingId(null)
    setCancelReason('')
  }

  // Check if booking can be cancelled (2 hours before)
  const canCancelBooking = (booking: BookingWithDetails): boolean => {
    const classDateTime = new Date(
      `${booking.class_instance.date}T${booking.class_instance.start_time}`
    )
    const now = new Date()
    const hoursUntilClass = (classDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilClass >= 2
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-4 py-8">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-medium">Failed to load bookings</p>
            <p className="text-sm text-muted-foreground">
              Please try refreshing the page
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="upcoming" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Upcoming
            {upcomingBookings.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {upcomingBookings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <History className="h-4 w-4" />
            Past
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="gap-2">
            <X className="h-4 w-4" />
            Cancelled
          </TabsTrigger>
        </TabsList>

        {/* Upcoming Bookings */}
        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => handleCancelClick(booking.id)}
                  canCancel={canCancelBooking(booking)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarCheck}
              title="No upcoming bookings"
              description="You don't have any upcoming class bookings. Book a class to get started!"
              action={
                <Button asChild className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400">
                  <a href="/booking">Book a Class</a>
                </Button>
              }
            />
          )}
        </TabsContent>

        {/* Past Bookings */}
        <TabsContent value="past" className="mt-6">
          {pastBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isPast />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No past bookings"
              description="Your booking history will appear here after you've attended classes."
            />
          )}
        </TabsContent>

        {/* Cancelled Bookings */}
        <TabsContent value="cancelled" className="mt-6">
          {cancelledBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} isCancelled />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={X}
              title="No cancelled bookings"
              description="You haven't cancelled any bookings."
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!cancelBookingId}
        onOpenChange={() => {
          setCancelBookingId(null)
          setCancelReason('')
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? Your spot will be released
              and may be taken by another member.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Reason for cancellation (optional)
            </label>
            <Textarea
              placeholder="Let us know why you're cancelling..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelBooking.isPending}>
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              disabled={cancelBooking.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Booking'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Booking Card Component
function BookingCard({
  booking,
  onCancel,
  canCancel,
  isPast,
  isCancelled,
}: {
  booking: BookingWithDetails
  onCancel?: () => void
  canCancel?: boolean
  isPast?: boolean
  isCancelled?: boolean
}) {
  const classInstance = booking.class_instance
  const classType = classInstance.class_type
  const instructor = classInstance.instructor

  const isToday_ = isToday(new Date(classInstance.date))
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status]

  const formatTime = (time: string) => time.slice(0, 5)

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all',
        isToday_ && !isPast && !isCancelled && 'border-brand-lime-500 ring-2 ring-brand-lime-500/20',
        isCancelled && 'opacity-75'
      )}
    >
      {/* Status Bar */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1',
          booking.status === 'confirmed' && 'bg-green-500',
          booking.status === 'completed' && 'bg-blue-500',
          booking.status === 'cancelled' && 'bg-red-500',
          booking.status === 'no_show' && 'bg-gray-500'
        )}
      />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${classType?.color}20` || '#ADFF2F20' }}
            >
              <div
                className="h-6 w-6 rounded-full"
                style={{ backgroundColor: classType?.color || '#ADFF2F' }}
              />
            </div>
            <div>
              <CardTitle className="text-base">{classType?.name || 'Class'}</CardTitle>
              {instructor && (
                <CardDescription className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {instructor.name}
                </CardDescription>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant="secondary"
            className={cn(
              'text-xs',
              booking.status === 'confirmed' && 'bg-green-500/10 text-green-500',
              booking.status === 'completed' && 'bg-blue-500/10 text-blue-500',
              booking.status === 'cancelled' && 'bg-red-500/10 text-red-500'
            )}
          >
            {isToday_ && booking.status === 'confirmed' ? 'Today' : statusConfig?.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-brand-lime-500" />
            <span>{format(new Date(classInstance.date), 'EEE, MMM d')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-brand-lime-500" />
            <span>
              {formatTime(classInstance.start_time)} - {formatTime(classInstance.end_time)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-brand-lime-500" />
          <span>{classInstance.location || 'Fitness Studio'}</span>
        </div>

        {/* Booked At */}
        <p className="text-xs text-muted-foreground">
          Booked on {format(new Date(booking.booked_at), 'MMM d, yyyy')}
        </p>

        {/* Cancellation Reason */}
        {isCancelled && booking.cancellation_reason && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm">
            <p className="text-xs text-muted-foreground mb-1">Cancellation reason:</p>
            <p className="text-red-500">{booking.cancellation_reason}</p>
          </div>
        )}

        {/* Actions */}
        {!isPast && !isCancelled && onCancel && (
          <div className="pt-2 border-t">
            {canCancel ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Booking
              </Button>
            ) : (
              <p className="text-xs text-center text-muted-foreground">
                Cannot cancel within 2 hours of class time
              </p>
            )}
          </div>
        )}

        {/* Attendance Badge for Past */}
        {isPast && booking.attended !== null && (
          <div className="pt-2 border-t">
            <Badge
              variant="secondary"
              className={cn(
                booking.attended
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-red-500/10 text-red-500'
              )}
            >
              {booking.attended ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Attended
                </>
              ) : (
                <>
                  <X className="mr-1 h-3 w-3" />
                  Did not attend
                </>
              )}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
        {action}
      </CardContent>
    </Card>
  )
}