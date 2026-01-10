// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'
import {
  CalendarCheck,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  User,
  TrendingUp,
  Award,
} from 'lucide-react'

import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/dashboard')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch membership
  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch upcoming bookings
  const today = new Date().toISOString().split('T')[0]
  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select(`
      *,
      class_instance:class_instances!inner (
        *,
        class_type:class_types (*),
        instructor:instructors (*)
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'confirmed')
    .gte('class_instance.date', today)
    .order('class_instance(date)', { ascending: true })
    .limit(3)

  // Fetch booking stats
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'confirmed')

  const { count: attendedClasses } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('attended', true)

  const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-brand-lime-500 text-brand-charcoal-900 text-xl font-semibold">
              {getInitials(fullName || user.email || 'U')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {profile?.first_name || 'there'}!
            </h1>
            <p className="text-muted-foreground">
              {membership ? (
                <>
                  <Badge className="bg-brand-lime-500 text-brand-charcoal-900 mr-2">
                    Active Member
                  </Badge>
                  {membership.membership_type} membership
                </>
              ) : (
                <span className="text-orange-500">No active membership</span>
              )}
            </p>
          </div>
        </div>
        <Button
          asChild
          className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
        >
          <Link href="/booking">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Book a Class
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">Classes booked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendedClasses || 0}</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Classes booked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBookings && attendedClasses
                ? Math.round((attendedClasses / totalBookings) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Great commitment!</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Classes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your next scheduled classes</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/bookings">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcomingBookings && upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking: any) => {
                const classInstance = booking.class_instance
                const classType = classInstance.class_type
                const instructor = classInstance.instructor

                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${classType?.color}20` || '#ADFF2F20',
                      }}
                    >
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: classType?.color || '#ADFF2F' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{classType?.name || 'Class'}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(classInstance.date), 'EEE, MMM d')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {classInstance.start_time.slice(0, 5)}
                        </span>
                        {instructor && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {instructor.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 shrink-0">
                      Confirmed
                    </Badge>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">No upcoming classes</p>
              <p className="text-sm text-muted-foreground mb-4">
                Book a class to get started!
              </p>
              <Button asChild>
                <Link href="/booking">Browse Classes</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/timetable">
          <Card className="hover:border-brand-lime-500/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-lime-500/10">
                <Calendar className="h-6 w-6 text-brand-lime-500" />
              </div>
              <div>
                <p className="font-semibold">View Timetable</p>
                <p className="text-sm text-muted-foreground">See all weekly classes</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/profile">
          <Card className="hover:border-brand-lime-500/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-lime-500/10">
                <User className="h-6 w-6 text-brand-lime-500" />
              </div>
              <div>
                <p className="font-semibold">Update Profile</p>
                <p className="text-sm text-muted-foreground">Edit your details</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contact">
          <Card className="hover:border-brand-lime-500/50 transition-colors cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-lime-500/10">
                <MapPin className="h-6 w-6 text-brand-lime-500" />
              </div>
              <div>
                <p className="font-semibold">Contact Us</p>
                <p className="text-sm text-muted-foreground">Get in touch</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}