import * as React from 'react';
import { Columns3, Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { AdminDataTable } from '@/components/features/admin/AdminDataTable';
import { ConfirmDeleteDialog } from '@/components/features/admin/ConfirmDeleteDialog';
import { SortableTableHead } from '@/components/features/admin/SortableTableHead';
import { useDebounce } from '@/hooks/useDebounce';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useDeleteSubscription } from '@/hooks/useSubscriptions';
import { cycleSort, sortByColumn, type SortState } from '@/lib/utils/sort';
import { formatCurrency, humanizeEnum } from '@/lib/utils/format';
import type { SubscriptionPlan } from '@/types/subscription';

type SortColumn = 'name' | 'price' | 'billing_cycle' | 'description' | 'status';

type ColumnKey = SortColumn | 'id';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { key: 'id', label: 'Id', sortable: false, defaultVisible: false },
  { key: 'name', label: 'Name', sortable: true, defaultVisible: true, alwaysVisible: true },
  { key: 'price', label: 'Price', sortable: true, defaultVisible: true },
  { key: 'billing_cycle', label: 'Billing cycle', sortable: true, defaultVisible: true },
  { key: 'description', label: 'Description', sortable: true, defaultVisible: false },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: true },
];

const ALL_STATUS_VALUE = 'all';

function filterSubscriptions(
  items: SubscriptionPlan[],
  search: string,
  statusFilter: string,
): SubscriptionPlan[] {
  let result = items;

  if (statusFilter !== ALL_STATUS_VALUE) {
    result = result.filter(
      (item) => (item.status ?? '').toLowerCase() === statusFilter.toLowerCase(),
    );
  }

  const query = search.trim().toLowerCase();
  if (query) {
    result = result.filter((item) => {
      const haystack = [
        item.name,
        item.billing_cycle,
        item.description ?? '',
        item.status ?? '',
        String(item.price),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return result;
}

interface SubscriptionsTableProps {
  items: SubscriptionPlan[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onAdd: () => void;
  onEdit: (subscription: SubscriptionPlan) => void;
  onView: (subscription: SubscriptionPlan) => void;
  emptyAction?: React.ReactNode;
}

export function SubscriptionsTable({
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onAdd,
  onEdit,
  onView,
  emptyAction,
}: SubscriptionsTableProps) {
  const deleteMutation = useDeleteSubscription();
  const [deleteTarget, setDeleteTarget] = React.useState<SubscriptionPlan | null>(null);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState(ALL_STATUS_VALUE);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const debouncedSearch = useDebounce(search, 300);
  const [sort, setSort] = React.useState<SortState<SortColumn>>({
    column: null,
    direction: 'asc',
  });
  const [visibleColumns, setVisibleColumns] = React.useState<Record<ColumnKey, boolean>>(() =>
    Object.fromEntries(COLUMNS.map((col) => [col.key, col.defaultVisible])) as Record<
      ColumnKey,
      boolean
    >,
  );

  const statusOptions = React.useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => item.status).filter((value): value is string => Boolean(value))),
    ).sort((a, b) => a.localeCompare(b));

    return [
      { value: ALL_STATUS_VALUE, label: 'All statuses' },
      ...unique.map((status) => ({ value: status, label: humanizeEnum(status) })),
    ];
  }, [items]);

  const filteredItems = React.useMemo(
    () => filterSubscriptions(items, debouncedSearch, statusFilter),
    [items, debouncedSearch, statusFilter],
  );

  const sortedItems = React.useMemo(
    () => sortByColumn(filteredItems, sort.column, sort.direction),
    [filteredItems, sort],
  );

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, pageSize, sort.column, sort.direction]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, page, pageSize]);

  const handleSort = (column: string) => {
    setSort((current) => cycleSort(current, column as SortColumn));
  };

  const toggleColumn = (key: ColumnKey, checked: boolean) => {
    const config = COLUMNS.find((col) => col.key === key);
    if (config?.alwaysVisible) return;
    setVisibleColumns((prev) => ({ ...prev, [key]: checked }));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Subscription plan removed successfully.');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to remove subscription plan. Please try again.'));
    }
  };

  const renderCell = (row: SubscriptionPlan, key: ColumnKey) => {
    switch (key) {
      case 'id':
        return row.id;
      case 'name':
        return <span className="font-medium">{row.name}</span>;
      case 'price':
        return formatCurrency(row.price);
      case 'billing_cycle':
        return humanizeEnum(row.billing_cycle);
      case 'description':
        return row.description || '—';
      case 'status':
        return row.status ? (
          <Badge variant="secondary">{humanizeEnum(row.status)}</Badge>
        ) : (
          '—'
        );
      default:
        return '—';
    }
  };

  const visibleColumnConfigs = COLUMNS.filter((col) => visibleColumns[col.key]);
  const isDatasetEmpty = !isLoading && !isError && items.length === 0;
  const isFilteredEmpty = !isLoading && !isError && items.length > 0 && filteredItems.length === 0;

  return (
    <>
      <AdminDataTable
        aria-label="Subscription plans"
        isLoading={isLoading}
        isError={isError}
        isEmpty={isDatasetEmpty || isFilteredEmpty}
        errorMessage={errorMessage}
        onRetry={onRetry}
        emptyTitle={
          isFilteredEmpty ? 'No matching subscription plans' : 'No subscription plans yet'
        }
        emptyDescription={
          isFilteredEmpty
            ? 'Try adjusting your search or status filter.'
            : 'Add your first subscription plan to get started.'
        }
        emptyAction={isDatasetEmpty ? emptyAction : undefined}
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search plans…"
                aria-label="Search subscription plans"
                className="h-11 max-w-full border-[#0d1612] bg-[#0b1f12] sm:max-w-[280px]"
              />
              {statusOptions.length > 1 ? (
                <Select
                  aria-label="Filter by status"
                  className="h-11 w-full sm:w-[180px]"
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                />
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="h-11">
                    <Columns3 className="mr-2 h-4 w-4" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {COLUMNS.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={visibleColumns[col.key]}
                      disabled={col.alwaysVisible}
                      onCheckedChange={(checked) => toggleColumn(col.key, checked === true)}
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button type="button" variant="brand" onClick={onAdd} className="shrink-0">
              <Plus className="h-4 w-4" />
              Add subscription plan
            </Button>
          </div>
        }
        footer={
          sortedItems.length > 0 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={sortedItems.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              disabled={isLoading}
            />
          ) : null
        }
        header={
          <TableHeader>
            <TableRow>
              {visibleColumnConfigs.map((col) =>
                col.sortable ? (
                  <SortableTableHead
                    key={col.key}
                    label={col.label}
                    column={col.key}
                    activeColumn={sort.column}
                    direction={sort.direction}
                    onSort={handleSort}
                  />
                ) : (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ),
              )}
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        }
      >
        {paginatedItems.map((row) => (
          <TableRow key={row.id}>
            {visibleColumnConfigs.map((col) => (
              <TableCell key={col.key}>{renderCell(row, col.key)}</TableCell>
            ))}
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon" aria-label="Open actions menu">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(row)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(row)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteTarget(row)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </AdminDataTable>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remove subscription plan?"
        description={`This will permanently remove "${deleteTarget?.name ?? 'this plan'}". This action cannot be undone.`}
        warning={
          deleteTarget?.status === 'active'
            ? 'This plan is currently active. Removing it may affect existing subscriptions.'
            : undefined
        }
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}
