import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { ErrorMessage } from '@/components/ErrorMessage'
import { StatusBadge } from '@/components/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { USERS_PAGE_SIZE } from '@/services/users'
import { formatUserName } from '@/lib/user-utils'
import type { Pagination, User } from '@/types/api'

interface UserListProps {
  users: User[]
  pagination?: Pagination
  page: number
  onPageChange: (page: number) => void
  isLoading: boolean
  isError: boolean
  error: unknown
  onRetry: () => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onAddUser: () => void
}

function TableSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading users">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
      <span className="sr-only">Loading users…</span>
    </div>
  )
}

export function UserList({
  users,
  pagination,
  page,
  onPageChange,
  isLoading,
  isError,
  error,
  onRetry,
  onEdit,
  onDelete,
  onAddUser,
}: UserListProps) {
  const total = pagination?.total ?? users.length
  const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE))
  const hasPagination = totalPages > 1

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <TableSkeleton />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4 rounded-lg border bg-card p-6">
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : 'Failed to load users. Please try again.'
          }
        />
        <Button variant="outline" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title="No users yet"
        description="Get started by adding your first coach or player account."
        action={
          <Button onClick={onAddUser} className="min-h-11">
            Add User
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Name</TableHead>
                <TableHead scope="col">Email</TableHead>
                <TableHead scope="col">Role</TableHead>
                <TableHead scope="col" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {formatUserName(user)}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <StatusBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                        aria-label={`Edit ${formatUserName(user)}`}
                        className="min-h-11 min-w-11 sm:min-h-9 sm:min-w-auto"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user)}
                        disabled={user.is_self}
                        aria-label={
                          user.is_self
                            ? `Cannot remove your own account`
                            : `Remove ${formatUserName(user)}`
                        }
                        title={
                          user.is_self
                            ? 'You cannot remove your own account'
                            : undefined
                        }
                        className="min-h-11 min-w-11 text-destructive hover:text-destructive sm:min-h-9 sm:min-w-auto"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only sm:ml-1">
                          Remove
                        </span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {hasPagination && (
        <nav
          className="flex items-center justify-between gap-4"
          aria-label="User list pagination"
        >
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
              className="min-h-11 min-w-11 sm:min-h-9"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              aria-label="Next page"
              className="min-h-11 min-w-11 sm:min-h-9"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  )
}
