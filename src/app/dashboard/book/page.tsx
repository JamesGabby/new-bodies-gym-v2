// src/app/dashboard/book/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useClassInstances, useBookings } from '@/hooks/use-bookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isAfter, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';
import { ClassInstance, ClassType } from '@/types';
import { toast } from 'sonner';

type ClassInstanceWithType = ClassInstance & { class_type?: ClassType };

export default function BookClassPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<ClassInstanceWithType | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [classFilter, setClassFilter] = useState<string>('all');
  
  // Get the week range for the selected date
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  
  const { data: classes = [], isLoading: loading, refetch } = useClassInstances(
    format(weekStart, 'yyyy-MM-dd'),
    format(weekEnd, 'yyyy-MM-dd')
  );
  const { createBooking } = useBookings();

  // Get unique class types for filter
  const classTypes = useMemo(() => {
    const types = new Map<string, string>();
    classes.forEach(c => {
      if (c.class_type) {
        types.set(c.class_type.id, c.class_type.name);
      }
    });
    return Array.from(types.entries());
  }, [classes]);

  // Filter classes by selected date and class type
  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const matchesDate = isSameDay(new Date(c.date), selectedDate);
      const matchesType = classFilter === 'all' || c.class_type_id === classFilter;
      const isFuture = isAfter(
        new Date(`${c.date}T${c.start_time}`), 
        new Date()
      );
      return matchesDate && matchesType && isFuture && c.status === 'scheduled';
    // src/app/dashboard/book/page.tsx (continued)
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [classes, selectedDate, classFilter]);

  // Get dates that have classes
  const datesWithClasses = useMemo(() => {
    const dates = new Set<string>();
    classes.forEach(c => {
      if (c.status === 'scheduled') {
        dates.add(c.date);
      }
    });
    return dates;
  }, [classes]);

  const handlePreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const handleClassSelect = (classInstance: ClassInstanceWithType) => {
    setSelectedClass(classInstance);
    setIsBookingDialogOpen(true);
  };

  const handleBookClass = async () => {
    if (!selectedClass) return;
    
    setIsBooking(true);
    try {
      await createBooking(selectedClass.id);
      toast.success('Class booked successfully!', {
        description: `You're booked for ${selectedClass.class_type?.name} on ${format(new Date(selectedClass.date), 'EEEE, dd MMMM')}`,
      });
      setIsBookingDialogOpen(false);
      setSelectedClass(null);
      refetch();
    } catch (error: any) {
      toast.error('Failed to book class', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getAvailabilityStatus = (classInstance: ClassInstanceWithType) => {
    const spotsLeft = classInstance.max_capacity - (classInstance.current_capacity || 0);
    
    if (spotsLeft <= 0) {
      return { status: 'full', label: 'Full', color: 'text-red-500' };
    }
    if (spotsLeft <= 3) {
      return { status: 'limited', label: `${spotsLeft} spots left`, color: 'text-amber-500' };
    }
    return { status: 'available', label: `${spotsLeft} spots`, color: 'text-green-500' };
  };

  // Generate week days for the header
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Book a Class</h1>
        <p className="text-muted-foreground">
          Browse available classes and secure your spot
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[200px]">
            <p className="font-medium">
              {format(weekStart, 'dd MMM')} - {format(weekEnd, 'dd MMM yyyy')}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classTypes.map(([id, name]) => (
              <SelectItem key={id} value={id}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Week Day Selector */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const hasClasses = datesWithClasses.has(format(day, 'yyyy-MM-dd'));
          const isPast = isBefore(day, new Date()) && !isSameDay(day, new Date());
          
          return (
            <Button
              key={day.toISOString()}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                "flex flex-col h-auto py-3 relative",
                isPast && "opacity-50",
                !hasClasses && !isSelected && "border-dashed"
              )}
              onClick={() => setSelectedDate(day)}
              disabled={isPast}
            >
              <span className="text-xs uppercase">
                {format(day, 'EEE')}
              </span>
              <span className="text-lg font-bold">
                {format(day, 'd')}
              </span>
              {hasClasses && (
                <span className={cn(
                  "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                  isSelected ? "bg-primary-foreground" : "bg-primary"
                )} />
              )}
            </Button>
          );
        })}
      </div>

      {/* Classes List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Classes on {format(selectedDate, 'EEEE, dd MMMM')}
        </h2>
        
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No classes available</h3>
                <p className="text-muted-foreground">
                  {classFilter !== 'all' 
                    ? 'Try selecting a different class type or date'
                    : 'No classes scheduled for this day'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classInstance) => (
              <ClassCard 
                key={classInstance.id} 
                classInstance={classInstance}
                onSelect={() => handleClassSelect(classInstance)}
                availability={getAvailabilityStatus(classInstance)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              You're about to book the following class
            </DialogDescription>
          </DialogHeader>

          {selectedClass && (
            <div className="space-y-4">
              <div 
                className="p-4 rounded-lg border-l-4"
                style={{ borderLeftColor: selectedClass.class_type?.color || '#ADFF2F' }}
              >
                <h3 className="text-xl font-bold mb-2">
                  {selectedClass.class_type?.name}
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(selectedClass.date), 'EEEE, dd MMMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedClass.start_time.slice(0, 5)} - {selectedClass.end_time.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClass.location || 'Fitness Studio'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedClass.max_capacity - (selectedClass.current_capacity || 0)} spots available
                    </span>
                  </div>
                </div>
              </div>

              {selectedClass.class_type?.description && (
                <p className="text-sm text-muted-foreground">
                  {selectedClass.class_type.description}
                </p>
              )}

              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Important:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Cancellations must be made at least 2 hours before class</li>
                  <li>Please arrive 5 minutes before the class starts</li>
                  <li>Bring water and appropriate workout attire</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBookingDialogOpen(false)}
              disabled={isBooking}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBookClass}
              disabled={isBooking}
            >
              {isBooking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Class Card Component
interface ClassCardProps {
  classInstance: ClassInstanceWithType;
  onSelect: () => void;
  availability: {
    status: string;
    label: string;
    color: string;
  };
}

function ClassCard({ classInstance, onSelect, availability }: ClassCardProps) {
  const isFull = availability.status === 'full';

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg cursor-pointer",
        isFull && "opacity-75"
      )}
      onClick={!isFull ? onSelect : undefined}
    >
      <div 
        className="h-2"
        style={{ backgroundColor: classInstance.class_type?.color || '#ADFF2F' }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{classInstance.class_type?.name}</CardTitle>
          <Badge 
            variant={isFull ? 'destructive' : 'outline'}
            className={cn(!isFull && availability.color)}
          >
            {availability.label}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {classInstance.class_type?.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{classInstance.start_time.slice(0, 5)} - {classInstance.end_time.slice(0, 5)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{classInstance.location || 'Fitness Studio'}</span>
        </div>
        
        {classInstance.class_type?.difficulty_level && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Difficulty:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    level <= (classInstance.class_type?.difficulty_level || 1)
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <Button 
          className="w-full mt-2" 
          disabled={isFull}
          variant={isFull ? 'secondary' : 'default'}
        >
          {isFull ? 'Class Full' : 'Book Now'}
        </Button>
      </CardContent>
    </Card>
  );
}