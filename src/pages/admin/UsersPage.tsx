import * as React from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/features/shared/ConfirmDialog';
import { DetailFields } from '@/components/features/shared/DetailFields';
import { UserFormDialog } from '@/components/features/users/UserFormDialog';
import { UsersTable } from '@/components/features/users/UsersTable';
import { useDeleteUser, useUsers } from '@/hooks/useUsers';
import { useListQuery } from '@/hooks/useListQuery';
import { useAuth } from '@/lib/auth/useAuth';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { displayName, formatBoolean, formatDateTime, humanize } from '@/lib/utils/format';
import type { AdminUserItem } from '@/types/user';
import type { PaginationMeta } from '@/types/api';
import type { UserRole } from '@/types/auth';

function toPagination(
  meta: PaginationMeta | undefined,
  page: number,
  pageSize: number,
  total: number,
): PaginationMeta {
  if (meta) return meta;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
}

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const list = useListQuery({ extraKeys: ['role'] });
  const roleFilter = (list.extras.role || undefined) as UserRole | undefined;
  const query = useUsers({
    page: list.page,
    page_size: list.pageSize,
    search: list.search || undefined,
    role: roleFilter,
  });
  const deleteMutation = useDeleteUser();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminUserItem | null>(null);
  const [viewing, setViewing] = React.useState<AdminUserItem | null>(null);
  const [removing, setRemoving] = React.useState<AdminUserItem | null>(null);

  const items = query.data?.items ?? [];
  const roles = query.data?.roles ?? [];
  const pagination = toPagination(query.data?.pagination, list.page, list.pageSize, items.length);

  const isOwnAccount = (row: AdminUserItem) => row.is_self || row.id === currentUser?.id;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleRemove = async () => {
    if (!removing) return;
    if (isOwnAccount(removing)) {
      toast.error('You cannot remove your own account.');
      setRemoving(null);
      return;
    }
    try {
      const response = await deleteMutation.mutateAsync(removing.id);
      toast.success(response.message || 'User removed successfully.');
      setRemoving(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to remove this user. Please try again.'));
    }
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Manage Users"
        description="Create and manage Super Admin, organization, coach, and player accounts."
      />
      <UsersTable
        items={items}
        roles={roles}
        loading={query.isLoading}
        error={
          query.isError ? getApiErrorMessage(query.error, 'Unable to load users. Please try again.') : null
        }
        onRetry={() => void query.refetch()}
        pagination={pagination}
        onPageChange={list.setPage}
        onPageSizeChange={list.setPageSize}
        leadingToolbar={
          <>
            <Input
              value={list.searchInput}
              onChange={(event) => list.setSearchInput(event.target.value)}
              placeholder="Search Users"
              aria-label="Search Users"
              className="md:max-w-sm"
            />
            <Select
              value={list.extras.role ?? ''}
              onChange={(event) => list.setExtra('role', event.target.value || undefined)}
              aria-label="Filter By Role"
              className="md:w-52"
            >
              <option value="">All Roles</option>
              {(roles.length > 0
                ? roles
                : [
                    { value: 'super_admin', label: 'Super Admin', description: '' },
                    { value: 'org_admin', label: 'Organization Admin', description: '' },
                    { value: 'coach', label: 'Coach', description: '' },
                    { value: 'player', label: 'Player', description: '' },
                  ]
              ).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </>
        }
        trailingToolbar={
          <Button type="button" variant="brand" onClick={openCreate}>
            Add User
          </Button>
        }
        isOwnAccount={isOwnAccount}
        onView={setViewing}
        onEdit={(row) => {
          setEditing(row);
          setFormOpen(true);
        }}
        onRemove={(row) => {
          if (isOwnAccount(row)) return;
          setRemoving(row);
        }}
      />
      <UserFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        user={editing}
        roles={roles}
        requirePassword={!editing}
      />
      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
        title={viewing ? displayName(viewing.first_name, viewing.last_name, viewing.email) : 'User'}
        description="User details from the live API."
        footer={
          <Button type="button" variant="outline" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing ? (
          <DetailFields
            sections={[
              {
                title: 'Profile',
                fields: [
                  { label: 'Name', value: viewing.name || displayName(viewing.first_name, viewing.last_name, viewing.email) },
                  { label: 'First name', value: viewing.first_name || '—' },
                  { label: 'Last name', value: viewing.last_name || '—' },
                  { label: 'Email', value: viewing.email },
                ],
              },
              {
                title: 'Access',
                fields: [
                  { label: 'Role', value: humanize(viewing.role) },
                  {
                    label: 'Roles',
                    value: (viewing.roles ?? []).map((value) => humanize(value)).join(', ') || '—',
                  },
                  { label: 'Super admin', value: formatBoolean(viewing.is_super_admin) },
                  { label: 'Active', value: formatBoolean(viewing.is_active) },
                  { label: 'This is you', value: formatBoolean(viewing.is_self) },
                  { label: 'Organization id', value: viewing.org_id || '—' },
                  { label: 'Description', value: viewing.description || '—' },
                ],
              },
              {
                title: 'Activity',
                fields: [
                  { label: 'Last sign in', value: formatDateTime(viewing.last_sign_in_at) },
                  { label: 'Created at', value: formatDateTime(viewing.created_at) },
                ],
              },
            ]}
          />
        ) : null}
      </Dialog>
      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open && deleteMutation.isPending) return;
          if (!open) setRemoving(null);
        }}
        title="Remove user?"
        description={
          removing
            ? `This will permanently delete ${displayName(removing.first_name, removing.last_name, removing.email)}. This action cannot be undone.`
            : 'This will permanently delete the user account. This action cannot be undone.'
        }
        confirmLabel="Remove"
        loadingLabel="Removing…"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          void handleRemove();
        }}
      />
    </div>
  );
}
