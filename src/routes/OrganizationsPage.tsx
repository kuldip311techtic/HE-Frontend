import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, type DataTableColumn } from '@/components/features/admin/DataTable';
import { OrganizationFormDialog, type OrganizationFormValues } from '@/components/features/admin/OrganizationFormDialog';
import { RowActionsMenu } from '@/components/features/admin/RowActionsMenu';
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
import { useOrganizations } from '@/hooks/useOrganizations';
import { getApiErrorMessage, getApiFieldErrors } from '@/lib/api';
import { displayText, formatDateTime, SEARCH_DEBOUNCE_MS } from '@/lib/format';
import { sortCollection, type SortState } from '@/lib/sort';
import type { OrganizationItem } from '@/types/api';

const COLUMNS: DataTableColumn<OrganizationItem>[] = [
  {
    key: 'name',
    label: 'Organization Name',
    alwaysVisible: true,
    className: 'font-medium',
    render: (row) => displayText(row.name || row.organization),
  },
  {
    key: 'contact_email',
    label: 'Contact Email',
    render: (row) => displayText(row.contact_email || row.email),
  },
  {
    key: 'phone_number',
    label: 'Phone Number',
    render: (row) => displayText(row.phone_number || row.phone),
  },
  { key: 'address', label: 'Address', render: (row) => displayText(row.address) },
  { key: 'description', label: 'Description', render: (row) => displayText(row.description) },
  { key: 'join_code', label: 'Join Code', render: (row) => displayText(row.join_code) },
  { key: 'created_at', label: 'Created At', render: (row) => formatDateTime(row.created_at) },
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
  const { visibleKeys, toggleColumn } = useColumnVisibility(COLUMNS, DEFAULT_VISIBLE_KEYS);
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

      <DataTable
        columns={COLUMNS}
        rows={sortedItems}
        getRowId={(row) => row.id}
        sort={sort}
        onSortChange={setSort}
        visibleKeys={visibleKeys}
        onToggleColumn={toggleColumn}
        filters={
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search Organizations"
            aria-label="Search Organizations"
            className="lg:max-w-sm"
          />
        }
        primaryAction={
          <Button type="button" onClick={openCreate}>
            Add Organization
          </Button>
        }
        pagination={pagination}
        onPageChange={(nextPage) => setQuery({ page: nextPage })}
        onPageSizeChange={(nextSize) => setQuery({ page: 1, page_size: nextSize })}
        isLoading={isLoading}
        loadingLabel="Loading Organizations…"
        error={error}
        onRetry={() => void reload()}
        emptyIcon={<Building2 className="h-6 w-6" aria-hidden="true" />}
        emptyTitle="No Organizations Yet"
        emptyDescription="Use Add Organization in the toolbar to create the first organization."
        renderRowActions={(row) => (
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
        )}
      />

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
