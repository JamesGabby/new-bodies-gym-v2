// src/components/admin/schedule-dialog.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import { ClassSchedule, ClassType, Instructor } from '@/types/database';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const scheduleSchema = z.object({
  class_type_id: z.string().min(1, 'Class type is required'),
  instructor_id: z.string().optional(),
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  location: z.string().optional(),
  max_capacity: z.number().min(1).max(100).optional(),
  is_active: z.boolean(),
});

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ScheduleDialogProps {
  schedule?: (ClassSchedule & { class_type?: ClassType; instructor?: Instructor }) | null;
  classTypes: ClassType[];
  instructors: Instructor[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const days = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const locations = [
  'Fitness Studio',
  'Spin Studio',
  'Boxing Studio',
  'Main Gym Floor',
  'Olympic Gym',
  'Power Zone',
];

export function ScheduleDialog({ 
  schedule, 
  classTypes, 
  instructors,
  open, 
  onOpenChange, 
  onSuccess 
}: ScheduleDialogProps) {
  const supabase = createClient();
  const isEditing = !!schedule?.id;

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      class_type_id: '',
      instructor_id: '',
      day_of_week: 'monday',
      start_time: '09:00',
      end_time: '10:00',
      location: 'Fitness Studio',
      max_capacity: undefined,
      is_active: true,
    },
  });

  useEffect(() => {
    if (schedule) {
      form.reset({
        class_type_id: schedule.class_type_id || '',
        instructor_id: schedule.instructor_id || '',
        day_of_week: schedule.day_of_week as any,
        start_time: schedule.start_time?.slice(0, 5) || '09:00',
        end_time: schedule.end_time?.slice(0, 5) || '10:00',
        location: schedule.location || 'Fitness Studio',
        max_capacity: schedule.max_capacity || undefined,
        is_active: schedule.is_active ?? true,
      });
    } else {
      form.reset({
        class_type_id: '',
        instructor_id: '',
        day_of_week: 'monday',
        start_time: '09:00',
        end_time: '10:00',
        location: 'Fitness Studio',
        max_capacity: undefined,
        is_active: true,
      });
    }
  }, [schedule, form]);

  // Auto-calculate end time based on class type duration
  const watchClassType = form.watch('class_type_id');
  const watchStartTime = form.watch('start_time');

  useEffect(() => {
    if (watchClassType && watchStartTime) {
      const selectedClass = classTypes.find(c => c.id === watchClassType);
      if (selectedClass) {
        const [hours, minutes] = watchStartTime.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + selectedClass.duration_minutes;
        const endHours = Math.floor(endMinutes / 60) % 24;
        const endMins = endMinutes % 60;
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
        form.setValue('end_time', endTime);
        
        // Set default capacity from class type if not set
        if (!form.getValues('max_capacity')) {
          form.setValue('max_capacity', selectedClass.max_capacity);
        }
      }
    }
  }, [watchClassType, watchStartTime, classTypes, form]);

  const onSubmit = async (values: ScheduleFormValues) => {
    try {
      const data = {
        ...values,
        instructor_id: values.instructor_id || null,
        start_time: `${values.start_time}:00`,
        end_time: `${values.end_time}:00`,
      };

      if (isEditing && schedule?.id) {
        const { error } = await supabase
          .from('class_schedule')
          .update(data)
          .eq('id', schedule.id);

        if (error) throw error;
        toast.success('Schedule updated successfully');
      } else {
        const { error } = await supabase
          .from('class_schedule')
          .insert(data);

        if (error) throw error;
        toast.success('Schedule created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update schedule' : 'Failed to create schedule');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the class schedule'
              : 'Add a new class to the weekly schedule'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="class_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classTypes.filter(c => c.is_active).map((classType) => (
                        <SelectItem key={classType.id} value={classType.id}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: classType.color }}
                            />
                            {classType.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="day_of_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select instructor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">TBA</SelectItem>
                      {instructors.filter(i => i.is_active).map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max_capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Capacity (Override)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={1}
                      max={100}
                      placeholder="Leave blank to use class default"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>
                    Override the default class capacity for this schedule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Include in weekly schedule
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    // src/components/admin/schedule-dialog.tsx (continued)
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}