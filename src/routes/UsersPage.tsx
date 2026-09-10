import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, type DataTableColumn } from '@/components/features/admin/DataTable';
import { NativeSelect } from '@/components/features/admin/NativeSelect';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
import { UserFormDialog, type UserFormValues } from '@/components/features/admin/UserFormDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { useListQueryState } from '@/hooks/useListQueryState';
import { useUsers } from '@/hooks/useUsers';
import { getApiErrorMessage, getApiFieldErrors, getDuplicateEmailMessage } from '@/lib/api';
import { displayText, formatDateTime, formatUserRole, SEARCH_DEBOUNCE_MS } from '@/lib/format';
import { sortCollection, type SortState } from '@/lib/sort';
import type { AdminUserItem, UserRole } from '@/types/api';

const COLUMNS: DataTableColumn<AdminUserItem>[] = [
  { key: 'name', label: 'Name', alwaysVisible: true, className: 'font-medium', render: (row) => displayText(row.name) },
  { key: 'first_name', label: 'First Name', render: (row) => displayText(row.first_name) },
  { key: 'last_name', label: 'Last Name', render: (row) => displayText(row.last_name) },
  { key: 'email', label: 'Email', render: (row) => displayText(row.email) },
  {
    key: 'role',
    label: 'Role',
    render: (row) => (
      <Badge variant={row.role === 'coach' || row.role === 'player' ? 'default' : 'secondary'}>
        {formatUserRole(row.role)}
      </Badge>
    ),
  },
  { key: 'org_id', label: 'Organization Id', render: (row) => displayText(row.org_id) },
  {
    key: 'is_active',
    label: 'Status',
    render: (row) => <Badge variant={row.is_active ? 'default' : 'secondary'}>{row.is_active ? 'Active' : 'Inactive'}</Badge>,
  },
  { key: 'is_super_admin', label: 'Super Admin', render: (row) => (row.is_super_admin ? 'Yes' : 'No') },
  { key: 'last_sign_in_at', label: 'Last Sign In', render: (row) => formatDateTime(row.last_sign_in_at) },
  { key: 'created_at', label: 'Created At', render: (row) => formatDateTime(row.created_at) },
  { key: 'description', label: 'Description', render: (row) => displayText(row.description) },
];

const DEFAULT_VISIBLE_KEYS = ['name', 'email', 'role', 'is_active', 'last_sign_in_at', 'created_at'];

const FALLBACK_ROLE_FILTERS = [
  { value: '', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'org_admin', label: 'Organization Admin' },
  { value: 'coach', label: 'Coach' },
  { value: 'player', label: 'Player' },
];

function userValue(row: AdminUserItem, key: string): unknown {
  return row[key as keyof AdminUserItem];
}

export function UsersPage() {
  const { page, pageSize, search, role, setQuery } = useListQueryState();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const { items, pagination, roles, isLoading, error, reload, create, update, remove } = useUsers(
    page,
    pageSize,
    debouncedSearch,
    role,
  );

  const [sort, setSort] = useState<SortState | null>(null);
  const { visibleKeys, toggleColumn } = useColumnVisibility(COLUMNS, DEFAULT_VISIBLE_KEYS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserItem | null>(null);
  const [viewing, setViewing] = useState<AdminUserItem | null>(null);
  const [removing, setRemoving] = useState<AdminUserItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (debouncedSearch === search) return;
    setQuery({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, search, setQuery]);

  const sortedItems = useMemo(() => sortCollection(items, sort, userValue), [items, sort]);

  const roleFilterOptions = useMemo(() => {
    if (roles.length === 0) return FALLBACK_ROLE_FILTERS;
    return [
      { value: '', label: 'All Roles' },
      ...roles.map((option) => ({
        value: option.value,
        label: option.label || formatUserRole(option.value),
      })),
    ];
  }, [roles]);

  const handleSave = async (values: UserFormValues) => {
    setIsSaving(true);
    setFormError(null);
    setFieldErrors({});
    try {
      if (editing) {
        const body = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role: values.role as UserRole,
          password: values.password.trim() ? values.password : undefined,
        };
        const response = await update(editing.id, body);
        toast.success(response.message || 'User Updated Successfully.');
      } else {
        const response = await create({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          role: values.role as UserRole,
        });
        toast.success(response.message || 'User Created Successfully.');
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      const fields = getApiFieldErrors(err);
      const duplicate = getDuplicateEmailMessage(err);
      if (duplicate && !fields.email) {
        fields.email = duplicate;
      }
      const message = duplicate || getApiErrorMessage(err, 'Unable to save user. Please try again.');
      setFieldErrors(fields);
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!removing || removing.is_self) return;
    setIsDeleting(true);
    try {
      const response = await remove(removing.id);
      toast.success(response.message || 'User Removed Successfully.');
      setRemoving(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to remove user. Please try again.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const filters: ReactNode = (
    <>
      <Input
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search Users"
        aria-label="Search Users"
        className="lg:max-w-sm"
      />
      <NativeSelect
        aria-label="Filter By Role"
        className="lg:w-56"
        value={role}
        onChange={(event) => setQuery({ role: event.target.value, page: 1 })}
        options={roleFilterOptions}
      />
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage coaches, players, and other platform users." />

      <DataTable
        columns={COLUMNS}
        rows={sortedItems}
        getRowId={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        visibleKeys={visibleKeys}
        onToggleColumn={toggleColumn}
        filters={filters}
        primaryAction={
          <Button type="button" onClick={openCreate}>
            Add User
          </Button>
        }
        pagination={pagination}
        onPageChange={(nextPage) => setQuery({ page: nextPage })}
        onPageSizeChange={(nextSize) => setQuery({ page: 1, page_size: nextSize })}
        isLoading={isLoading}
        loadingLabel="Loading Users…"
        error={error}
        onRetry={() => void reload()}
        emptyIcon={<Users className="h-6 w-6" aria-hidden="true" />}
        emptyTitle="No Users Yet"
        emptyDescription="Use Add User in the toolbar to create the first user."
        renderRowActions={(row) => (
          <RowActionsMenu
            label={`${displayText(row.name)} Actions`}
            actions={[
              { label: 'View', onSelect: () => setViewing(row) },
              {
                label: 'Edit',
                onSelect: () => {
                  setEditing(row);
                  setFormError(null);
                  setFieldErrors({});
                  setFormOpen(true);
                },
              },
              {
                label: 'Remove',
                destructive: true,
                disabled: row.is_self,
                title: row.is_self ? 'You cannot remove your own account' : undefined,
                onSelect: () => setRemoving(row),
              },
            ]}
          />
        )}
      />

      <UserFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditing(null);
            setFormError(null);
            setFieldErrors({});
          }
        }}
        user={editing}
        roles={roles}
        isSubmitting={isSaving}
        error={formError}
        fieldErrors={fieldErrors}
        onSubmit={handleSave}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Read-only details for this user.</DialogDescription>
          </DialogHeader>
          {viewing ? (
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd>{displayText(viewing.name)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">First Name</dt>
                <dd>{displayText(viewing.first_name)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Last Name</dt>
                <dd>{displayText(viewing.last_name)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{displayText(viewing.email)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Role</dt>
                <dd>{formatUserRole(viewing.role)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Organization Id</dt>
                <dd>{displayText(viewing.org_id)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>{viewing.is_active ? 'Active' : 'Inactive'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Super Admin</dt>
                <dd>{viewing.is_super_admin ? 'Yes' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Last Sign In</dt>
                <dd>{formatDateTime(viewing.last_sign_in_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created At</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Description</dt>
                <dd>{displayText(viewing.description)}</dd>
              </div>
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(removing) && !removing?.is_self}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove User?"
        description="This will permanently remove the user account. This action cannot be undone."
        confirmLabel="Remove"
        loadingLabel="Removing…"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleRemove()}
      />
    </div>
  );
}
