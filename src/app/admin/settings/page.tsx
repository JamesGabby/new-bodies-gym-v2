// src/app/admin/settings/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
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
import { toast } from 'sonner';
import { Loader2, Save, Building2, Clock, Bell, Shield, Mail } from 'lucide-react';

const gymSettingsSchema = z.object({
  gym_name: z.string().min(1, 'Gym name is required'),
  motto: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email'),
  website: z.string().url().optional().or(z.literal('')),
});

const openingHoursSchema = z.object({
  monday_open: z.string(),
  monday_close: z.string(),
  tuesday_open: z.string(),
  tuesday_close: z.string(),
  wednesday_open: z.string(),
  wednesday_close: z.string(),
  thursday_open: z.string(),
  thursday_close: z.string(),
  friday_open: z.string(),
  friday_close: z.string(),
  saturday_open: z.string(),
  saturday_close: z.string(),
  sunday_open: z.string(),
  sunday_close: z.string(),
});

const notificationSettingsSchema = z.object({
  booking_confirmation: z.boolean(),
  booking_reminder: z.boolean(),
  reminder_hours_before: z.number().min(1).max(48),
  cancellation_notification: z.boolean(),
  waitlist_notification: z.boolean(),
  marketing_emails: z.boolean(),
});

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const gymForm = useForm({
    resolver: zodResolver(gymSettingsSchema),
    defaultValues: {
      gym_name: 'New Bodies Gym',
      motto: 'Where everyone is welcome',
      address: 'Unit 6, Tongue Lane Ind. Estate, Buxton, SK17 7LF',
      phone: '01298 72006',
      email: 'newbodiesgym@hotmail.co.uk',
      website: '',
    },
  });

  const hoursForm = useForm({
    resolver: zodResolver(openingHoursSchema),
    defaultValues: {
      monday_open: '06:00',
      monday_close: '21:30',
      tuesday_open: '06:00',
      tuesday_close: '21:30',
      wednesday_open: '06:00',
      wednesday_close: '21:30',
      thursday_open: '06:00',
      thursday_close: '21:30',
      friday_open: '06:00',
      friday_close: '20:00',
      saturday_open: '09:00',
      saturday_close: '15:00',
      sunday_open: '09:00',
      sunday_close: '15:00',
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      booking_confirmation: true,
      booking_reminder: true,
      reminder_hours_before: 24,
      cancellation_notification: true,
      waitlist_notification: true,
      marketing_emails: false,
    },
  });

  const onSaveGymSettings = async (values: z.infer<typeof gymSettingsSchema>) => {
    setSaving(true);
    try {
      // In production, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Gym settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const onSaveHours = async (values: z.infer<typeof openingHoursSchema>) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Opening hours saved successfully');
    } catch (error) {
      toast.error('Failed to save opening hours');
    } finally {
      setSaving(false);
    }
  };

  const onSaveNotifications = async (values: z.infer<typeof notificationSettingsSchema>) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Notification settings saved successfully');
    } catch (error) {
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your gym settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="hours" className="gap-2">
            <Clock className="h-4 w-4" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your gym
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...gymForm}>
                <form onSubmit={gymForm.handleSubmit(onSaveGymSettings)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={gymForm.control}
                      name="gym_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gym Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={gymForm.control}
                      name="motto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Motto / Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={gymForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={gymForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={gymForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={gymForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opening Hours */}
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Opening Hours</CardTitle>
              <CardDescription>
                Set your gym's operating hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...hoursForm}>
                <form onSubmit={hoursForm.handleSubmit(onSaveHours)} className="space-y-6">
                  <div className="space-y-4">
                    {days.map((day) => (
                      <div key={day} className="grid grid-cols-3 gap-4 items-center">
                        <span className="font-medium capitalize">{day}</span>
                        <FormField
                          control={hoursForm.control}
                          name={`${day}_open` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={hoursForm.control}
                          name={`${day}_close` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Hours
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and push notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onSaveNotifications)} className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="booking_confirmation"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Booking Confirmation</FormLabel>
                          <FormDescription>
                            Send confirmation emails when bookings are made
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

                  <FormField
                    control={notificationForm.control}
                    name="booking_reminder"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Booking Reminders</FormLabel>
                          <FormDescription>
                            Send reminder emails before scheduled classes
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

                  {notificationForm.watch('booking_reminder') && (
                    <FormField
                      control={notificationForm.control}
                      name="reminder_hours_before"
                      render={({ field }) => (
                        <FormItem className="ml-4">
                          <FormLabel>Remind hours before class</FormLabel>
                          <Select
                            onValueChange={(v) => field.onChange(parseInt(v))}
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="w-[200px]">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 hour</SelectItem>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                              <SelectItem value="12">12 hours</SelectItem>
                              <SelectItem value="24">24 hours</SelectItem>
                              <SelectItem value="48">48 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={notificationForm.control}
                    name="cancellation_notification"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Cancellation Notifications</FormLabel>
                          <FormDescription>
                            Notify members when classes are cancelled
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

                  <FormField
                    control={notificationForm.control}
                    name="waitlist_notification"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Waitlist Notifications</FormLabel>
                          <FormDescription>
                            Notify members when a spot becomes available
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

                  <Separator />

                  <FormField
                    control={notificationForm.control}
                    name="marketing_emails"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription>
                            Send promotional emails to members (respects individual preferences)
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

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for admin accounts
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Session Timeout</h4>
                    <p className="text-sm text-muted-foreground">
                      Auto-logout after period of inactivity
                    </p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Audit Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Log all admin actions for security review
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <div className="rounded-lg border border-destructive/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">Export All Data</h5>
                      <p className="text-sm text-muted-foreground">
                        Download all gym data for backup
                      </p>
                    </div>
                    <Button variant="outline">Export</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}