import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { EditUserDialog } from '@/components/EditUserDialog'
import { ActiveBadge, RoleBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteUser } from '@/hooks/useDeleteUser'
import { formatDateTime, formatDisplayName } from '@/lib/utils'
import type { PaginationMeta } from '@/services/api-client'
import type { SuperAdminUser, UserRoleOption } from '@/types/super-admin'

interface UserListProps {
  users: SuperAdminUser[]
  pagination: PaginationMeta
  roleOptions?: UserRoleOption[]
  page: number
  onPageChange: (page: number) => void
}

export function UserList({
  users,
  pagination,
  roleOptions,
  page,
  onPageChange,
}: UserListProps) {
  const [editUser, setEditUser] = useState<SuperAdminUser | null>(null)
  const [deleteUser, setDeleteUser] = useState<SuperAdminUser | null>(null)

  const deleteMutation = useDeleteUser()

  const handleDelete = () => {
    if (!deleteUser) return
    deleteMutation.mutate(deleteUser.id, {
      onSuccess: () => setDeleteUser(null),
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Last sign in</TableHead>
              <TableHead className="w-[70px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {formatDisplayName(
                    user.first_name,
                    user.last_name,
                    user.name,
                  )}
                  {user.is_self && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (You)
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <ActiveBadge active={user.is_active} />
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {formatDateTime(user.last_sign_in_at)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Actions for ${user.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditUser(user)}
                        className="gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteUser(user)}
                        disabled={user.is_self}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        {user.is_self ? 'Cannot remove own account' : 'Remove'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination.total_pages > 1 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {pagination.page} of {pagination.total_pages} (
            {pagination.total} users)
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.has_prev}
              onClick={() => onPageChange(page - 1)}
              className="min-h-[36px]"
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.has_next}
              onClick={() => onPageChange(page + 1)}
              className="min-h-[36px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <EditUserDialog
        user={editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        roleOptions={roleOptions}
      />

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title="Remove user"
        description={
          deleteUser
            ? `Are you sure you want to remove ${formatDisplayName(deleteUser.first_name, deleteUser.last_name, deleteUser.name)}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Remove"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  )
}

export function UserListSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="space-y-0">
        <div className="flex gap-4 border-b border-border px-3 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, row) => (
          <div
            key={row}
            className="flex gap-4 border-b border-border px-3 py-3 last:border-0"
          >
            {Array.from({ length: 5 }).map((_, col) => (
              <Skeleton key={col} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
