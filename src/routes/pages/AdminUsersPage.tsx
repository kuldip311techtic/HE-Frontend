import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { RemoveUserDialog } from '@/components/features/users/RemoveUserDialog';
import { UserForm } from '@/components/features/users/UserForm';
import { UsersTable } from '@/components/features/users/UsersTable';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { TablePagination } from '@/components/ui/pagination';
import { useUserMutations } from '@/hooks/useUserMutations';
import { useUsers } from '@/hooks/useUsers';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getApiErrorMessage } from '@/lib/utils/errors';
import type { UserCreateRequest, UserItem, UserRole, UserUpdateRequest } from '@/types/users';

function isCreatePayload(
  payload: UserCreateRequest | UserUpdateRequest,
): payload is UserCreateRequest {
  return 'password' in payload && typeof payload.password === 'string';
}

const ROLE_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'All roles' },
  { value: 'Coach', label: 'Coach' },
  { value: 'Player', label: 'Player' },
];

export function AdminUsersPage() {
  const { isHydrating, user } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1;
  const pageSize = Number.parseInt(searchParams.get('page_size') ?? '10', 10) || 10;
  const search = searchParams.get('search') ?? '';
  const role = searchParams.get('role') ?? '';

  const [searchInput, setSearchInput] = useState(search);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const listParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      search: search || null,
      role: (role as UserRole) || null,
    }),
    [page, pageSize, search, role],
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(listParams);
  const { create, update, remove } = useUserMutations();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === '') {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === search) {
      return;
    }

    const timer = window.setTimeout(() => {
      updateParams({ search: trimmed || null, page: '1' });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  const handleAddUser = () => {
    setFormMode('create');
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (selected: UserItem) => {
    setFormMode('edit');
    setSelectedUser(selected);
    setFormOpen(true);
  };

  const handleRemoveUser = (selected: UserItem) => {
    setSelectedUser(selected);
    setRemoveError(null);
    setRemoveOpen(true);
  };

  const handleFormSubmit = async (payload: UserCreateRequest | UserUpdateRequest) => {
    if (formMode === 'create') {
      if (!isCreatePayload(payload)) {
        throw new Error('Unable to create user. Please check the form and try again.');
      }
      await create.mutateAsync(payload);
    } else if (selectedUser) {
      await update.mutateAsync({ userId: selectedUser.id, payload });
    }
  };

  const handleConfirmRemove = async () => {
    if (!selectedUser) return;
    setRemoveError(null);
    try {
      await remove.mutateAsync(selectedUser.id);
      setRemoveOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setRemoveError(getApiErrorMessage(err, 'Unable to remove user. Please try again.'));
    }
  };

  if (isHydrating) {
    return <LoadingState message="Loading users…" fullPage />;
  }

  const users = data?.items ?? [];
  const pagination = data?.pagination;
  const isFormSubmitting = create.isPending || update.isPending;
  const pageSortOnly = pagination ? pagination.total > users.length : false;

  return (
    <div className="admin-manage-page">
      <div className="admin-manage-page__glow" aria-hidden="true" />
      <div className="admin-manage-page__inner">
        <header className="admin-manage-page__header">
          <h2 className="text-body-42 text-foreground">Manage Users</h2>
          <p className="font-outfit text-body-sm text-muted-foreground">
            View, add, edit, and remove coach and player accounts on the platform.
          </p>
        </header>

        <div className="admin-manage-page__toolbar">
          <div className="admin-manage-page__toolbar-filters">
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search users…"
              aria-label="Search users"
              className="admin-field-input w-full sm:max-w-md"
            />
            <select
              value={role}
              onChange={(event) => updateParams({ role: event.target.value || null, page: '1' })}
              aria-label="Filter by role"
              className="admin-field-select sm:w-auto"
            >
              {ROLE_FILTER_OPTIONS.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button type="button" onClick={handleAddUser} className="admin-primary-btn shrink-0">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add user
          </Button>
        </div>

        {isError ? (
          <EmptyState
            title="Unable to load users"
            description={getApiErrorMessage(error, 'Unable to load users. Please try again.')}
            action={
              <Button
                onClick={() => refetch()}
                isLoading={isFetching}
                disabled={isFetching}
                className="admin-primary-btn"
              >
                {isFetching ? 'Retrying…' : 'Retry'}
              </Button>
            }
          />
        ) : null}

        {!isError && isLoading ? (
          <UsersTable
            users={[]}
            isLoading
            currentUserId={user?.id}
            onEdit={() => {}}
            onRemove={() => {}}
          />
        ) : null}

        {!isError && !isLoading && users.length === 0 ? (
          <EmptyState
            title="No users yet"
            description="Add a coach or player account to get started."
            action={
              <Button type="button" onClick={handleAddUser} className="admin-primary-btn">
                Add user
              </Button>
            }
          />
        ) : null}

        {!isError && !isLoading && users.length > 0 ? (
          <div className="flex flex-col gap-4">
            <UsersTable
              users={users}
              currentUserId={user?.id}
              pageSortOnly={pageSortOnly}
              onEdit={handleEditUser}
              onRemove={handleRemoveUser}
            />
            {pagination ? (
              <TablePagination
                pagination={pagination}
                appearance="admin"
                onPageChange={(nextPage) => updateParams({ page: String(nextPage) })}
                onPageSizeChange={(nextSize) =>
                  updateParams({ page_size: String(nextSize), page: '1' })
                }
              />
            ) : null}
          </div>
        ) : null}
      </div>

      <UserForm
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        user={selectedUser}
        onSubmit={handleFormSubmit}
        isSubmitting={isFormSubmitting}
      />

      <RemoveUserDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        user={selectedUser}
        onConfirm={handleConfirmRemove}
        isLoading={remove.isPending}
        errorMessage={removeError}
      />
    </div>
  );
}
