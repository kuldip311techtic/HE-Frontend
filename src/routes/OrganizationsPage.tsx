import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnVisibilityMenu, type ColumnOption } from '@/components/features/admin/ColumnVisibilityMenu';
import { OrganizationFormDialog, type OrganizationFormValues } from '@/components/features/admin/OrganizationFormDialog';
import { ResourcePagination } from '@/components/features/admin/ResourcePagination';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
import { SortableHeader } from '@/components/features/admin/SortableHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useListQueryState } from '@/hooks/useListQueryState';
import { useOrganizations } from '@/hooks/useOrganizations';
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api';
import { displayText, formatDateTime, SEARCH_DEBOUNCE_MS } from '@/lib/format';
import { nextSortState, sortCollection, type SortState } from '@/lib/sort';
import type { OrganizationItem } from '@/types/api';

const COLUMN_OPTIONS: ColumnOption[] = [
  { key: 'name', label: 'Organization Name', alwaysVisible: true },
  { key: 'contact_email', label: 'Contact Email' },
  { key: 'phone_number', label: 'Phone Number' },
  { key: 'address', label: 'Address' },
  { key: 'description', label: 'Description' },
  { key: 'join_code', label: 'Join Code' },
  { key: 'created_at', label: 'Created At' },
];

const DEFAULT_VISIBLE_KEYS = ['name', 'contact_email', 'phone_number'];

function orgValue(row: OrganizationItem, key: string): unknown {
  switch (key) {
    case 'name':
      return row.name || row.organization;
    case 'contact_email':
      return row.contact_email || row.email;
    case 'phone_number':
      return row.phone_number || row.phone;
    default:
      return row[key as keyof OrganizationItem];
  }
}

function renderOrgCell(row: OrganizationItem, key: string) {
  switch (key) {
    case 'name':
      return displayText(row.name || row.organization);
    case 'contact_email':
      return displayText(row.contact_email || row.email);
    case 'phone_number':
      return displayText(row.phone_number || row.phone);
    case 'address':
      return displayText(row.address);
    case 'description':
      return displayText(row.description);
    case 'join_code':
      return displayText(row.join_code);
    case 'created_at':
      return formatDateTime(row.created_at);
    default:
      return '—';
  }
}

export function OrganizationsPage() {
  const { page, pageSize, search, setQuery } = useListQueryState();
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const { items, pagination, isLoading, error, reload, create, update, remove } = useOrganizations(
    page,
    pageSize,
    debouncedSearch,
  );

  const [sort, setSort] = useState<SortState | null>(null);
  const [visibleKeys, setVisibleKeys] = useState(DEFAULT_VISIBLE_KEYS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<OrganizationItem | null>(null);
  const [viewing, setViewing] = useState<OrganizationItem | null>(null);
  const [removing, setRemoving] = useState<OrganizationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (debouncedSearch === search) return;
    setQuery({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, search, setQuery]);

  const sortedItems = useMemo(() => sortCollection(items, sort, orgValue), [items, sort]);
  const visibleColumns = COLUMN_OPTIONS.filter(
    (column) => column.alwaysVisible || visibleKeys.includes(column.key),
  );

  const openCreate = () => {
    setEditing(null);
    setFormError(null);
    setFieldErrors({});
    setFormOpen(true);
  };

  const handleSave = async (values: OrganizationFormValues) => {
    setIsSaving(true);
    setFormError(null);
    setFieldErrors({});
    try {
      if (editing) {
        const response = await update(editing.id, values);
        toast.success(response.message || 'Organization Updated Successfully.');
      } else {
        const response = await create(values);
        toast.success(response.message || 'Organization Created Successfully.');
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      const fields = getApiFieldErrors(err);
      const message = getApiErrorMessage(err, 'Unable to save organization. Please try again.');
      setFieldErrors(fields);
      setFormError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!removing) return;
    setIsDeleting(true);
    try {
      const response = await remove(removing.id);
      toast.success(response.message || 'Organization Removed Successfully.');
      setRemoving(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to remove organization. Please try again.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Organizations" description="Manage organizations on the platform." />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search Organizations"
          aria-label="Search Organizations"
          className="lg:max-w-sm"
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
            Add Organization
          </Button>
        </div>
      </div>

      {isLoading ? <LoadingState label="Loading Organizations…" /> : null}
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
          icon={<Building2 className="h-6 w-6" aria-hidden="true" />}
          title="No Organizations Yet"
          description="Use Add Organization in the toolbar to create the first organization."
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
                    onSort={(nextKey) => setSort(nextSortState(sort, nextKey))}
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
                      {renderOrgCell(row, column.key)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <RowActionsMenu
                      label={`${displayText(row.name || row.organization)} Actions`}
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
                        { label: 'Remove', destructive: true, onSelect: () => setRemoving(row) },
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

      <OrganizationFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setEditing(null);
            setFormError(null);
            setFieldErrors({});
          }
        }}
        organization={editing}
        isSubmitting={isSaving}
        error={formError}
        fieldErrors={fieldErrors}
        onSubmit={handleSave}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Organization Details</DialogTitle>
            <DialogDescription>Read-only details for this organization.</DialogDescription>
          </DialogHeader>
          {viewing ? (
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Organization Name</dt>
                <dd>{displayText(viewing.name || viewing.organization)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Contact Email</dt>
                <dd>{displayText(viewing.contact_email || viewing.email)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone Number</dt>
                <dd>{displayText(viewing.phone_number || viewing.phone)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Address</dt>
                <dd>{displayText(viewing.address)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Description</dt>
                <dd>{displayText(viewing.description)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Join Code</dt>
                <dd>{displayText(viewing.join_code)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created At</dt>
                <dd>{formatDateTime(viewing.created_at)}</dd>
              </div>
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove Organization?"
        description="This will permanently remove the organization and its associated data. This action cannot be undone."
        confirmLabel="Remove"
        loadingLabel="Removing…"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleRemove()}
      />
    </div>
  );
}
