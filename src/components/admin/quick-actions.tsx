// src/components/admin/quick-actions.tsx
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  CalendarPlus, 
  Megaphone, 
  FileText,
  Mail,
  Settings
} from 'lucide-react';

const actions = [
  {
    title: 'Add Member',
    description: 'Register a new member',
    href: '/admin/members/new',
    icon: UserPlus,
  },
  {
    title: 'Create Class',
    description: 'Add a new class type',
    href: '/admin/class-types/new',
    icon: CalendarPlus,
  },
  {
    title: 'New Announcement',
    description: 'Post an announcement',
    href: '/admin/announcements/new',
    icon: Megaphone,
  },
  {
    title: 'View Reports',
    description: 'Generate reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    title: 'Messages',
    description: 'View contact messages',
    href: '/admin/messages',
    icon: Mail,
  },
  {
    title: 'Settings',
    description: 'Gym settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button
              variant="outline"
              className="w-full h-auto flex-col items-center justify-center gap-2 py-4 hover:bg-primary/10 hover:border-primary"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{action.title}</span>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}