// src/app/dashboard/page.tsx
'use client';

import { useUserStats, useUserBookings, useActiveAnnouncements, useUserMembership } from '@/hooks/use-user-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calendar, 
  CalendarCheck, 
  TrendingUp, 
  Star, 
  Clock, 
  MapPin,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle,
  Bell,
  Flame
} from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { BookingWithDetails } from '@/hooks/use-user-dashboard';

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useUserStats();
  const { bookings: upcomingBookings, loading: bookingsLoading } = useUserBookings({ upcoming: true, limit: 5 });
  const { announcements, loading: announcementsLoading } = useActiveAnnouncements();
  const { membership, loading: membershipLoading } = useUserMembership();

  return (
    <div className="space-y-8">
      {/* Announcements */}
      {!announcementsLoading && announcements.length > 0 && (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <AnnouncementAlert key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Upcoming Bookings"
          value={stats?.upcomingBookings || 0}
          icon={Calendar}
          loading={statsLoading}
          href="/dashboard/bookings"
        />
        <StatsCard
          title="Classes Attended"
          value={stats?.attendedClasses || 0}
          icon={CalendarCheck}
          loading={statsLoading}
          description="Total classes"
        />
        <StatsCard
          title="Current Streak"
          value={`${stats?.streakDays || 0} days`}
          icon={Flame}
          loading={statsLoading}
          highlight={stats?.streakDays && stats.streakDays >= 5}
        />
        <StatsCard
          title="Favorite Class"
          value={stats?.favoriteClass || 'None yet'}
          icon={Star}
          loading={statsLoading}
          isText
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Your scheduled classes</CardDescription>
              </div>
              <Link href="/dashboard/book">
                <Button>
                  Book a Class
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24" />
                  ))}
                </div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No upcoming classes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book a class to get started on your fitness journey
                  </p>
                  <Link href="/dashboard/book">
                    <Button>Browse Classes</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                  {upcomingBookings.length >= 5 && (
                    <Link href="/dashboard/bookings">
                      <Button variant="ghost" className="w-full">
                        View All Bookings
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Membership Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Status</CardTitle>
            </CardHeader>
            <CardContent>
              {membershipLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : membership ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={membership.status === 'active' ? 'default' : 'destructive'}
                      className="text-sm"
                    >
                      {membership.status === 'active' ? 'Active' : membership.status}
                    </Badge>
                    <span className="text-lg font-bold capitalize">
                      {membership.membership_type}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date</span>
                      <span>{format(new Date(membership.start_date), 'dd MMM yyyy')}</span>
                    </div>
                    {membership.end_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Renewal Date</span>
                        <span>{format(new Date(membership.end_date), 'dd MMM yyyy')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Auto-Renew</span>
                      <span>{membership.auto_renew ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <Link href="/dashboard/membership">
                    <Button variant="outline" className="w-full">
                      Manage Membership
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    No active membership found
                  </p>
                  <Link href="/membership">
                    <Button>View Plans</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Link href="/dashboard/book">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Book Class</span>
                </Button>
              </Link>
              <Link href="/timetable">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-xs">Timetable</span>
                </Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Star className="h-5 w-5" />
                  <span className="text-xs">Profile</span>
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs">Contact</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Member Since */}
          {stats?.memberSince && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="text-lg font-semibold">
                    {format(new Date(stats.memberSince), 'MMMM yyyy')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(stats.memberSince), { addSuffix: false })} ago
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
  description?: string;
  href?: string;
  highlight?: boolean;
  isText?: boolean;
}

function StatsCard({ title, value, icon: Icon, loading, description, href, highlight, isText }: StatsCardProps) {
  const content = (
    <Card className={cn(highlight && "border-primary")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", highlight && "text-primary")} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <>
            <div className={cn("font-bold", isText ? "text-lg" : "text-2xl")}>
              {value}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// Booking Card Component
function BookingCard({ booking }: { booking: BookingWithDetails }) {
  const classDate = booking.class_instance?.date ? new Date(booking.class_instance.date) : null;
  
  const getDateLabel = () => {
    if (!classDate) return '';
    if (isToday(classDate)) return 'Today';
    if (isTomorrow(classDate)) return 'Tomorrow';
    return format(classDate, 'EEEE, dd MMM');
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
      style={{ 
        borderLeftWidth: '4px',
        borderLeftColor: booking.class_instance?.class_type?.color || '#ADFF2F'
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium truncate">
            {booking.class_instance?.class_type?.name}
          </h4>
          {booking.status === 'confirmed' && isToday(classDate!) && (
            <Badge variant="default" className="text-xs">Today</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {getDateLabel()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {booking.class_instance?.start_time?.slice(0, 5)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {booking.class_instance?.location || 'Studio'}
          </span>
        </div>
      </div>
      <Link href={`/dashboard/bookings`}>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}

// Announcement Alert Component
function AnnouncementAlert({ announcement }: { announcement: any }) {
  const typeConfig: Record<string, { icon: any; variant: 'default' | 'destructive' }> = {
    info: { icon: Info, variant: 'default' },
    warning: { icon: AlertTriangle, variant: 'default' },
    success: { icon: CheckCircle, variant: 'default' },
    alert: { icon: Bell, variant: 'destructive' },
  };

  const config = typeConfig[announcement.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <Alert variant={config.variant}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{announcement.title}</AlertTitle>
      <AlertDescription>{announcement.content}</AlertDescription>
    </Alert>
  );
}