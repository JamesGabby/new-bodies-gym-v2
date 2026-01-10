// src/app/admin/class-types/page.tsx
'use client';

import { useState } from 'react';
import { useClassTypes } from '@/hooks/use-admin';
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
import { MoreHorizontal, Plus, ArrowUpDown, Edit, Trash2, Copy } from 'lucide-react';
import { ClassType } from '@/types/database';
import { toast } from 'sonner';
import { ClassTypeDialog } from '@/components/admin/class-type-dialog';
import { cn } from '@/lib/utils';

export default function ClassTypesPage() {
  const { classTypes, loading, deleteClassType, refetch } = useClassTypes();
  const [selectedClassType, setSelectedClassType] = useState<ClassType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classTypeToDelete, setClassTypeToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!classTypeToDelete) return;
    
    try {
      await deleteClassType(classTypeToDelete);
      toast.success('Class type deleted successfully');
      setIsDeleteDialogOpen(false);
      setClassTypeToDelete(null);
    } catch (error) {
      toast.error('Failed to delete class type. It may have associated schedules.');
    }
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ['Beginner', 'Easy', 'Moderate', 'Challenging', 'Advanced'];
    return labels[level - 1] || 'Unknown';
  };

  const columns: ColumnDef<ClassType>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Class Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const classType = row.original;
        return (
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: classType.color || '#ADFF2F' }}
            />
            <div>
              <p className="font-medium">{classType.name}</p>
              <p className="text-sm text-muted-foreground">{classType.slug}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'duration_minutes',
      header: 'Duration',
      cell: ({ row }) => `${row.original.duration_minutes} mins`,
    },
    {
      accessorKey: 'max_capacity',
      header: 'Capacity',
      cell: ({ row }) => row.original.max_capacity,
    },
    {
      accessorKey: 'difficulty_level',
      header: 'Difficulty',
      cell: ({ row }) => {
        const level = row.original.difficulty_level || 1;
        return (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'w-2 h-2 rounded-full',
                    i <= level ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {getDifficultyLabel(level)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'calories_burn_estimate',
      header: 'Est. Calories',
      cell: ({ row }) => row.original.calories_burn_estimate 
        ? `~${row.original.calories_burn_estimate} kcal`
        : '-',
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
        const classType = row.original;
        
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
                  setSelectedClassType(classType);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedClassType({ ...classType, id: '', name: `${classType.name} (Copy)` });
                  setIsDialogOpen(true);
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setClassTypeToDelete(classType.id);
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
          <h1 className="text-3xl font-bold tracking-tight">Class Types</h1>
          <p className="text-muted-foreground">
            Manage the types of classes offered at your gym
          </p>
        </div>
        <Button onClick={() => {
          setSelectedClassType(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Class Type
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={classTypes}
        searchKey="name"
        searchPlaceholder="Search class types..."
      />

      {/* Class Type Dialog */}
      <ClassTypeDialog
        classType={selectedClassType}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
          setSelectedClassType(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the class type.
              Note: You cannot delete class types that have scheduled classes.
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