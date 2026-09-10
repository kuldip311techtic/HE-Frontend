import { useEffect, useMemo, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { OrganizationFormDialog } from '@/components/features/organizations/OrganizationFormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useSortablePage } from '@/hooks/useSortablePage';
import { getApiErrorMessage } from '@/lib/api';
import type { Organization } from '@/types/api';

const SEARCH_DEBOUNCE_MS = 300;

export function OrganizationsPage() {
  const { items, isLoading, error, refetch, create, update, remove } = useOrganizations();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Organization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

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
        org.address.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  const tableItems = useMemo(
    () => filteredItems.map((item) => ({ ...item }) as Record<string, unknown>),
    [filteredItems],
  );
  const { paginatedItems, totalItems, sortKey, sortDirection, handleSort } = useSortablePage(
    tableItems,
    page,
    pageSize,
  );

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

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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

      {error ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button type="button" variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState label="Loading organizations…" />
      ) : items.length === 0 && !error ? (
        <EmptyState
          title="No Organizations Yet"
          description="Use Add Organization in the toolbar to create the first organization."
        />
      ) : showEmptyFiltered ? (
        <EmptyState
          title="No Matching Organizations"
          description="Try adjusting your search terms."
        />
      ) : (
        <div className="space-y-4">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    label="Organization Name"
                    sortKey="name"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Contact Email"
                    sortKey="contact_email"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Phone Number"
                    sortKey="phone_number"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                  <TableHead scope="col">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((row) => {
                  const org = row as unknown as Organization;
                  return (
                    <TableRow key={org.id}>
                      <TableCell>{org.name}</TableCell>
                      <TableCell>{org.contact_email}</TableCell>
                      <TableCell>{org.phone_number}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${org.name}`}
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(org)}>
                              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(org)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <PaginationControls
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      )}

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
