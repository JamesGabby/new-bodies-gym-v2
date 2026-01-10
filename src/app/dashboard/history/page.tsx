// src/app/dashboard/history/page.tsx
'use client';

import { useUserBookings } from '@/hooks/use-user-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/admin/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle,
  ArrowUpDown,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { BookingWithDetails } from '@/hooks/use-user-dashboard';
import { cn } from '@/lib/utils';

export default function BookingHistoryPage() {
  const { bookings, loading } = useUserBookings({ past: true });

  const columns: ColumnDef<BookingWithDetails>[] = [
    {
      accessorKey: 'class',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Class
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-8 rounded-full"
              style={{ backgroundColor: booking.class_instance?.class_type?.color || '#ADFF2F' }}
            />
            <div>
              <p className="font-medium">{booking.class_instance?.class_type?.name}</p>
              <p className="text-sm text-muted-foreground">
                {booking.class_instance?.location}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.class_instance?.date;
        return date ? (
          <div>
            <p>{format(new Date(date), 'dd MMM yyyy')}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(date), 'EEEE')}
            </p>
          </div>
        ) : '-';
      },
      sortingFn: (rowA, rowB) => {
        const dateA = rowA.original.class_instance?.date || '';
        const dateB = rowB.original.class_instance?.date || '';
        return dateB.localeCompare(dateA);
      },
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <span>
            {booking.class_instance?.start_time?.slice(0, 5)} - {booking.class_instance?.end_time?.slice(0, 5)}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const booking = row.original;
        
        if (booking.attended === true) {
          return (
            <Badge className="bg-green-600 gap-1">
              <CheckCircle className="h-3 w-3" />
              Attended
            </Badge>
          );
        }
        
        if (booking.attended === false) {
          return (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              No Show
            </Badge>
          );
        }
        
        if (booking.status === 'cancelled') {
          return (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Cancelled
            </Badge>
          );
        }
        
        return (
          <Badge variant="outline">
            {booking.status}
          </Badge>
        );
      },
    },
  ];

  // Calculate stats
  const totalClasses = bookings.length;
  const attendedClasses = bookings.filter(b => b.attended === true).length;
  const cancelledClasses = bookings.filter(b => b.status === 'cancelled').length;
  const attendanceRate = totalClasses > 0 
    ? Math.round((attendedClasses / (totalClasses - cancelledClasses)) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking History</h1>
        <p className="text-muted-foreground">
          View your past class bookings and attendance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{totalClasses}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{attendedClasses}</p>
              <p className="text-sm text-muted-foreground">Attended</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{cancelledClasses}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No booking history</h3>
              <p className="text-muted-foreground">
                Your past bookings will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable
          columns={columns}
          data={bookings}
          searchKey="class"
          searchPlaceholder="Search by class name..."
        />
      )}
    </div>
  );
}