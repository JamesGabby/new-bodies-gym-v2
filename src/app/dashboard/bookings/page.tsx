// src/app/dashboard/bookings/page.tsx
'use client';

import { useState } from 'react';
import { useUserBookings, BookingWithDetails } from '@/hooks/use-user-dashboard';
import { useBookings } from '@/hooks/use-bookings';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  X,
  CalendarCheck,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { format, isToday, isTomorrow, addHours, isBefore } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function MyBookingsPage() {
  const { bookings: upcomingBookings, loading: upcomingLoading, refetch } = useUserBookings({ upcoming: true });
  const { cancelBooking, isCancelling } = useBookings();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<BookingWithDetails | null>(null);

  const confirmedBookings = upcomingBookings.filter(b => b.status === 'confirmed');
  const waitlistBookings = upcomingBookings.filter(b => b.status === 'waitlist');

  const handleCancelClick = (booking: BookingWithDetails) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking(bookingToCancel.id);
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      refetch();
    } catch (error: any) {
      // Error toast is handled by the mutation
      console.error('Failed to cancel booking:', error);
    }
  };

  const canCancel = (booking: BookingWithDetails) => {
    if (!booking.class_instance?.date || !booking.class_instance?.start_time) {
      return false;
    }
    
    const classDateTime = new Date(
      `${booking.class_instance.date}T${booking.class_instance.start_time}`
    );
    
    // Allow cancellation up to 2 hours before class
    const cancellationDeadline = addHours(classDateTime, -2);
    return isBefore(new Date(), cancellationDeadline);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">
            Manage your upcoming class bookings
          </p>
        </div>
        <Link href="/dashboard/book">
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Book a Class
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="confirmed">
        <TabsList>
          <TabsTrigger value="confirmed" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            Confirmed ({confirmedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="waitlist" className="gap-2">
            <Clock className="h-4 w-4" />
            Waitlist ({waitlistBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="confirmed" className="mt-6">
          {upcomingLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : confirmedBookings.length === 0 ? (
            <EmptyState 
              title="No confirmed bookings"
              description="You don't have any upcoming class bookings"
            />
          ) : (
            <div className="space-y-4">
              {confirmedBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  onCancel={() => handleCancelClick(booking)}
                  canCancel={canCancel(booking)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="waitlist" className="mt-6">
          {upcomingLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : waitlistBookings.length === 0 ? (
            <EmptyState 
              title="No waitlist bookings"
              description="You're not on any waitlists"
            />
          ) : (
            <div className="space-y-4">
              {waitlistBookings.map((booking) => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking}
                  onCancel={() => handleCancelClick(booking)}
                  canCancel={true}
                  isWaitlist
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your booking for{' '}
              <span className="font-medium">
                {bookingToCancel?.class_instance?.class_type?.name}
              </span>
              {' '}on{' '}
              <span className="font-medium">
                {bookingToCancel?.class_instance?.date && 
                  format(new Date(bookingToCancel.class_instance.date), 'EEEE, dd MMMM')}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Booking Card Component
interface BookingCardProps {
  booking: BookingWithDetails;
  onCancel: () => void;
  canCancel: boolean;
  isWaitlist?: boolean;
}

function BookingCard({ booking, onCancel, canCancel, isWaitlist }: BookingCardProps) {
  const classDate = booking.class_instance?.date 
    ? new Date(booking.class_instance.date) 
    : null;
  
  const getDateLabel = () => {
    if (!classDate) return '';
    if (isToday(classDate)) return 'Today';
    if (isTomorrow(classDate)) return 'Tomorrow';
    return format(classDate, 'EEEE, dd MMMM yyyy');
  };

  const getTimeUntilClass = () => {
    if (!classDate || !booking.class_instance?.start_time) return null;
    
    const classDateTime = new Date(
      `${booking.class_instance.date}T${booking.class_instance.start_time}`
    );
    
    const now = new Date();
    const diffMs = classDateTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} away`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} away`;
    return 'Starting soon';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Color Bar */}
          <div 
            className="hidden sm:block w-2 h-full min-h-[100px] rounded-full"
            style={{ backgroundColor: booking.class_instance?.class_type?.color || '#ADFF2F' }}
          />
          
          {/* Class Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">
                    {booking.class_instance?.class_type?.name}
                  </h3>
                  {isWaitlist ? (
                    <Badge variant="outline">Waitlist</Badge>
                  ) : classDate && isToday(classDate) ? (
                    <Badge>Today</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {booking.class_instance?.class_type?.description?.slice(0, 100)}
                  {(booking.class_instance?.class_type?.description?.length ?? 0) > 100 && '...'}
                </p>
              </div>
              
              {canCancel && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onCancel}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{getDateLabel()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.class_instance?.start_time?.slice(0, 5)} - {booking.class_instance?.end_time?.slice(0, 5)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{booking.class_instance?.location || 'Fitness Studio'}</span>
              </div>
            </div>

            {!canCancel && !isWaitlist && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>Cancellation deadline passed (2 hours before class)</span>
              </div>
            )}

            {getTimeUntilClass() && (
              <p className="text-sm font-medium text-primary">
                {getTimeUntilClass()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Link href="/dashboard/book">
            <Button>Browse Available Classes</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}