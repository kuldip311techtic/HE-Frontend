import * as React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationBar } from '@/components/features/shared/PaginationBar';
import { cn } from '@/lib/utils/cn';
import { compareValues, cycleSort, type SortState } from '@/lib/utils/sort';
import type { PaginationMeta } from '@/types/api';

export interface DataTableColumn<T> {
  id: string;
  label: string;
  accessor: (row: T) => unknown;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  hideable?: boolean;
  defaultHidden?: boolean;
  alwaysVisible?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  leadingToolbar?: React.ReactNode;
  trailingToolbar?: React.ReactNode;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  renderActions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyAction,
  leadingToolbar,
  trailingToolbar,
  pagination,
  onPageChange,
  onPageSizeChange,
  renderActions,
  onRowClick,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>({ column: null, direction: null });
  const [hidden, setHidden] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const column of columns) {
      if (column.defaultHidden && !column.alwaysVisible) {
        initial[column.id] = true;
      }
    }
    return initial;
  });

  const visibleColumns = columns.filter((column) => column.alwaysVisible || !hidden[column.id]);

  const sortedData = React.useMemo(() => {
    if (!sort.column || !sort.direction) return data;
    const column = columns.find((item) => item.id === sort.column);
    if (!column) return data;
    return [...data].sort((left, right) =>
      compareValues(column.accessor(left), column.accessor(right), sort.direction ?? 'asc'),
    );
  }, [columns, data, sort]);

  const hideableColumns = columns.filter((column) => column.hideable !== false && !column.alwaysVisible);

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">{leadingToolbar}</div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {hideableColumns.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="min-h-11">
                  <Columns3 className="h-4 w-4" aria-hidden />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                {hideableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={!hidden[column.id]}
                    onCheckedChange={(checked) =>
                      setHidden((current) => ({ ...current, [column.id]: !checked }))
                    }
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {trailingToolbar}
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-start gap-3 rounded-figma-10 border border-figma-border px-4 py-6">
          <ErrorMessage message={error} />
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="rounded-figma-10 border border-figma-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {visibleColumns.map((column) => {
                    const isActive = sort.column === column.id;
                    const ariaSort = !column.sortable
                      ? undefined
                      : isActive && sort.direction === 'asc'
                        ? 'ascending'
                        : isActive && sort.direction === 'desc'
                          ? 'descending'
                          : 'none';
                    return (
                      <TableHead key={column.id} aria-sort={ariaSort} className={column.className}>
                        {column.sortable ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 rounded-figma-10 text-left text-body-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
                            onClick={() => setSort((current) => cycleSort(current, column.id))}
                          >
                            {column.label}
                            {isActive && sort.direction === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                            ) : isActive && sort.direction === 'desc' ? (
                              <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                            ) : (
                              <ArrowUpDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
                            )}
                          </button>
                        ) : (
                          column.label
                        )}
                      </TableHead>
                    );
                  })}
                  {renderActions ? (
                    <TableHead className="w-[88px] text-right">Actions</TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {visibleColumns.map((column) => (
                        <TableCell key={column.id}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                      {renderActions ? (
                        <TableCell>
                          <Skeleton className="ml-auto h-4 w-10" />
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))
                ) : sortedData.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={visibleColumns.length + (renderActions ? 1 : 0)}
                      className="p-0"
                    >
                      <EmptyState
                        title={emptyTitle}
                        description={emptyDescription}
                        action={emptyAction}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((row) => (
                    <TableRow
                      key={getRowId(row)}
                      className={cn(onRowClick && 'cursor-pointer')}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {visibleColumns.map((column) => (
                        <TableCell key={column.id} className={column.className}>
                          {column.render ? column.render(row) : String(column.accessor(row) ?? '—')}
                        </TableCell>
                      ))}
                      {renderActions ? (
                        <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                          {renderActions(row)}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {pagination && onPageChange && onPageSizeChange ? (
            <PaginationBar
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
