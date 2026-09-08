import { DataTableColumnVisibility } from '@/components/shared/DataTableColumnVisibility';
import { DataTablePageSortNote } from '@/components/shared/DataTablePageSortNote';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useColumnVisibility, type DataTableColumnDef } from '@/hooks/useColumnVisibility';
import { useTableSort } from '@/hooks/useTableSort';
import { cn } from '@/lib/utils/cn';
import { SupportRequestStatusBadge } from '@/components/features/support/SupportRequestStatusBadge';
import {
  displaySupportRequestMessage,
  displaySupportRequestUser,
  isSupportRequestClosed,
  type SupportRequestItem,
} from '@/types/support-requests';

interface SupportRequestsTableProps {
  requests: SupportRequestItem[];
  isLoading?: boolean;
  selectedId?: string | null;
  onSelect: (request: SupportRequestItem) => void;
}

type SupportColumnId = 'user' | 'date' | 'status' | 'inquiry';

type SupportRequestSortKey = 'user' | 'date' | 'status';

const COLUMN_DEFS: DataTableColumnDef<SupportColumnId>[] = [
  { id: 'user', label: 'User', defaultVisible: true, alwaysVisible: true },
  { id: 'date', label: 'Request date', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'inquiry', label: 'Inquiry', defaultVisible: true },
];

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function compareRequests(
  a: SupportRequestItem,
  b: SupportRequestItem,
  sortKey: SupportRequestSortKey,
): number {
  switch (sortKey) {
    case 'user':
      return displaySupportRequestUser(a).localeCompare(displaySupportRequestUser(b), undefined, {
        sensitivity: 'base',
      });
    case 'date':
      return a.created_at.localeCompare(b.created_at);
    case 'status':
      return (a.status ?? '').localeCompare(b.status ?? '', undefined, { sensitivity: 'base' });
    default:
      return 0;
  }
}

export function SupportRequestsTable({
  requests,
  isLoading = false,
  selectedId = null,
  onSelect,
}: SupportRequestsTableProps) {
  const { visibleColumns, visibleColumnDefs, toggleColumn } =
    useColumnVisibility<SupportColumnId>(COLUMN_DEFS);

  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<
    SupportRequestItem,
    SupportRequestSortKey
  >(requests, compareRequests);

  if (isLoading) {
    return (
      <div className="admin-manage-table">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`support-skeleton-${index}`} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DataTableColumnVisibility
        columns={COLUMN_DEFS}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        menuClassName="admin-support-columns-menu"
      />

      <div className="admin-manage-table overflow-x-auto">
        <DataTablePageSortNote />
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumnDefs.map((col) =>
                col.id === 'inquiry' ? (
                  <TableHead key={col.id} className="hidden md:table-cell">
                    {col.label}
                  </TableHead>
                ) : (
                  <SortableTableHead
                    key={col.id}
                    label={col.label}
                    sortKey={col.id}
                    activeSortKey={sortKey}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRows.map((request) => {
              const userLabel = displaySupportRequestUser(request);
              const isSelected = selectedId === request.id;
              const preview = displaySupportRequestMessage(request);

              return (
                <TableRow
                  key={request.id}
                  aria-selected={isSelected}
                  className={cn(isSelected && 'bg-muted/60')}
                >
                  {visibleColumnDefs.map((col) => {
                    if (col.id === 'user') {
                      return (
                        <TableCell key={col.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(request)}
                            className="font-medium text-left text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`View support request from ${userLabel}`}
                            aria-current={isSelected ? 'true' : undefined}
                          >
                            {userLabel}
                          </button>
                        </TableCell>
                      );
                    }
                    if (col.id === 'date') {
                      return (
                        <TableCell key={col.id}>{formatDate(request.created_at)}</TableCell>
                      );
                    }
                    if (col.id === 'status') {
                      return (
                        <TableCell key={col.id}>
                          <SupportRequestStatusBadge status={request.status} />
                          {isSupportRequestClosed(request) ? null : (
                            <span className="sr-only">Open request</span>
                          )}
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={col.id}
                        className="hidden max-w-xs truncate md:table-cell"
                      >
                        {preview}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
