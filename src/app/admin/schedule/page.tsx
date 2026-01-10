// src/app/admin/schedule/page.tsx
'use client';

import { useState } from 'react';
import { useSchedule, useClassTypes, useInstructors } from '@/hooks/use-admin';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, ArrowUpDown, Edit, Trash2, Calendar } from 'lucide-react';
import { ClassSchedule, ClassType, Instructor } from '@/types/database';
import { toast } from 'sonner';
import { ScheduleDialog } from '@/components/admin/schedule-dialog';
import { WeeklyScheduleView } from '@/components/admin/weekly-schedule-view';

type ScheduleWithRelations = ClassSchedule & { 
  class_type?: ClassType; 
  instructor?: Instructor;
};

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function SchedulePage() {
  const { schedules, loading, deleteSchedule, refetch } = useSchedule();
  const { classTypes } = useClassTypes();
  const { instructors } = useInstructors();
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'calendar'>('table');

  const handleDelete = async () => {
    if (!scheduleToDelete) return;
    
    try {
      await deleteSchedule(scheduleToDelete);
      toast.success('Schedule deleted successfully');
      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    } catch (error) {
      toast.error('Failed to delete schedule');
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: ColumnDef<ScheduleWithRelations>[] = [
    {
      accessorKey: 'day_of_week',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Day
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="capitalize font-medium">{row.original.day_of_week}</span>
      ),
      sortingFn: (rowA, rowB) => {
        const a = dayOrder.indexOf(rowA.original.day_of_week);
        const b = dayOrder.indexOf(rowB.original.day_of_week);
        return a - b;
      },
    },
    {
      accessorKey: 'class_type',
      header: 'Class',
      cell: ({ row }) => {
        const classType = row.original.class_type;
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: classType?.color || '#ADFF2F' }}
            />
            <span className="font-medium">{classType?.name || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'start_time',
      header: 'Time',
      cell: ({ row }) => (
        <span>
          {formatTime(row.original.start_time)} - {formatTime(row.original.end_time)}
        </span>
      ),
    },
    {
      accessorKey: 'instructor',
      header: 'Instructor',
      cell: ({ row }) => row.original.instructor?.name || 'TBA',
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => row.original.location || 'Fitness Studio',
    },
    {
      accessorKey: 'max_capacity',
      header: 'Capacity',
      cell: ({ row }) => row.original.max_capacity || row.original.class_type?.max_capacity || '-',
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const schedule = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedSchedule(schedule);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setScheduleToDelete(schedule.id);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <p className="text-muted-foreground">
            Manage your weekly class schedule
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as 'table' | 'calendar')}>
            <TabsList>
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => {
            setSelectedSchedule(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        </div>
      </div>

      {view === 'table' ? (
        <DataTable
          columns={columns}
          data={schedules}
          searchKey="class_type"
          searchPlaceholder="Search schedules..."
        />
      ) : (
        <WeeklyScheduleView 
          schedules={schedules}
          onEdit={(schedule) => {
            setSelectedSchedule(schedule);
            setIsDialogOpen(true);
          }}
        />
      )}

      {/* Schedule Dialog */}
      <ScheduleDialog
        schedule={selectedSchedule}
        classTypes={classTypes}
        instructors={instructors}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
          setSelectedSchedule(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this class from the weekly schedule.
              Any future class instances created from this schedule will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}