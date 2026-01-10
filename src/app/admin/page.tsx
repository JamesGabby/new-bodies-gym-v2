// src/app/admin/page.tsx
'use client';

import { useDashboardStats } from '@/hooks/use-admin';
import { StatsCards } from '@/components/admin/stats-cards';
import { BookingsChart } from '@/components/admin/bookings-chart';
import { MembershipChart } from '@/components/admin/membership-chart';
import { PopularClassesChart } from '@/components/admin/popular-classes-chart';
import { RecentBookings } from '@/components/admin/recent-bookings';
import { QuickActions } from '@/components/admin/quick-actions';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at New Bodies Gym.
        </p>
      </div>

      <StatsCards stats={stats!} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingsChart data={stats?.bookingsTrend || []} />
        <MembershipChart data={stats?.membershipDistribution || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentBookings />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PopularClassesChart data={stats?.popularClasses || []} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}