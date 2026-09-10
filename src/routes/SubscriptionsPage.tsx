import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SubscriptionDetailDialog } from '@/components/features/subscriptions/SubscriptionDetailDialog';
import { SubscriptionFormDialog } from '@/components/features/subscriptions/SubscriptionFormDialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import type { DataTableColumn } from '@/components/shared/DataTable';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useColumnVisibility } from '@/hooks/useColumnVisibility';
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

const SUBSCRIPTION_COLUMNS: DataTableColumn<SubscriptionPlan>[] = [
  {
    id: 'name',
    label: 'Subscription Name',
    sortKey: 'name',
    alwaysVisible: true,
    render: (plan) => plan.name,
  },
  {
    id: 'price',
    label: 'Price',
    sortKey: 'price',
    alwaysVisible: true,
    render: (plan) => priceFormatter.format(plan.price),
  },
  {
    id: 'billing_cycle',
    label: 'Billing Cycle',
    sortKey: 'billing_cycle',
    alwaysVisible: true,
    render: (plan) => titleCase(plan.billing_cycle),
  },
  {
    id: 'status',
    label: 'Status',
    sortKey: 'status',
    defaultVisible: true,
    render: (plan) =>
      plan.status ? (
        <Badge variant="secondary">{titleCase(plan.status)}</Badge>
      ) : (
        '—'
      ),
  },
];

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

  const { visibility, toggleColumn, toggleableColumns } = useColumnVisibility(SUBSCRIPTION_COLUMNS);

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

  const { paginatedItems, totalItems, sortKey, sortDirection, handleSort } = useSortablePage(
    filteredItems,
    page,
    pageSize,
  );

  const subscriptionColumns = useMemo(
    () =>
      hasStatus
        ? SUBSCRIPTION_COLUMNS
        : SUBSCRIPTION_COLUMNS.filter((column) => column.id !== 'status'),
    [hasStatus],
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

      <DataTable
        columns={subscriptionColumns}
        rows={paginatedItems}
        getRowKey={(plan) => plan.id}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        columnVisibility={visibility}
        onColumnVisibilityChange={toggleColumn}
        toggleableColumns={hasStatus ? toggleableColumns : []}
        showColumnsControl={hasStatus}
        isLoading={isLoading}
        loadingLabel="Loading subscription plans…"
        error={error}
        onRetry={() => void refetch()}
        isEmpty={!isLoading && !error && items.length === 0}
        emptyTitle="No Subscription Plans Yet"
        emptyDescription="Use Add Subscription Plan in the toolbar to create the first plan."
        isEmptyFiltered={showEmptyFiltered}
        filteredEmptyTitle="No Matching Plans"
        filteredEmptyDescription="Try adjusting your search or status filter."
        toolbar={
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
        }
        renderActions={(plan) => (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setViewTarget(plan)}>
              View
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => openEdit(plan)}>
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteTarget(plan)}
            >
              Remove
            </Button>
          </div>
        )}
        pagination={
          totalItems > 0 ? (
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
          ) : null
        }
      />

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
