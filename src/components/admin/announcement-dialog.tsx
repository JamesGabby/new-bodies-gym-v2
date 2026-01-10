// src/components/admin/announcement-dialog.tsx
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { createClient } from '@/lib/supabase/client';
import { Announcement } from '@/types/database';
import { toast } from 'sonner';
import { Loader2, CalendarIcon, Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(1000, 'Content too long'),
  type: z.enum(['info', 'warning', 'success', 'alert']),
  is_active: z.boolean(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface AnnouncementDialogProps {
  announcement?: Announcement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const typeOptions = [
  { value: 'info', label: 'Information', icon: Info, color: 'text-blue-500' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-500' },
  { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-500' },
  { value: 'alert', label: 'Alert', icon: Bell, color: 'text-red-500' },
];

export function AnnouncementDialog({ 
  announcement, 
  open, 
  onOpenChange, 
  onSuccess 
}: AnnouncementDialogProps) {
  const supabase = createClient();
  const isEditing = !!announcement?.id;

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'info',
      is_active: true,
      start_date: undefined,
      end_date: undefined,
    },
  });

  useEffect(() => {
    if (announcement) {
      form.reset({
        title: announcement.title || '',
        content: announcement.content || '',
        type: (announcement.type as any) || 'info',
        is_active: announcement.is_active ?? true,
        start_date: announcement.start_date ? new Date(announcement.start_date) : undefined,
        end_date: announcement.end_date ? new Date(announcement.end_date) : undefined,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        type: 'info',
        is_active: true,
        start_date: undefined,
        end_date: undefined,
      });
    }
  }, [announcement, form]);

  const onSubmit = async (values: AnnouncementFormValues) => {
    try {
      const data = {
        title: values.title,
        content: values.content,
        type: values.type,
        is_active: values.is_active,
        start_date: values.start_date?.toISOString() || new Date().toISOString(),
        end_date: values.end_date?.toISOString() || null,
      };

      if (isEditing && announcement?.id) {
        const { error } = await supabase
          .from('announcements')
          .update(data)
          .eq('id', announcement.id);

        if (error) throw error;
        toast.success('Announcement updated successfully');
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert(data);

        if (error) throw error;
        toast.success('Announcement created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update announcement' : 'Failed to create announcement');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the announcement details'
              : 'Create a new announcement for your members'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Announcement title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Announcement content..."
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/1000 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className={cn("h-4 w-4", option.color)} />
                            {option.label}
                          </div>
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
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Now</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>No end date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                        {field.value && (
                          <div className="p-2 border-t">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full"
                              onClick={() => field.onChange(undefined)}
                            >
                              Clear date
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Show this announcement to members
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}