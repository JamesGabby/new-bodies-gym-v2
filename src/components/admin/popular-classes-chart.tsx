// src/components/admin/popular-classes-chart.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface PopularClassesChartProps {
  data: { name: string; bookings: number }[];
}

export function PopularClassesChart({ data }: PopularClassesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Classes</CardTitle>
        <CardDescription>Most booked classes in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
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
                fill="hsl(var(--primary))" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}