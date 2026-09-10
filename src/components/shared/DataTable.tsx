import type { ReactNode } from 'react';
import { Columns3 } from 'lucide-react';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import type { SortDirection } from '@/components/shared/SortableTableHead';
import { SortableTableHead } from '@/components/shared/SortableTableHead';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import type { ColumnVisibilityConfig } from '@/hooks/useColumnVisibility';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface DataTableColumn<T> {
  id: string;
  label: string;
  sortKey?: string;
  alwaysVisible?: boolean;
  defaultVisible?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  sortKey: string | null;
  sortDirection: SortDirection;
  onSort: (key: string) => void;
  sortScopeNote?: string;
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  toggleableColumns: ColumnVisibilityConfig[];
  showColumnsControl?: boolean;
  renderActions?: (row: T) => ReactNode;
  actionsLabel?: string;
  toolbar?: ReactNode;
  pagination?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: string;
  error?: string | null;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  isEmptyFiltered?: boolean;
  filteredEmptyTitle?: string;
  filteredEmptyDescription?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  sortKey,
  sortDirection,
  onSort,
  sortScopeNote,
  columnVisibility,
  onColumnVisibilityChange,
  toggleableColumns,
  showColumnsControl = true,
  renderActions,
  actionsLabel = 'Actions',
  toolbar,
  pagination,
  isLoading = false,
  loadingLabel = 'Loading…',
  error = null,
  onRetry,
  isEmpty = false,
  emptyTitle = 'No Records Yet',
  emptyDescription = 'Records will appear here once available.',
  isEmptyFiltered = false,
  filteredEmptyTitle = 'No Matching Records',
  filteredEmptyDescription = 'Try adjusting your filters or search terms.',
}: DataTableProps<T>) {
  const visibleColumns = columns.filter((column) => columnVisibility[column.id] !== false);

  const columnsControl =
    showColumnsControl && toggleableColumns.length > 0 ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <Columns3 className="mr-2 h-4 w-4" aria-hidden="true" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {toggleableColumns.map((column) => {
            const definition = columns.find((entry) => entry.id === column.id);
            const visible = columnVisibility[column.id] !== false;
            return (
              <DropdownMenuItem
                key={column.id}
                role="menuitemcheckbox"
                aria-checked={visible}
                onSelect={(event) => event.preventDefault()}
                onClick={() => onColumnVisibilityChange(column.id, !visible)}
              >
                <span className="mr-2 w-4 text-center" aria-hidden="true">
                  {visible ? '✓' : ''}
                </span>
                {definition?.label ?? column.id}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    ) : null;

  return (
    <div className="space-y-4">
      {toolbar ? (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">{toolbar}</div>
          {columnsControl}
        </div>
      ) : columnsControl ? (
        <div className="flex justify-end">{columnsControl}</div>
      ) : null}

      {error && !isLoading ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          {onRetry ? (
            <Button type="button" variant="outline" onClick={() => void onRetry()}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState label={loadingLabel} />
      ) : isEmpty && !error ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : isEmptyFiltered && !error ? (
        <EmptyState title={filteredEmptyTitle} description={filteredEmptyDescription} />
      ) : !error ? (
        <div className="space-y-4">
          {sortScopeNote ? (
            <p className="text-sm text-muted-foreground">{sortScopeNote}</p>
          ) : null}
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) =>
                    column.sortKey ? (
                      <SortableTableHead
                        key={column.id}
                        label={column.label}
                        sortKey={column.sortKey}
                        activeSortKey={sortKey}
                        direction={sortDirection}
                        onSort={onSort}
                        className={column.headerClassName}
                      />
                    ) : (
                      <TableHead key={column.id} scope="col" className={column.headerClassName}>
                        {column.label}
                      </TableHead>
                    ),
                  )}
                  {renderActions ? (
                    <TableHead scope="col">{actionsLabel}</TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={getRowKey(row)}>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className={cn(column.cellClassName)}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                    {renderActions ? <TableCell>{renderActions(row)}</TableCell> : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {pagination}
        </div>
      ) : null}
    </div>
  );
}
