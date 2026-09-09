import * as React from 'react';
import { Columns3, Eye, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { SortableTableHead } from '@/components/features/admin/SortableTableHead';
import { useDebounce } from '@/hooks/useDebounce';
import { captureReturnFocus, setReturnFocus } from '@/lib/utils/captureReturnFocus';
import { cycleSort, compareValues, type SortState } from '@/lib/utils/sort';
import { formatDate, humanizeEnum } from '@/lib/utils/format';
import type { SupportRequest } from '@/types/support';

type SortColumn = 'user' | 'inquiry_subject' | 'request_date' | 'status';

type ColumnKey = SortColumn | 'request_id';

interface ColumnConfig {
  key: ColumnKey;
  label: string;
  sortable: boolean;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { key: 'request_id', label: 'Request ID', sortable: false, defaultVisible: false },
  {
    key: 'user',
    label: 'User / Email',
    sortable: true,
    defaultVisible: true,
    alwaysVisible: true,
  },
  { key: 'inquiry_subject', label: 'Subject', sortable: true, defaultVisible: true },
  { key: 'request_date', label: 'Request date', sortable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, defaultVisible: false },
];

const ALL_STATUS_VALUE = 'all';

function getUserDisplay(row: SupportRequest): string {
  return row.user || row.email || '';
}

function filterSupportRequests(
  items: SupportRequest[],
  search: string,
  statusFilter: string,
): SupportRequest[] {
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
        item.user ?? '',
        item.email ?? '',
        item.inquiry_subject ?? '',
        item.message_description ?? '',
        item.status ?? '',
        item.request_id ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  return result;
}

function sortSupportRequests(
  items: SupportRequest[],
  column: SortColumn | null,
  direction: 'asc' | 'desc',
): SupportRequest[] {
  if (!column) return items;

  const sorted = [...items].sort((a, b) => {
    let aVal: unknown;
    let bVal: unknown;

    switch (column) {
      case 'user':
        aVal = getUserDisplay(a);
        bVal = getUserDisplay(b);
        break;
      case 'request_date': {
        const aTime = a.request_date ? new Date(a.request_date).getTime() : null;
        const bTime = b.request_date ? new Date(b.request_date).getTime() : null;
        aVal = aTime != null && !Number.isNaN(aTime) ? aTime : null;
        bVal = bTime != null && !Number.isNaN(bTime) ? bTime : null;
        break;
      }
      default:
        aVal = a[column];
        bVal = b[column];
    }

    const result = compareValues(aVal, bVal);
    return direction === 'asc' ? result : -result;
  });

  return sorted;
}

interface SupportRequestsTableProps {
  items: SupportRequest[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onView: (request: SupportRequest) => void;
  hasLoadedData: boolean;
  returnFocusRef: React.MutableRefObject<HTMLElement | null>;
}

export function SupportRequestsTable({
  items,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onView,
  hasLoadedData,
  returnFocusRef,
}: SupportRequestsTableProps) {
  const rowTriggerRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
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
    () => filterSupportRequests(items, debouncedSearch, statusFilter),
    [items, debouncedSearch, statusFilter],
  );

  const sortedItems = React.useMemo(
    () => sortSupportRequests(filteredItems, sort.column, sort.direction),
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

  const runRowMenuAction = (requestId: string, action: () => void) => {
    setReturnFocus(returnFocusRef, rowTriggerRefs.current.get(requestId) ?? null);
    action();
  };

  const renderCell = (row: SupportRequest, key: ColumnKey) => {
    switch (key) {
      case 'request_id':
        return row.request_id || '—';
      case 'user':
        return (
          <div className="space-y-0.5">
            {row.user ? <p className="font-medium">{row.user}</p> : null}
            <p className="font-lato text-body-sm text-figma-accent">{row.email || '—'}</p>
          </div>
        );
      case 'inquiry_subject':
        return row.inquiry_subject || '—';
      case 'request_date':
        return formatDate(row.request_date);
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
  const isDatasetEmpty = !isLoading && !isError && hasLoadedData && items.length === 0;
  const isFilteredEmpty =
    !isLoading && !isError && hasLoadedData && items.length > 0 && filteredItems.length === 0;

  return (
    <AdminDataTable
      aria-label="Support requests"
      isLoading={isLoading}
      isError={isError}
      isEmpty={isDatasetEmpty || isFilteredEmpty}
      errorMessage={errorMessage}
      onRetry={onRetry}
      emptyTitle={isFilteredEmpty ? 'No matching support requests' : 'No support requests yet'}
      emptyDescription={
        isFilteredEmpty
          ? 'Try adjusting your search or status filter.'
          : 'Support inquiries from users will appear here.'
      }
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search support requests…"
              aria-label="Search support requests"
              className="h-11 max-w-full sm:max-w-[280px]"
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
        </div>
      }
      footer={
        hasLoadedData || isError ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={sortedItems.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            disabled={isLoading || isError}
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
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Open actions menu"
                  ref={(element) => {
                    if (element) {
                      rowTriggerRefs.current.set(row.id, element);
                    } else {
                      rowTriggerRefs.current.delete(row.id);
                    }
                  }}
                  onFocus={(event) => captureReturnFocus(returnFocusRef, event)}
                  onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => runRowMenuAction(row.id, () => onView(row))}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </AdminDataTable>
  );
}
