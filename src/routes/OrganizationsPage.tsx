import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { OrganizationFormDialog } from '@/components/features/organizations/OrganizationFormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { DataTableColumn } from '@/components/shared/DataTable';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useSortableItems } from '@/hooks/useSortableItems';
import { getApiErrorMessage } from '@/lib/api';
import type { Organization } from '@/types/api';

const SEARCH_DEBOUNCE_MS = 300;

const ORGANIZATION_COLUMNS: DataTableColumn<Organization>[] = [
  {
    id: 'name',
    label: 'Organization Name',
    sortKey: 'name',
    alwaysVisible: true,
    render: (org) => org.name,
  },
  {
    id: 'contact_email',
    label: 'Contact Email',
    sortKey: 'contact_email',
    alwaysVisible: true,
    render: (org) => org.contact_email,
  },
  {
    id: 'phone_number',
    label: 'Phone Number',
    sortKey: 'phone_number',
    alwaysVisible: true,
    render: (org) => org.phone_number,
  },
  {
    id: 'address',
    label: 'Address',
    sortKey: 'address',
    defaultVisible: false,
    render: (org) => org.address || '—',
  },
  {
    id: 'join_code',
    label: 'Join Code',
    sortKey: 'join_code',
    defaultVisible: false,
    render: (org) => org.join_code || '—',
  },
];

export function OrganizationsPage() {
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
  } = useOrganizations();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { visibility, toggleColumn, toggleableColumns } = useColumnVisibility(ORGANIZATION_COLUMNS);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, setPage]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      return items;
    }
    return items.filter(
      (org) =>
        org.name.toLowerCase().includes(query) ||
        org.contact_email.toLowerCase().includes(query) ||
        org.phone_number.toLowerCase().includes(query) ||
        org.address.toLowerCase().includes(query) ||
        (org.join_code?.toLowerCase().includes(query) ?? false),
    );
  }, [items, searchQuery]);

  const { sortedItems, sortKey, sortDirection, handleSort } = useSortableItems(filteredItems);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (org: Organization) => {
    setEditing(org);
    setDialogOpen(true);
  };

  const handleSave = async (values: {
    name: string;
    contact_email: string;
    phone_number: string;
    address: string;
  }) => {
    try {
      if (editing) {
        await update(editing.id, values);
        toast.success('Organization updated successfully.');
      } else {
        await create(values);
        toast.success('Organization created successfully.');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to save organization.'));
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success('Organization removed successfully.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to remove organization.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const showEmptyFiltered = !isLoading && !error && items.length > 0 && filteredItems.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizations"
        description="Manage organization accounts across the platform."
      />

      <DataTable
        columns={ORGANIZATION_COLUMNS}
        rows={sortedItems}
        getRowKey={(org) => org.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        sortScopeNote="Search and sorting apply to the current page only. Page size is controlled by the server."
        columnVisibility={visibility}
        onColumnVisibilityChange={toggleColumn}
        toggleableColumns={toggleableColumns}
        isLoading={isLoading}
        loadingLabel="Loading organizations…"
        error={error}
        onRetry={() => void refetch()}
        isEmpty={!isLoading && !error && total === 0}
        emptyTitle="No Organizations Yet"
        emptyDescription="Use Add Organization in the toolbar to create the first organization."
        isEmptyFiltered={showEmptyFiltered}
        filteredEmptyTitle="No Matching Organizations"
        filteredEmptyDescription="Try adjusting your search terms."
        toolbar={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              type="search"
              placeholder="Search Organizations"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="sm:max-w-xs"
              aria-label="Search Organizations"
            />
            <Button type="button" onClick={openCreate}>
              Add Organization
            </Button>
          </div>
        }
        renderActions={(org) => (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => openEdit(org)}>
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteTarget(org)}
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

      <OrganizationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        organization={editing}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove Organization?"
        description="This will permanently remove the organization and its associated data. This action cannot be undone."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
