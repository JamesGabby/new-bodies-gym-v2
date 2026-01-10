// src/app/admin/members/page.tsx
'use client';

import { useState } from 'react';
import { useMembers } from '@/hooks/use-admin';
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
import { MoreHorizontal, Plus, ArrowUpDown, Mail, Phone, Edit, Trash2, UserCog } from 'lucide-react';
import { format } from 'date-fns';
import { Profile, Membership } from '@/types/database';
import Link from 'next/link';
import { toast } from 'sonner';
import { MemberDialog } from '@/components/admin/member-dialog';

type MemberWithMembership = Profile & { membership?: Membership };

export default function MembersPage() {
  const { members, loading, deleteMember, updateMember, refetch } = useMembers();
  const [selectedMember, setSelectedMember] = useState<MemberWithMembership | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      await deleteMember(memberToDelete);
      toast.success('Member deleted successfully');
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const columns: ColumnDef<MemberWithMembership>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Member
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={member.avatar_url || ''} />
              <AvatarFallback>
                {member.first_name?.[0]}{member.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {member.first_name} {member.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
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
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant={row.original.role === 'admin' ? 'default' : 'secondary'}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: 'membership',
      header: 'Membership',
      cell: ({ row }) => {
        const membership = row.original.membership;
        if (!membership) return <Badge variant="outline">None</Badge>;
        
        return (
          <div className="space-y-1">
            <Badge 
              variant={membership.status === 'active' ? 'default' : 'destructive'}
            >
              {membership.membership_type}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {membership.status}
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
          Joined
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
        const member = row.original;
        
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
                  setSelectedMember(member);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/members/${member.id}`}>
                  <UserCog className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => window.location.href = `mailto:${member.email}`}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              {member.phone && (
                <DropdownMenuItem
                  onClick={() => window.location.href = `tel:${member.phone}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setMemberToDelete(member.id);
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
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage your gym members and their memberships
          </p>
        </div>
        <Link href="/admin/members/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={members}
        searchKey="email"
        searchPlaceholder="Search by email..."
      />

      {/* Edit Member Dialog */}
      <MemberDialog
        member={selectedMember}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          refetch();
          setIsEditDialogOpen(false);
          setSelectedMember(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the member
              and all associated data including bookings and membership records.
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