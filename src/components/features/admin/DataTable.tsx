import { type ReactNode } from 'react';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ColumnVisibilityMenu,
  type ColumnOption,
} from '@/components/features/admin/ColumnVisibilityMenu';
import { ResourcePagination } from '@/components/features/admin/ResourcePagination';
import { SortableHeader } from '@/components/features/admin/SortableHeader';
import { nextSortState, type SortState } from '@/lib/sort';
import type { PaginationMeta } from '@/types/api';

export type { ColumnOption };

export interface DataTableColumn<T> extends ColumnOption {
  className?: string;
  headerClassName?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  sort: SortState | null;
  onSortChange: (sort: SortState | null) => void;
  visibleKeys: string[];
  onToggleColumn: (key: string) => void;
  filters?: ReactNode;
  primaryAction?: ReactNode;
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading: boolean;
  loadingLabel: string;
  error: string | null;
  onRetry: () => void;
  emptyIcon?: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  renderRowActions: (row: T) => ReactNode;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  sort,
  onSortChange,
  visibleKeys,
  onToggleColumn,
  filters,
  primaryAction,
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading,
  loadingLabel,
  error,
  onRetry,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  renderRowActions,
}: DataTableProps<T>) {
  const visibleColumns = columns.filter(
    (column) => column.alwaysVisible || visibleKeys.includes(column.key),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {filters}
        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <ColumnVisibilityMenu columns={columns} visibleKeys={visibleKeys} onToggle={onToggleColumn} />
          {primaryAction}
        </div>
      </div>

      {isLoading ? <LoadingState label={loadingLabel} /> : null}
      {!isLoading && error ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          <Button type="button" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      ) : null}
      {!isLoading && !error && rows.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
      ) : null}
      {!isLoading && !error && rows.length > 0 ? (
        <>
          <Table>
            <caption className="sr-only">Column sorting applies to the current page only.</caption>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
                  <SortableHeader
                    key={column.key}
                    label={column.label}
                    columnKey={column.key}
                    sort={sort}
                    className={column.headerClassName}
                    onSort={(key) => onSortChange(nextSortState(sort, key))}
                  />
                ))}
                <TableHead className="w-12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={getRowId(row)}>
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">{renderRowActions(row)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ResourcePagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      ) : null}
    </div>
  );
}
