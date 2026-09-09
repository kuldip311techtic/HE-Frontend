import type { ReactNode } from 'react';
import { Eye } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/features/shared/DataTable';
import { RowActions } from '@/components/features/shared/RowActions';
import { displayName, formatBoolean, formatDateTime, humanize } from '@/lib/utils/format';
import type { PaginationMeta } from '@/types/api';
import type { AdminUserItem, RoleOption } from '@/types/user';

function roleLabel(role: string, roles: RoleOption[]): string {
  return roles.find((option) => option.value === role)?.label ?? humanize(role);
}

function initials(row: AdminUserItem): string {
  const label = row.name || displayName(row.first_name, row.last_name, row.email);
  return label
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface UsersTableProps {
  items: AdminUserItem[];
  roles: RoleOption[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  pagination?: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  leadingToolbar: ReactNode;
  trailingToolbar: ReactNode;
  emptyAction?: ReactNode;
  isOwnAccount: (row: AdminUserItem) => boolean;
  onView: (row: AdminUserItem) => void;
  onEdit: (row: AdminUserItem) => void;
  onRemove: (row: AdminUserItem) => void;
}

export function UsersTable({
  items,
  roles,
  loading,
  error,
  onRetry,
  pagination,
  onPageChange,
  onPageSizeChange,
  leadingToolbar,
  trailingToolbar,
  emptyAction,
  isOwnAccount,
  onView,
  onEdit,
  onRemove,
}: UsersTableProps) {
  const columns: DataTableColumn<AdminUserItem>[] = [
    { id: 'id', label: 'Id', accessor: (row) => row.id, sortable: false, defaultHidden: true },
    {
      id: 'name',
      label: 'Name',
      alwaysVisible: true,
      sortable: true,
      accessor: (row) => row.name || displayName(row.first_name, row.last_name, row.email),
      render: (row) => {
        const label = row.name || displayName(row.first_name, row.last_name, row.email);
        const own = isOwnAccount(row);
        return (
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials(row)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{label}</span>
            {own ? <Badge variant="secondary">You</Badge> : null}
          </div>
        );
      },
    },
    { id: 'first_name', label: 'First Name', accessor: (row) => row.first_name, sortable: true, defaultHidden: true },
    { id: 'last_name', label: 'Last Name', accessor: (row) => row.last_name, sortable: true, defaultHidden: true },
    { id: 'email', label: 'Email', accessor: (row) => row.email, sortable: true },
    {
      id: 'role',
      label: 'Role',
      accessor: (row) => row.role,
      sortable: true,
      render: (row) => roleLabel(row.role, roles),
    },
    {
      id: 'roles',
      label: 'Roles',
      accessor: (row) => (row.roles ?? []).join(', '),
      sortable: true,
      defaultHidden: true,
      render: (row) => (row.roles ?? []).map((value) => roleLabel(value, roles)).join(', ') || '—',
    },
    {
      id: 'description',
      label: 'Description',
      accessor: (row) => row.description,
      sortable: true,
      defaultHidden: true,
    },
    {
      id: 'is_active',
      label: 'Active',
      accessor: (row) => row.is_active,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatBoolean(row.is_active),
    },
    {
      id: 'is_super_admin',
      label: 'Super Admin',
      accessor: (row) => row.is_super_admin,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatBoolean(row.is_super_admin),
    },
    {
      id: 'is_self',
      label: 'Is Self',
      accessor: (row) => row.is_self,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatBoolean(row.is_self),
    },
    { id: 'org_id', label: 'Organization Id', accessor: (row) => row.org_id, sortable: true, defaultHidden: true },
    {
      id: 'last_sign_in_at',
      label: 'Last Sign In',
      accessor: (row) => row.last_sign_in_at,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatDateTime(row.last_sign_in_at),
    },
    {
      id: 'created_at',
      label: 'Created At',
      accessor: (row) => row.created_at,
      sortable: true,
      defaultHidden: true,
      render: (row) => formatDateTime(row.created_at),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      getRowId={(row) => row.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      emptyTitle="No users yet"
      emptyDescription="Add a user to get started."
      emptyAction={emptyAction}
      leadingToolbar={leadingToolbar}
      trailingToolbar={trailingToolbar}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      renderActions={(row) => {
        const own = isOwnAccount(row);
        return (
          <div className="inline-flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11"
              aria-label={`View ${row.email}`}
              title="View"
              onClick={() => onView(row)}
            >
              <Eye className="h-4 w-4" aria-hidden />
            </Button>
            <RowActions
              items={[
                { label: 'View', onSelect: () => onView(row) },
                { label: 'Edit', onSelect: () => onEdit(row) },
                {
                  label: 'Remove',
                  onSelect: () => onRemove(row),
                  destructive: true,
                  disabled: own,
                  disabledReason: 'You cannot remove your own account',
                },
              ]}
            />
          </div>
        );
      }}
    />
  );
}
