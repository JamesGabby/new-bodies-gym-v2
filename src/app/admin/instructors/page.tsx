// src/app/admin/instructors/page.tsx
'use client';

import { useState } from 'react';
import { useInstructors } from '@/hooks/use-admin';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { MoreHorizontal, Plus, ArrowUpDown, Edit, Trash2, Mail, Phone } from 'lucide-react';
import { Instructor } from '@/types/database';
import { toast } from 'sonner';
import { InstructorDialog } from '@/components/admin/instructor-dialog';

export default function InstructorsPage() {
  const { instructors, loading, deleteInstructor, refetch } = useInstructors();
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!instructorToDelete) return;
    
    try {
      await deleteInstructor(instructorToDelete);
      toast.success('Instructor deleted successfully');
      setIsDeleteDialogOpen(false);
      setInstructorToDelete(null);
    } catch (error) {
      toast.error('Failed to delete instructor. They may have scheduled classes.');
    }
  };

  const columns: ColumnDef<Instructor>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Instructor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const instructor = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={instructor.avatar_url || ''} />
              <AvatarFallback>
                {instructor.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{instructor.name}</p>
              <p className="text-sm text-muted-foreground">{instructor.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone || '-',
    },
    {
      accessorKey: 'specializations',
      header: 'Specializations',
      cell: ({ row }) => {
        const specs = row.original.specializations || [];
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {specs.length > 0 ? (
              specs.slice(0, 3).map((spec, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
            {specs.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{specs.length - 3}
              </Badge>
            )}
          </div>
        );
      },
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
        const instructor = row.original;
        
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
                  setSelectedInstructor(instructor);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {instructor.email && (
                <DropdownMenuItem
                  onClick={() => window.location.href = `mailto:${instructor.email}`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </DropdownMenuItem>
              )}
              {instructor.phone && (
                <DropdownMenuItem
                  onClick={() => window.location.href = `tel:${instructor.phone}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setInstructorToDelete(instructor.id);
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
          <h1 className="text-3xl font-bold tracking-tight">Instructors</h1>
          <p className="text-muted-foreground">
            Manage your gym instructors
          </p>
        </div>
        <Button onClick={() => {
          setSelectedInstructor(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Instructor
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={instructors}
        searchKey="name"
        searchPlaceholder="Search instructors..."
      />

      {/* Instructor Dialog */}
      <InstructorDialog
        instructor={selectedInstructor}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
          setSelectedInstructor(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Make sure this instructor has no scheduled classes
              before deleting.
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