import { AlertCircle, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { formatUserDisplayName } from '@/lib/utils';
import type { PaginationMeta, SuperAdminUserRecord } from '@/types';

interface UserListProps {
  users: SuperAdminUserRecord[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onEdit: (user: SuperAdminUserRecord) => void;
  onDelete: (user: SuperAdminUserRecord) => void;
  onPageChange: (page: number) => void;
  onAddUser: () => void;
}

function UserListSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading users">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-md" />
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
      role="alert"
    >
      <AlertCircle className="mb-4 h-10 w-10 text-destructive" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-foreground">Unable to load users</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-6" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function UserList({
  users,
  pagination,
  isLoading,
  isError,
  errorMessage = 'Something went wrong while loading users.',
  onRetry,
  onEdit,
  onDelete,
  onPageChange,
  onAddUser,
}: UserListProps) {
  if (isLoading) {
    return <UserListSkeleton />;
  }

  if (isError) {
    return <ErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title="No users yet"
        description="Get started by adding a coach or player account."
        action={
          <Button type="button" onClick={onAddUser}>
            Add user
          </Button>
        }
      />
    );
  }

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.total_pages ?? 1;
  const total = pagination?.total ?? users.length;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Name</TableHead>
              <TableHead scope="col">Email</TableHead>
              <TableHead scope="col">Role</TableHead>
              <TableHead scope="col" className="w-[80px] text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {formatUserDisplayName(user)}
                  {user.is_self ? (
                    <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                  ) : null}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <StatusBadge role={user.role} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${formatUserDisplayName(user)}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(user)}
                        disabled={user.is_self}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages} ({total} users)
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.has_prev}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.has_next}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
