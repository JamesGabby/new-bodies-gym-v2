// src/app/admin/announcements/page.tsx
'use client';

import { useState } from 'react';
import { useAnnouncements } from '@/hooks/use-admin';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ColumnDef } from '@tanstack/react-table';
import { 
  MoreHorizontal, 
  Plus, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
  CheckCircle,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { Announcement } from '@/types/database';
import { toast } from 'sonner';
import { AnnouncementDialog } from '@/components/admin/announcement-dialog';
import { cn } from '@/lib/utils';

const typeConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  alert: { icon: Bell, color: 'text-red-500', bg: 'bg-red-500/10' },
};

export default function AnnouncementsPage() {
  const { announcements, loading, deleteAnnouncement, updateAnnouncement, refetch } = useAnnouncements();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!announcementToDelete) return;
    
    try {
      await deleteAnnouncement(announcementToDelete);
      toast.success('Announcement deleted successfully');
      setIsDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      await updateAnnouncement(id, { is_active: !currentState });
      toast.success(`Announcement ${!currentState ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update announcement');
    }
  };

  const columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type as keyof typeof typeConfig || 'info';
        const config = typeConfig[type] || typeConfig.info;
        const Icon = config.icon;
        
        return (
          <div className={cn("flex items-center gap-2 p-2 rounded-lg w-fit", config.bg)}>
            <Icon className={cn("h-4 w-4", config.color)} />
            <span className={cn("text-sm font-medium capitalize", config.color)}>
              {type}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="font-medium truncate">{row.original.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {row.original.content}
          </p>
        </div>
      ),
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
      accessorKey: 'start_date',
      header: 'Schedule',
      cell: ({ row }) => {
        const start = row.original.start_date;
        const end = row.original.end_date;
        
        return (
          <div className="text-sm">
            <p>From: {start ? format(new Date(start), 'dd MMM yyyy') : 'Now'}</p>
            <p className="text-muted-foreground">
              To: {end ? format(new Date(end), 'dd MMM yyyy') : 'Indefinite'}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.created_at;
        return date ? format(new Date(date), 'dd MMM yyyy') : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const announcement = row.original;
        
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
                  setSelectedAnnouncement(announcement);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleActive(announcement.id, announcement.is_active ?? false)}
              >
                {announcement.is_active ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setAnnouncementToDelete(announcement.id);
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
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Manage gym announcements and notifications
          </p>
        </div>
        <Button onClick={() => {
          setSelectedAnnouncement(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={announcements}
        searchKey="title"
        searchPlaceholder="Search announcements..."
      />

      {/* Announcement Dialog */}
      <AnnouncementDialog
        announcement={selectedAnnouncement}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
          setSelectedAnnouncement(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the announcement.
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