// src/components/admin/weekly-schedule-view.tsx
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ClassSchedule, ClassType, Instructor } from '@/types';
import { Edit, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type ScheduleWithRelations = ClassSchedule & { 
  class_type?: ClassType; 
  instructor?: Instructor;
};

interface WeeklyScheduleViewProps {
  schedules: ScheduleWithRelations[];
  onEdit: (schedule: ScheduleWithRelations) => void;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyScheduleView({ schedules, onEdit }: WeeklyScheduleViewProps) {
  const schedulesByDay = useMemo(() => {
    const grouped: Record<string, ScheduleWithRelations[]> = {};
    days.forEach(day => {
      grouped[day] = schedules
        .filter(s => s.day_of_week === day)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    return grouped;
  }, [schedules]);

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="grid grid-cols-7 gap-4 min-w-[900px]">
            {days.map((day, index) => (
              <div key={day} className="space-y-3">
                <div className="text-center">
                  <h3 className="font-semibold text-lg capitalize">{dayLabels[index]}</h3>
                  <p className="text-xs text-muted-foreground">
                    {schedulesByDay[day].length} classes
                  </p>
                </div>
                <div className="space-y-2 min-h-[400px]">
                  {schedulesByDay[day].length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No classes
                    </div>
                  ) : (
                    schedulesByDay[day].map((schedule) => (
                      <ScheduleCard 
                        key={schedule.id} 
                        schedule={schedule}
                        onEdit={() => onEdit(schedule)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface ScheduleCardProps {
  schedule: ScheduleWithRelations;
  onEdit: () => void;
}

function ScheduleCard({ schedule, onEdit }: ScheduleCardProps) {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-3 space-y-2 transition-all hover:shadow-md cursor-pointer group",
        !schedule.is_active && "opacity-50"
      )}
      style={{ 
        borderLeftWidth: '4px',
        borderLeftColor: schedule.class_type?.color || '#ADFF2F' 
      }}
      onClick={onEdit}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-tight">
          {schedule.class_type?.name}
        </h4>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
        </div>
        
        {schedule.instructor && (
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{schedule.instructor.name}</span>
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{schedule.location || 'Studio'}</span>
        </div>
      </div>

      {!schedule.is_active && (
        <Badge variant="secondary" className="text-xs">
          Inactive
        </Badge>
      )}
    </div>
  );
}