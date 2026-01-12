// src/app/admin/bookings/page.tsx
'use client';

import { useState } from 'react';
import { useAdminBookings } from '@/hooks/use-admin';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ColumnDef } from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  CheckCircle, 
  XCircle, 
  Clock,
  CalendarIcon,
  Filter
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Booking, Profile, ClassInstance, ClassType } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type BookingWithRelations = Booking & { 
  user?: Profile; 
  class_instance?: ClassInstance & { class_type?: ClassType };
};

export default function BookingsPage() {
  const { bookings, loading, cancelBooking, checkInBooking, refetch } = useAdminBookings();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [bookingToCheckIn, setBookingToCheckIn] = useState<string | null>(null);

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }
    if (dateFilter && booking.class_instance?.date) {
      const bookingDate = new Date(booking.class_instance.date).toDateString();
      if (bookingDate !== dateFilter.toDateString()) {
        return false;
      }
    }
    return true;
  });

  const handleCancel = async () => {
    if (!bookingToCancel) return;
    
    try {
      await cancelBooking(bookingToCancel, cancellationReason);
      toast.success('Booking cancelled successfully');
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      setCancellationReason('');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleCheckIn = async () => {
    if (!bookingToCheckIn) return;
    
    try {
      await checkInBooking(bookingToCheckIn);
      toast.success('Member checked in successfully');
      setCheckInDialogOpen(false);
      setBookingToCheckIn(null);
    } catch (error) {
      toast.error('Failed to check in member');
    }
  };

  const getStatusBadge = (status: string, attended?: boolean | null) => {
    if (attended === true) {
      return <Badge className="bg-green-600">Attended</Badge>;
    }
    if (attended === false) {
      return <Badge variant="secondary">No Show</Badge>;
    }
    
    switch (status) {
      case 'confirmed':
        return <Badge>Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'waitlist':
        return <Badge variant="outline">Waitlist</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns: ColumnDef<BookingWithRelations>[] = [
    {
      accessorKey: 'user',
      header: 'Member',
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'class_instance',
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
        const classInstance = row.original.class_instance;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: classInstance?.class_type?.color || '#ADFF2F' }}
              />
              <span className="font-medium">{classInstance?.class_type?.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {classInstance?.date && format(new Date(classInstance.date), 'EEE, dd MMM yyyy')}
            </p>
            <p className="text-xs text-muted-foreground">
              {classInstance?.start_time?.slice(0, 5)} - {classInstance?.end_time?.slice(0, 5)}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status || '', row.original.attended),
    },
    {
      accessorKey: 'booked_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Booked
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.booked_at;
        return date ? (
          <div className="space-y-1">
            <p className="text-sm">{format(new Date(date), 'dd MMM yyyy')}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </p>
          </div>
        ) : '-';
      },
    },
    {
      accessorKey: 'check_in_time',
      header: 'Check-in',
      cell: ({ row }) => {
        const checkInTime = row.original.check_in_time;
        if (checkInTime) {
          return (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">{format(new Date(checkInTime), 'HH:mm')}</span>
            </div>
          );
        }
        return <span className="text-muted-foreground text-sm">-</span>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const booking = row.original;
        const isPast = booking.class_instance?.date 
          ? new Date(booking.class_instance.date) < new Date()
          : false;
        const canCheckIn = booking.status === 'confirmed' && !booking.attended;
        const canCancel = booking.status === 'confirmed' && !isPast;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {canCheckIn && (
                <DropdownMenuItem
                  onClick={() => {
                    setBookingToCheckIn(booking.id);
                    setCheckInDialogOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Check In
                </DropdownMenuItem>
              )}
              {canCancel && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      setBookingToCancel(booking.id);
                      setCancelDialogOpen(true);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </DropdownMenuItem>
                </>
              )}
              {!canCheckIn && !canCancel && (
                <DropdownMenuItem disabled>
                  No actions available
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            View and manage all class bookings
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="waitlist">Waitlist</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
            {dateFilter && (
              <div className="p-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setDateFilter(undefined)}
                >
                  Clear filter
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {(statusFilter !== 'all' || dateFilter) && (
          <Button 
            variant="ghost" 
            onClick={() => {
              setStatusFilter('all');
              setDateFilter(undefined);
            }}
          >
            Clear all filters
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={filteredBookings}
        searchKey="user"
        searchPlaceholder="Search by member..."
      />

      {/* Cancel Booking Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action will notify the member.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Cancellation Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setCancellationReason('');
              setBookingToCancel(null);
            }}>
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Check In Dialog */}
      <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In Member</DialogTitle>
            <DialogDescription>
              Confirm that this member has arrived for their class.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex items-center justify-center">
            <div className="text-center space-y-2">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <p className="text-lg font-medium">Ready to check in</p>
              <p className="text-sm text-muted-foreground">
                Current time: {format(new Date(), 'HH:mm')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckInDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Check In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}