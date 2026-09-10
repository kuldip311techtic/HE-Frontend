import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { UserFormDialog } from '@/components/features/users/UserFormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { DataTableColumn } from '@/components/shared/DataTable';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { useUsers } from '@/hooks/useUsers';
import { useSortableItems } from '@/hooks/useSortableItems';
import { getApiErrorMessage } from '@/lib/api';
import { cn, titleCase } from '@/lib/utils';
import type { User } from '@/types/api';

const SEARCH_DEBOUNCE_MS = 300;

function displayName(user: User): string {
  return user.name?.trim() || `${user.first_name} ${user.last_name}`.trim();
}

type UserRow = User & {
  name: string;
  rolesDisplay: string;
};

const USER_COLUMNS: DataTableColumn<UserRow>[] = [
  {
    id: 'name',
    label: 'Name',
    sortKey: 'name',
    alwaysVisible: true,
    render: (user) => displayName(user),
  },
  {
    id: 'email',
    label: 'Email',
    sortKey: 'email',
    alwaysVisible: true,
    render: (user) => user.email,
  },
  {
    id: 'role',
    label: 'Role',
    sortKey: 'role',
    alwaysVisible: true,
    render: (user) => <Badge variant="secondary">{titleCase(user.role)}</Badge>,
  },
  {
    id: 'roles',
    label: 'Roles',
    sortKey: 'rolesDisplay',
    defaultVisible: false,
    render: (user) => user.rolesDisplay || '—',
  },
];

export function UsersPage() {
  const {
    items,
    isLoading,
    error,
    page,
    setPage,
    total,
    pageSize,
    refetch,
    create,
    update,
    remove,
  } = useUsers();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { visibility, toggleColumn, toggleableColumns } = useColumnVisibility(USER_COLUMNS);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, roleFilter, setPage]);

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
      const roles = user.roles?.join(' ').toLowerCase() ?? '';
      return (
        name.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        role.includes(query) ||
        roles.includes(query)
      );
    });
  }, [items, searchQuery, roleFilter]);

  const tableRows = useMemo<UserRow[]>(
    () =>
      filteredItems.map((item) => ({
        ...item,
        name: displayName(item),
        rolesDisplay: item.roles?.join(', ') ?? '',
      })),
    [filteredItems],
  );
  const { sortedItems, sortKey, sortDirection, handleSort } = useSortableItems(tableRows);

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

      <DataTable
        columns={USER_COLUMNS}
        rows={sortedItems}
        getRowKey={(user) => user.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        sortScopeNote="Search, role filter, and sorting apply to the current page only. Page size is controlled by the server."
        columnVisibility={visibility}
        onColumnVisibilityChange={toggleColumn}
        toggleableColumns={toggleableColumns}
        isLoading={isLoading}
        loadingLabel="Loading users…"
        error={error}
        onRetry={() => void refetch()}
        isEmpty={!isLoading && !error && total === 0}
        emptyTitle="No Users Yet"
        emptyDescription="Use Add User in the toolbar to create the first user account."
        isEmptyFiltered={showEmptyFiltered}
        filteredEmptyTitle="No Matching Users"
        filteredEmptyDescription="Try adjusting your search or role filter."
        toolbar={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        }
        renderActions={(user) => (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => openEdit(user)}>
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              disabled={user.is_self === true}
              onClick={() => {
                if (user.is_self !== true) {
                  setDeleteTarget(user);
                }
              }}
            >
              Remove
            </Button>
          </div>
        )}
        pagination={
          total > 0 ? (
            <PaginationControls
              page={page}
              pageSize={pageSize}
              totalItems={total}
              onPageChange={setPage}
              onPageSizeChange={() => {}}
              hidePageSize
            />
          ) : null
        }
      />

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
