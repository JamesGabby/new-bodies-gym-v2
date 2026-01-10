// src/components/admin/stats-cards.tsx
'use client';

import { DashboardStats } from '@/hooks/use-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  DollarSign,
  UserPlus,
  Calendar,
  Activity,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Members',
      value: stats.totalMembers.toLocaleString(),
      description: `${stats.activeMembers} active`,
      icon: Users,
      trend: stats.newMembersThisMonth > 0 ? `+${stats.newMembersThisMonth} this month` : 'No change',
      trendUp: stats.newMembersThisMonth > 0,
    },
    {
      title: 'Today\'s Bookings',
      value: stats.todayBookings.toLocaleString(),
      description: `${stats.todayClasses} classes today`,
      icon: CalendarCheck,
      trend: `${stats.totalBookings} total`,
      trendUp: true,
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      description: 'Last 30 days',
      icon: Activity,
      trend: stats.attendanceRate >= 80 ? 'Excellent' : stats.attendanceRate >= 60 ? 'Good' : 'Needs attention',
      trendUp: stats.attendanceRate >= 70,
    },
    {
      title: 'Monthly Revenue',
      value: `£${stats.revenue.toLocaleString()}`,
      description: 'From active memberships',
      icon: DollarSign,
      trend: 'Recurring',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <span className={cn(
                "text-xs font-medium",
                card.trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {card.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}