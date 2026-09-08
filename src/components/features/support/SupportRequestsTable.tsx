import { cn } from '@/lib/utils/cn';
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
import { useTableSort } from '@/hooks/useTableSort';
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

type SupportRequestSortKey = 'user' | 'date' | 'status';

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
    <div className="admin-manage-table overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              label="User"
              sortKey="user"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Request date"
              sortKey="date"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Status"
              sortKey="status"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <TableHead className="hidden md:table-cell">Inquiry</TableHead>
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
                <TableCell>
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
                <TableCell>{formatDate(request.created_at)}</TableCell>
                <TableCell>
                  <SupportRequestStatusBadge status={request.status} />
                  {isSupportRequestClosed(request) ? null : (
                    <span className="sr-only">Open request</span>
                  )}
                </TableCell>
                <TableCell className="hidden max-w-xs truncate md:table-cell">{preview}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
