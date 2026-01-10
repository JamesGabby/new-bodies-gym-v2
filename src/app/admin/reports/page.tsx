// src/app/admin/reports/page.tsx
'use client';

import { useState } from 'react';
import { useDashboardStats } from '@/hooks/use-admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  CalendarIcon, 
  Download, 
  FileText, 
  TrendingUp, 
  Users, 
  Calendar as CalendarIconSolid,
  DollarSign
} from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(82, 100%, 59%)', 'hsl(82, 100%, 45%)', 'hsl(82, 100%, 35%)', 'hsl(82, 100%, 25%)', '#888888'];

export default function ReportsPage() {
  const { stats, loading } = useDashboardStats();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [reportType, setReportType] = useState<'overview' | 'bookings' | 'members' | 'revenue'>('overview');

  // Mock data for demonstration - in production, fetch based on dateRange
  const bookingsByClass = stats?.popularClasses || [];
  const membershipData = stats?.membershipDistribution || [];
  const bookingsTrend = stats?.bookingsTrend || [];

  const summaryStats = [
    {
      title: 'Total Members',
      value: stats?.totalMembers || 0,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      change: '+8%',
      changeType: 'positive',
      icon: CalendarIconSolid,
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate || 0}%`,
      change: '+5%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      title: 'Monthly Revenue',
      value: `£${stats?.revenue?.toLocaleString() || 0}`,
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
    },
  ];

  const handleExport = (format: 'csv' | 'pdf') => {
    // In production, implement actual export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analytics and insights for your gym
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={cn(
                "text-xs",
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              )}>
                {stat.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs for different report views */}
      <Tabs value={reportType} onValueChange={(v: any) => setReportType(v)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bookings Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Bookings Trend</CardTitle>
                <CardDescription>Daily bookings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bookingsTrend}>
                      <defs>
                        <linearGradient id="colorBookingsReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(82, 100%, 59%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(82, 100%, 59%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => format(new Date(value), 'dd MMM')}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelFormatter={(value) => format(new Date(value), 'dd MMM yyyy')}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(82, 100%, 59%)"
                        strokeWidth={2}
                        fill="url(#colorBookingsReport)"
                        name="Bookings"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Membership Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Membership Distribution</CardTitle>
                <CardDescription>Active memberships by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={membershipData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                        nameKey="type"
                        label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {membershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Classes</CardTitle>
              <CardDescription>Most booked classes in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsByClass} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar 
                      dataKey="bookings" 
                      fill="hsl(82, 100%, 59%)" 
                      radius={[0, 4, 4, 0]}
                      name="Bookings"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Analytics</CardTitle>
              <CardDescription>Detailed booking statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bookingsTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => format(new Date(value), 'dd MMM')}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="hsl(82, 100%, 59%)" 
                      strokeWidth={2}
                      dot={false}
                      name="Bookings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Growth</CardTitle>
                <CardDescription>New member registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Member growth chart would appear here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Retention</CardTitle>
                <CardDescription>Membership renewal rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Retention chart would appear here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Revenue chart would appear here with actual payment data integration
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}