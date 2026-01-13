// src/components/admin/class-type-dialog.tsx
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
import { Slider } from '@/components/ui/slider';
import { createClient } from '@/lib/supabase/client';
import { ClassType } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const classTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  description: z.string().optional(),
  duration_minutes: z.number().min(15).max(180),
  max_capacity: z.number().min(1).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  difficulty_level: z.number().min(1).max(5),
  calories_burn_estimate: z.number().optional(),
  is_active: z.boolean(),
});

type ClassTypeFormValues = z.infer<typeof classTypeSchema>;

interface ClassTypeDialogProps {
  classType?: ClassType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ClassTypeDialog({ classType, open, onOpenChange, onSuccess }: ClassTypeDialogProps) {
  const supabase = createClient();
  const isEditing = classType?.id ? true : false;

  const form = useForm<ClassTypeFormValues>({
    resolver: zodResolver(classTypeSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      duration_minutes: 60,
      max_capacity: 20,
      color: '#ADFF2F',
      difficulty_level: 3,
      calories_burn_estimate: undefined,
      is_active: true,
    },
  });

  useEffect(() => {
    if (classType) {
      form.reset({
        name: classType.name || '',
        slug: classType.slug || '',
        description: classType.description || '',
        duration_minutes: classType.duration_minutes || 60,
        max_capacity: classType.max_capacity || 20,
        color: classType.color || '#ADFF2F',
        difficulty_level: classType.difficulty_level || 3,
        calories_burn_estimate: classType.calories_burn_estimate || undefined,
        is_active: classType.is_active ?? true,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        duration_minutes: 60,
        max_capacity: 20,
        color: '#ADFF2F',
        difficulty_level: 3,
        calories_burn_estimate: undefined,
        is_active: true,
      });
    }
  }, [classType, form]);

  // Auto-generate slug from name
  const watchName = form.watch('name');
  useEffect(() => {
    if (!isEditing && watchName) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      form.setValue('slug', slug);
    }
  }, [watchName, isEditing, form]);

  const onSubmit = async (values: ClassTypeFormValues) => {
    try {
      if (isEditing && classType?.id) {
        const { error } = await supabase
          .from('class_types')
          .update(values)
          .eq('id', classType.id);

        if (error) throw error;
        toast.success('Class type updated successfully');
      } else {
        const { error } = await supabase
          .from('class_types')
          .insert(values);

        if (error) throw error;
        toast.success('Class type created successfully');
      }
      
      onSuccess();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('A class type with this slug already exists');
      } else {
        toast.error(isEditing ? 'Failed to update class type' : 'Failed to create class type');
      }
    }
  };

  const difficultyLabels = ['Beginner', 'Easy', 'Moderate', 'Challenging', 'Advanced'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Class Type' : 'Add Class Type'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the class type details'
              : 'Create a new type of class for your gym'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Spin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., spin" {...field} />
                    </FormControl>
                    <FormDescription>URL-friendly identifier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the class..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={15}
                        max={180}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={1}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calories_burn_estimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Est. Calories Burned</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="e.g., 400"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="color"
                        className="w-16 h-10 p-1 cursor-pointer"
                        {...field}
                      />
                      <Input 
                        placeholder="#ADFF2F"
                        {...field}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Used for calendar and UI elements</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Difficulty Level: {difficultyLabels[field.value - 1]}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Beginner</span>
                    <span>Advanced</span>
                  </div>
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
                      Allow this class type to be scheduled
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
                {isEditing ? 'Update Class Type' : 'Create Class Type'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}