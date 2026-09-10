import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnVisibilityMenu, type ColumnOption } from '@/components/features/admin/ColumnVisibilityMenu';
import { NativeSelect } from '@/components/features/admin/NativeSelect';
import { ResourcePagination } from '@/components/features/admin/ResourcePagination';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
import { SortableHeader } from '@/components/features/admin/SortableHeader';
import { UserFormDialog, type UserFormValues } from '@/components/features/admin/UserFormDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useListQueryState } from '@/hooks/useListQueryState';
import { useUsers } from '@/hooks/useUsers';
import { getApiErrorMessage, getApiFieldErrors, getDuplicateEmailMessage } from '@/lib/api';
import { displayText, formatDateTime, formatUserRole, SEARCH_DEBOUNCE_MS } from '@/lib/format';
import { nextSortState, sortCollection, type SortState } from '@/lib/sort';
import type { AdminUserItem, UserRole } from '@/types/api';

const COLUMN_OPTIONS: ColumnOption[] = [
  { key: 'name', label: 'Name', alwaysVisible: true },
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'org_id', label: 'Organization Id' },
  { key: 'is_active', label: 'Status' },
  { key: 'is_super_admin', label: 'Super Admin' },
  { key: 'last_sign_in_at', label: 'Last Sign In' },
  { key: 'created_at', label: 'Created At' },
  { key: 'description', label: 'Description' },
];

const DEFAULT_VISIBLE_KEYS = [
  'name',
  'email',
  'role',
  'is_active',
  'last_sign_in_at',
  'created_at',
];

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

function renderUserCell(row: AdminUserItem, key: string): ReactNode {
  switch (key) {
    case 'name':
      return displayText(row.name);
    case 'first_name':
      return displayText(row.first_name);
    case 'last_name':
      return displayText(row.last_name);
    case 'email':
      return displayText(row.email);
    case 'role':
      return <Badge variant={row.role === 'coach' || row.role === 'player' ? 'default' : 'secondary'}>{formatUserRole(row.role)}</Badge>;
    case 'org_id':
      return displayText(row.org_id);
    case 'is_active':
      return <Badge variant={row.is_active ? 'default' : 'secondary'}>{row.is_active ? 'Active' : 'Inactive'}</Badge>;
    case 'is_super_admin':
      return row.is_super_admin ? 'Yes' : 'No';
    case 'last_sign_in_at':
      return formatDateTime(row.last_sign_in_at);
    case 'created_at':
      return formatDateTime(row.created_at);
    case 'description':
      return displayText(row.description);
    default:
      return '—';
  }
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
  const [visibleKeys, setVisibleKeys] = useState(DEFAULT_VISIBLE_KEYS);
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

  const visibleColumns = COLUMN_OPTIONS.filter((column) => visibleKeys.includes(column.key));

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

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage coaches, players, and other platform users." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <ColumnVisibilityMenu
            columns={COLUMN_OPTIONS}
            visibleKeys={visibleKeys}
            onToggle={(key) =>
              setVisibleKeys((current) => {
                const column = COLUMN_OPTIONS.find((item) => item.key === key);
                if (column?.alwaysVisible) return current;
                return current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
              })
            }
          />
          <Button type="button" onClick={openCreate}>
            Add User
          </Button>
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading Users…" /> : null}
      {!isLoading && error ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button type="button" variant="outline" onClick={() => void reload()}>
            Retry
          </Button>
        </div>
      ) : null}
      {!isLoading && !error && items.length === 0 ? (
        <EmptyState
          icon={<Users className="h-6 w-6" aria-hidden="true" />}
          title="No Users Yet"
          description="Use Add User in the toolbar to create the first user."
        />
      ) : null}
      {!isLoading && !error && items.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <SortableHeader
                    key={column.key}
                    label={column.label}
                    columnKey={column.key}
                    sort={sort}
                    onSort={(key) => setSort(nextSortState(sort, key))}
                  />
                ))}
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((row) => (
                <TableRow key={row.id}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key} className={column.key === 'name' ? 'font-medium' : undefined}>
                      {renderUserCell(row, column.key)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ResourcePagination
            pagination={pagination}
            onPageChange={(nextPage) => setQuery({ page: nextPage })}
            onPageSizeChange={(nextSize) => setQuery({ page: 1, page_size: nextSize })}
          />
        </>
      ) : null}

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
