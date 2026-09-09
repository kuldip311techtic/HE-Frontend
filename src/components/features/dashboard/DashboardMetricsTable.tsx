import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SortableHeader,
  cycleSortDirection,
  type SortDirection,
} from '@/components/ui/SortableHeader';
import type { DashboardMetricRow } from '@/types/api';
import { cn } from '@/lib/utils/cn';

type MetricKey =
  | 'total_organizations'
  | 'total_coaches'
  | 'total_players'
  | 'total_sessions'
  | 'active_subscriptions'
  | 'revenue_overview';

interface ColumnDef {
  key: MetricKey;
  label: string;
  alwaysVisible?: boolean;
}

const COLUMNS: ColumnDef[] = [
  { key: 'total_organizations', label: 'Total Organizations', alwaysVisible: true },
  { key: 'total_coaches', label: 'Total Coaches' },
  { key: 'total_players', label: 'Total Players' },
  { key: 'total_sessions', label: 'Total Sessions' },
  { key: 'active_subscriptions', label: 'Active Subscriptions' },
  { key: 'revenue_overview', label: 'Revenue Overview' },
];

interface DashboardMetricsTableProps {
  rows: DashboardMetricRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function compareValues(a: number, b: number, direction: SortDirection): number {
  if (direction === null) return 0;
  return direction === 'asc' ? a - b : b - a;
}

export function DashboardMetricsTable({
  rows,
  isLoading,
  isError,
  onRetry,
}: DashboardMetricsTableProps) {
  const [search, setSearch] = React.useState('');
  const [filterField, setFilterField] = React.useState<MetricKey>('total_organizations');
  const [filterMin, setFilterMin] = React.useState('');
  const [sortKey, setSortKey] = React.useState<MetricKey | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [visibleColumns, setVisibleColumns] = React.useState<Record<MetricKey, boolean>>(() =>
    Object.fromEntries(COLUMNS.map((c) => [c.key, true])) as Record<MetricKey, boolean>,
  );

  const filteredRows = React.useMemo(() => {
    let result = [...rows];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((row) =>
        COLUMNS.some((col) => String(row[col.key]).toLowerCase().includes(q)),
      );
    }

    if (filterMin.trim()) {
      const min = Number(filterMin);
      if (!Number.isNaN(min)) {
        result = result.filter((row) => Number(row[filterField]) >= min);
      }
    }

    if (sortKey && sortDirection) {
      result.sort((a, b) => compareValues(Number(a[sortKey]), Number(b[sortKey]), sortDirection));
    }

    return result;
  }, [rows, search, filterField, filterMin, sortKey, sortDirection]);

  const paginatedRows = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  React.useEffect(() => {
    setPage(1);
  }, [search, filterField, filterMin, sortKey, sortDirection, pageSize]);

  const handleSort = (key: MetricKey) => {
    if (sortKey === key) {
      setSortDirection(cycleSortDirection(sortDirection));
      if (cycleSortDirection(sortDirection) === null) {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const activeColumns = COLUMNS.filter((col) => col.alwaysVisible || visibleColumns[col.key]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search metrics…"
            aria-label="Search metrics"
            className="sm:max-w-xs"
          />
          <div className="flex items-center gap-2">
            <Select value={filterField} onValueChange={(v) => setFilterField(v as MetricKey)}>
              <SelectTrigger className="w-[180px]" aria-label="Filter field">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLUMNS.map((col) => (
                  <SelectItem key={col.key} value={col.key}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={filterMin}
              onChange={(e) => setFilterMin(e.target.value)}
              placeholder="Min value"
              aria-label="Minimum filter value"
              className="w-[120px]"
            />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="Toggle columns">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {COLUMNS.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.key}
                checked={col.alwaysVisible ? true : visibleColumns[col.key]}
                disabled={col.alwaysVisible}
                onCheckedChange={(checked) =>
                  setVisibleColumns((prev) => ({ ...prev, [col.key]: checked }))
                }
              >
                {col.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-figma-10 border border-figma-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {activeColumns.map((col) => (
                <TableHead key={col.key}>
                  <SortableHeader
                    label={col.label}
                    direction={sortKey === col.key ? sortDirection : null}
                    onToggle={() => handleSort(col.key)}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {activeColumns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={activeColumns.length} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-body-sm text-destructive" role="alert">
                      Unable to load dashboard metrics. Please try again.
                    </p>
                    <Button variant="outline" onClick={onRetry}>
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={activeColumns.length}>
                  <EmptyState
                    title="No metrics available"
                    description="Dashboard analytics data is not available yet."
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <TableRow key={row.id}>
                  {activeColumns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn(col.key === 'revenue_overview' && 'text-right tabular-nums')}
                    >
                      {col.key === 'revenue_overview'
                        ? row.revenue_overview.toLocaleString()
                        : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!isLoading && !isError && filteredRows.length > 0 ? (
          <div className="px-4 pb-4">
            <Pagination
              page={page}
              pageSize={pageSize}
              totalItems={filteredRows.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
