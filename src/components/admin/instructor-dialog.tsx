// src/components/admin/instructor-dialog.tsx
'use client';

import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { Instructor } from '@/types';
import { toast } from 'sonner';
import { Loader2, X, Plus } from 'lucide-react';

const instructorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  specializations: z.array(z.string()),
  certifications: z.array(z.string()),
  is_active: z.boolean(),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

interface InstructorDialogProps {
  instructor?: Instructor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function InstructorDialog({ 
  instructor, 
  open, 
  onOpenChange, 
  onSuccess 
}: InstructorDialogProps) {
  const supabase = createClient();
  const isEditing = !!instructor?.id;
  const [newSpec, setNewSpec] = useState('');
  const [newCert, setNewCert] = useState('');

  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      avatar_url: '',
      specializations: [],
      certifications: [],
      is_active: true,
    },
  });

  useEffect(() => {
    if (instructor) {
      form.reset({
        name: instructor.name || '',
        email: instructor.email || '',
        phone: instructor.phone || '',
        bio: instructor.bio || '',
        avatar_url: instructor.avatar_url || '',
        specializations: instructor.specializations || [],
        certifications: instructor.certifications || [],
        is_active: instructor.is_active ?? true,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        phone: '',
        bio: '',
        avatar_url: '',
        specializations: [],
        certifications: [],
        is_active: true,
      });
    }
  }, [instructor, form]);

  const addSpecialization = () => {
    if (newSpec.trim()) {
      const current = form.getValues('specializations');
      if (!current.includes(newSpec.trim())) {
        form.setValue('specializations', [...current, newSpec.trim()]);
      }
      setNewSpec('');
    }
  };

  const removeSpecialization = (spec: string) => {
    const current = form.getValues('specializations');
    form.setValue('specializations', current.filter(s => s !== spec));
  };

  const addCertification = () => {
    if (newCert.trim()) {
      const current = form.getValues('certifications');
      if (!current.includes(newCert.trim())) {
        form.setValue('certifications', [...current, newCert.trim()]);
      }
      setNewCert('');
    }
  };

  const removeCertification = (cert: string) => {
    const current = form.getValues('certifications');
    form.setValue('certifications', current.filter(c => c !== cert));
  };

  const onSubmit = async (values: InstructorFormValues) => {
    try {
      const data = {
        ...values,
        email: values.email || null,
        avatar_url: values.avatar_url || null,
      };

      if (isEditing && instructor?.id) {
        const { error } = await supabase
          .from('instructors')
          .update(data)
          .eq('id', instructor.id);

        if (error) throw error;
        toast.success('Instructor updated successfully');
      } else {
        const { error } = await supabase
          .from('instructors')
          .insert(data);

        if (error) throw error;
        toast.success('Instructor added successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update instructor' : 'Failed to add instructor');
    }
  };

  const specializations = form.watch('specializations');
  const certifications = form.watch('certifications');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Instructor' : 'Add Instructor'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update instructor details'
              : 'Add a new instructor to your gym'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="01234 567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief bio about the instructor..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specializations */}
            <div className="space-y-2">
              <FormLabel>Specializations</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Spin, HIIT"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialization();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addSpecialization}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                // src/components/admin/instructor-dialog.tsx (continued)
                {specializations.map((spec, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(spec)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <FormLabel>Certifications</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Level 3 PT, Spinning Certified"
                  value={newCert}
                  onChange={(e) => setNewCert(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCertification();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addCertification}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(cert)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Allow this instructor to be assigned to classes
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
                {isEditing ? 'Update Instructor' : 'Add Instructor'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}