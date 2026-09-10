import { useEffect, useMemo, useState } from 'react';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { SubscriptionDetailDialog } from '@/components/features/subscriptions/SubscriptionDetailDialog';
import { SubscriptionFormDialog } from '@/components/features/subscriptions/SubscriptionFormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { Badge } from '@/components/ui/badge';
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
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { useSortablePage } from '@/hooks/useSortablePage';
import { getApiErrorMessage } from '@/lib/api';
import { cn, titleCase } from '@/lib/utils';
import type { SubscriptionPlan } from '@/types/api';

const SEARCH_DEBOUNCE_MS = 300;

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function SubscriptionsPage() {
  const { items, isLoading, error, refetch, create, update, remove } = useSubscriptions();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null);
  const [viewTarget, setViewTarget] = useState<SubscriptionPlan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SubscriptionPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const hasStatus = items.some((item) => item.status);

  const statusOptions = useMemo(() => {
    const values = new Set<string>();
    for (const item of items) {
      if (item.status) {
        values.add(item.status.toLowerCase());
      }
    }
    return Array.from(values).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== 'all' && item.status?.toLowerCase() !== statusFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        item.name.toLowerCase().includes(query) ||
        item.billing_cycle.toLowerCase().includes(query) ||
        String(item.price).includes(query) ||
        item.status?.toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery, statusFilter]);

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

  const openEdit = (plan: SubscriptionPlan) => {
    setEditing(plan);
    setDialogOpen(true);
  };

  const handleSave = async (values: { name: string; price: number; billing_cycle: string }) => {
    try {
      if (editing) {
        await update(editing.id, values);
        toast.success('Subscription plan updated successfully.');
      } else {
        await create(values);
        toast.success('Subscription plan created successfully.');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to save subscription plan.'));
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success('Subscription plan removed successfully.');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Unable to remove subscription plan.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const deleteDescription =
    deleteTarget?.status?.toLowerCase() === 'active'
      ? 'This subscription plan is currently active. Removing it may affect organizations using this plan. This action cannot be undone.'
      : 'This will permanently remove the subscription plan. This action cannot be undone.';

  const showEmptyFiltered = !isLoading && !error && items.length > 0 && filteredItems.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Manage subscription plans available to organizations."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            type="search"
            placeholder="Search Subscription Plans"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="sm:max-w-xs"
            aria-label="Search Subscription Plans"
          />
          {hasStatus ? (
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className={cn(
                'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto',
              )}
              aria-label="Filter By Status"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {titleCase(status)}
                </option>
              ))}
            </select>
          ) : null}
        </div>
        <Button type="button" onClick={openCreate}>
          Add Subscription Plan
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
        <LoadingState label="Loading subscription plans…" />
      ) : items.length === 0 && !error ? (
        <EmptyState
          title="No Subscription Plans Yet"
          description="Use Add Subscription Plan in the toolbar to create the first plan."
        />
      ) : showEmptyFiltered ? (
        <EmptyState
          title="No Matching Plans"
          description="Try adjusting your search or status filter."
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  label="Subscription Name"
                  sortKey="name"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHead
                  label="Price"
                  sortKey="price"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableTableHead
                  label="Billing Cycle"
                  sortKey="billing_cycle"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                {hasStatus ? (
                  <SortableTableHead
                    label="Status"
                    sortKey="status"
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                ) : null}
                <TableHead scope="col">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((row) => {
                const plan = row as unknown as SubscriptionPlan;
                return (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.name}</TableCell>
                    <TableCell>{priceFormatter.format(plan.price)}</TableCell>
                    <TableCell>{titleCase(plan.billing_cycle)}</TableCell>
                    {hasStatus ? (
                      <TableCell>
                        {plan.status ? (
                          <Badge variant="secondary">{titleCase(plan.status)}</Badge>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${plan.name}`}
                          >
                            <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setViewTarget(plan);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(plan)}>
                            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteTarget(plan)}
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

      <SubscriptionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subscription={editing}
        onSubmit={handleSave}
      />

      <SubscriptionDetailDialog
        open={Boolean(viewTarget)}
        onOpenChange={(open) => !open && setViewTarget(null)}
        subscription={viewTarget}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove Subscription Plan?"
        description={deleteDescription}
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
