// src/components/admin/recent-bookings.tsx
'use client';

import { useAdminBookings } from '@/hooks/use-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export function RecentBookings() {
  const { bookings, loading } = useAdminBookings();
  const recentBookings = bookings.slice(0, 5);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest class bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>Latest class bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentBookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent bookings</p>
        ) : (
          recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={booking.user?.avatar_url || ''} />
                <AvatarFallback>
                  {booking.user?.first_name?.[0]}
                  {booking.user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {booking.user?.first_name} {booking.user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {booking.class_instance?.class_type?.name} •{' '}
                  {booking.class_instance?.date && new Date(booking.class_instance.date).toLocaleDateString('en-GB', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge 
                  variant={
                    booking.status === 'confirmed' ? 'default' :
                    booking.status === 'cancelled' ? 'destructive' : 'secondary'
                  }
                >
                  {booking.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {booking.booked_at && formatDistanceToNow(new Date(booking.booked_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}