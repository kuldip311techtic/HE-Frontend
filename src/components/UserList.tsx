import { Pencil, Trash2, Users } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Pagination } from '@/components/Pagination'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getDisplayName } from '@/lib/user-helpers'
import type { PaginationMeta } from '@/types/api'
import type { SuperAdminUser } from '@/types/users'

interface UserListProps {
  users: SuperAdminUser[]
  pagination: PaginationMeta
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onPageChange: (page: number) => void
  onEdit: (user: SuperAdminUser) => void
  onDelete: (user: SuperAdminUser) => void
}

export function UserList({
  users,
  pagination,
  isLoading,
  isError,
  onRetry,
  onPageChange,
  onEdit,
  onDelete,
}: UserListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading users">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        <p className="font-medium">Failed to load users.</p>
        <Button
          type="button"
          variant="link"
          className="mt-1 h-auto p-0 text-destructive"
          onClick={onRetry}
        >
          Retry
        </Button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No users yet"
        description="Add a coach or player account to get started."
      />
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-border/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {getDisplayName(user)}
                  {user.is_self ? (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (You)
                    </span>
                  ) : null}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <StatusBadge role={user.role} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${getDisplayName(user)}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(user)}
                      disabled={user.is_self}
                      aria-label={
                        user.is_self
                          ? 'Cannot remove your own account'
                          : `Remove ${getDisplayName(user)}`
                      }
                      title={
                        user.is_self
                          ? 'You cannot remove your own account'
                          : undefined
                      }
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  )
}
