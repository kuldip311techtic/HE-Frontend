import { Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { DeleteUserDialog } from '@/components/features/users/DeleteUserDialog';
import {
  UserFormDialog,
  type UserFormValues,
} from '@/components/features/users/UserFormDialog';
import { UsersTable } from '@/components/features/users/UsersTable';
import { Button } from '@/components/ui/button';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/useUserMutations';
import { useUsers } from '@/hooks/useUsers';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  getApiErrorMessage,
  getApiFieldErrors,
} from '@/lib/api/get-api-error-message';
import { canRemoveUser } from '@/lib/api/users';
import type { AdminUserItem, AdminUserRole } from '@/types/api';

function parseRole(value: string | null): AdminUserRole | undefined {
  if (value === 'coach' || value === 'player' || value === 'org_admin' || value === 'super_admin') {
    return value;
  }
  return undefined;
}

export function UsersPage() {
  const { user: authUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const pageSize = Math.max(10, Number(searchParams.get('page_size') ?? '20') || 20);
  const role = parseRole(searchParams.get('role'));
  const searchInput = searchParams.get('search') ?? '';
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useUsers({
    page,
    pageSize,
    search: debouncedSearch,
    role,
  });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearchChange = (value: string) => {
    updateSearchParams({ search: value || null, page: '1' });
  };

  const handleRoleChange = (value: string) => {
    updateSearchParams({ role: value === 'all' ? null : value, page: '1' });
  };

  const handlePageChange = (nextPage: number) => {
    updateSearchParams({ page: String(nextPage) });
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    updateSearchParams({ page_size: String(nextPageSize), page: '1' });
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setSubmitError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleEdit = (user: AdminUserItem) => {
    setSelectedUser(user);
    setSubmitError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleRemove = (user: AdminUserItem) => {
    if (!canRemoveUser(user, authUser?.id)) {
      return;
    }

    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (values: UserFormValues) => {
    setSubmitError(null);
    setFieldErrors({});

    try {
      if (selectedUser) {
        const body: {
          first_name: string;
          last_name: string;
          email: string;
          role: AdminUserRole;
          password?: string;
        } = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role: values.role,
        };

        if (values.password?.trim()) {
          body.password = values.password.trim();
        }

        await updateMutation.mutateAsync({
          userId: selectedUser.id,
          body,
        });
        toast.success('User updated successfully.');
      } else {
        await createMutation.mutateAsync({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password ?? '',
          role: values.role,
        });
        toast.success('User created successfully.');
      }

      setFormOpen(false);
      setSelectedUser(null);
    } catch (mutationError) {
      const apiFieldErrors = getApiFieldErrors(mutationError);
      if (Object.keys(apiFieldErrors).length > 0) {
        setFieldErrors(apiFieldErrors);
      }
      setSubmitError(getApiErrorMessage(mutationError));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(selectedUser.id);
      toast.success('User removed successfully.');
      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (mutationError) {
      toast.error(getApiErrorMessage(mutationError));
    }
  };

  const roleOptions = useMemo(() => data?.roles ?? [], [data?.roles]);
  const filterRoleValue = role ?? 'all';

  const emptyDescription = useMemo(() => {
    if (debouncedSearch) {
      return 'No users match your search. Try a different term or clear filters.';
    }
    if (role) {
      const roleLabel = roleOptions.find((option) => option.value === role)?.label ?? role;
      return `No ${roleLabel.toLowerCase()} accounts yet.`;
    }
    return 'No coach or player accounts yet.';
  }, [debouncedSearch, role, roleOptions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-outfit text-body-25">Users</h1>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Manage coach and player accounts across Hoops Engine.
          </p>
        </div>
        <Button type="button" onClick={handleAdd}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add user
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            placeholder="Search users…"
            value={searchInput}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-10 max-w-sm"
            aria-label="Search users"
          />
          <Select value={filterRoleValue} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-10 w-full sm:w-[180px]" aria-label="Filter by role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {data?.pagination ? (
          <p className="text-body-sm text-muted-foreground" aria-live="polite">
            {data.pagination.total} total users
          </p>
        ) : null}
      </div>

      {isLoading ? <LoadingState message="Loading users…" /> : null}

      {isError ? (
        <EmptyState
          title="Unable to load users"
          description={getApiErrorMessage(error)}
          action={
            <Button type="button" variant="outline" onClick={() => void refetch()}>
              Retry
            </Button>
          }
        />
      ) : null}

      {!isLoading && !isError && data ? (
        data.items.length > 0 ? (
          <div className="space-y-4">
            <UsersTable
              users={data.items}
              roleOptions={roleOptions}
              currentUserId={authUser?.id}
              onEdit={handleEdit}
              onRemove={handleRemove}
            />
            <DataTablePagination
              pagination={data.pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        ) : (
          <EmptyState
            title="No users"
            description={emptyDescription}
            action={
              <Button type="button" onClick={handleAdd}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add user
              </Button>
            }
          />
        )
      ) : null}

      <UserFormDialog
        key={selectedUser?.id ?? 'create'}
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        roleOptions={roleOptions}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        fieldErrors={fieldErrors}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void handleDeleteConfirm()}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
