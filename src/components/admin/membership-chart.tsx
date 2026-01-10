// src/components/admin/membership-chart.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MembershipChartProps {
  data: { type: string; count: number }[];
}

const COLORS = ['hsl(82, 100%, 59%)', 'hsl(82, 100%, 45%)', 'hsl(82, 100%, 35%)', 'hsl(82, 100%, 25%)'];

export function MembershipChart({ data }: MembershipChartProps) {
  return (
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
                data={data}
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
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}