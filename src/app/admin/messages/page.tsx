// src/app/admin/messages/page.tsx
'use client';

import { useState } from 'react';
import { useContactSubmissions } from '@/hooks/use-admin';
import { useAuth } from '@/hooks/use-auth';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  ArrowUpDown, 
  Mail, 
  Phone, 
  Trash2,
  Eye,
  CheckCircle,
  Circle,
  Reply
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ContactSubmission } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { submissions, loading, markAsRead, markAsResponded, deleteSubmission, refetch } = useContactSubmissions();
  const { user } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const unreadCount = submissions.filter(s => !s.is_read).length;

  const handleView = async (message: ContactSubmission) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    if (!message.is_read) {
      try {
        await markAsRead(message.id);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
  };

  const handleMarkResponded = async () => {
    if (!selectedMessage || !user) return;
    
    try {
      await markAsResponded(selectedMessage.id, user.id);
      toast.success('Marked as responded');
      setSelectedMessage(prev => prev ? { ...prev, responded_at: new Date().toISOString() } : null);
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    
    try {
      await deleteSubmission(messageToDelete);
      toast.success('Message deleted');
      setIsDeleteDialogOpen(false);
      setMessageToDelete(null);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const columns: ColumnDef<ContactSubmission>[] = [
    {
      accessorKey: 'is_read',
      header: '',
      cell: ({ row }) => (
        <div className="w-4">
          {row.original.is_read ? (
            <Circle className="h-2 w-2 text-muted-foreground" />
          ) : (
            <Circle className="h-2 w-2 fill-primary text-primary" />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          From
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const message = row.original;
        return (
          <div>
            <p className={cn("font-medium", !message.is_read && "font-semibold")}>
              {message.name}
            </p>
            <p className="text-sm text-muted-foreground">{message.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => {
        const message = row.original;
        return (
          <div className="max-w-[250px]">
            <p className={cn("truncate", !message.is_read && "font-medium")}>
              {message.subject || 'No subject'}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {message.message}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'responded_at',
      header: 'Status',
      cell: ({ row }) => {
        const message = row.original;
        if (message.responded_at) {
          return (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Responded
            </Badge>
          );
        }
        return (
          <Badge variant="outline">
            Pending
          </Badge>
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
          Received
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.original.created_at;
        return date ? (
          <div className="text-sm">
            <p>{format(new Date(date), 'dd MMM yyyy')}</p>
            <p className="text-muted-foreground">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </p>
          </div>
        ) : '-';
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const message = row.original;
        
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
              <DropdownMenuItem onClick={() => handleView(message)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.location.href = `mailto:${message.email}?subject=Re: ${message.subject || 'Your inquiry'}`}
              >
                <Reply className="mr-2 h-4 w-4" />
                Reply via Email
              </DropdownMenuItem>
              {message.phone && (
                <DropdownMenuItem
                  onClick={() => window.location.href = `tel:${message.phone}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setMessageToDelete(message.id);
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
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Contact form submissions from your website
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={submissions}
        searchKey="name"
        searchPlaceholder="Search by name..."
      />

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Received {selectedMessage?.created_at && formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-primary hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              {selectedMessage.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <a 
                    href={`tel:${selectedMessage.phone}`}
                    className="text-primary hover:underline"
                  >
                    {selectedMessage.phone}
                  </a>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p className="font-medium">{selectedMessage.subject || 'No subject'}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <div className="mt-1 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {selectedMessage.responded_at && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Responded on {format(new Date(selectedMessage.responded_at), 'dd MMM yyyy HH:mm')}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {!selectedMessage?.responded_at && (
              <Button variant="outline" onClick={handleMarkResponded}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Responded
              </Button>
            )}
            <Button 
              onClick={() => window.location.href = `mailto:${selectedMessage?.email}?subject=Re: ${selectedMessage?.subject || 'Your inquiry'}`}
            >
              <Reply className="mr-2 h-4 w-4" />
              Reply via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
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