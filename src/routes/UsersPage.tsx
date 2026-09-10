import { useEffect, useMemo, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { UserFormDialog } from '@/components/features/users/UserFormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUsers } from '@/hooks/useUsers';
import { useSortablePage } from '@/hooks/useSortablePage';
import { getApiErrorMessage } from '@/lib/api';
import { cn, titleCase } from '@/lib/utils';
import type { User } from '@/types/api';

const SEARCH_DEBOUNCE_MS = 300;

function displayName(user: User): string {
  return user.name?.trim() || `${user.first_name} ${user.last_name}`.trim();
}

export function UsersPage() {
  const { items, isLoading, error, refetch, create, update, remove } = useUsers();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, roleFilter]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return items.filter((user) => {
      const role = user.role?.toLowerCase() ?? '';
      if (roleFilter !== 'all' && role !== roleFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      const name = displayName(user).toLowerCase();
      return (
        name.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        role.includes(query)
      );
    });
  }, [items, searchQuery, roleFilter]);

  const tableItems = useMemo(
    () =>
      filteredItems.map((item) => ({
        ...item,
        name: displayName(item),
      })) as Record<string, unknown>[],
    [filteredItems],
  );
  const { paginatedItems, totalItems, sortKey, sortDirection, handleSort } = useSortablePage(
    tableItems,
    page,
    pageSize,
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setDialogOpen(true);
  };

  const handleSave = async (values: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: 'Coach' | 'Player';
  }) => {
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        role: values.role,
        ...(values.password ? { password: values.password } : {}),
      };
      if (editing) {
        await update(editing.id, payload);
        toast.success('User updated successfully.');
      } else {
        await create({ ...payload, password: values.password });
        toast.success('User created successfully.');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to save user.'));
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success('User removed successfully.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to remove user.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const showEmptyFiltered = !isLoading && !error && items.length > 0 && filteredItems.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage coach and player accounts." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            placeholder="Search Users"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="sm:max-w-xs"
            aria-label="Search Users"
          />
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto',
            )}
            aria-label="Filter By Role"
          >
            <option value="all">All Roles</option>
            <option value="coach">Coach</option>
            <option value="player">Player</option>
          </select>
        </div>
        <Button type="button" onClick={openCreate}>
          Add User
        </Button>
      </div>

      {error ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState label="Loading users…" />
      ) : items.length === 0 && !error ? (
        <EmptyState
          title="No Users Yet"
          description="Use Add User in the toolbar to create the first user account."
        />
      ) : showEmptyFiltered ? (
        <EmptyState
          title="No Matching Users"
          description="Try adjusting your search or role filter."
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  label="Name"
                  sortKey="name"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHead
                  label="Email"
                  sortKey="email"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHead
                  label="Role"
                  sortKey="role"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <TableHead scope="col">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((row) => {
                const user = row as unknown as User;
                const name = displayName(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{titleCase(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={user.is_self === true}
                            onClick={() => {
                              if (user.is_self !== true) {
                                setDeleteTarget(user);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <PaginationControls
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      )}

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editing}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove User?"
        description="This will permanently remove the user account. This action cannot be undone."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
