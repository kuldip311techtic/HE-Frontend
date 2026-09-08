import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  pageSortOnly?: boolean;
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
  pageSortOnly = false,
  onSelect,
}: SupportRequestsTableProps) {
  const { sortKey, sortDirection, sortedRows, handleSort, sortEnabled } = useTableSort<
    SupportRequestItem,
    SupportRequestSortKey
  >(requests, compareRequests, { enabled: !pageSortOnly });

  const sortDisabled = !sortEnabled;

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
      {sortDisabled ? (
        <p className="border-b border-[var(--figma-hex-border)] px-4 py-2 font-outfit text-body-sm text-muted-foreground">
          Column sorting is unavailable while results are paginated.
        </p>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              label="User"
              sortKey="user"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
              disabled={sortDisabled}
            />
            <SortableTableHead
              label="Request date"
              sortKey="date"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
              disabled={sortDisabled}
            />
            <SortableTableHead
              label="Status"
              sortKey="status"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
              disabled={sortDisabled}
            />
            <TableHead className="hidden md:table-cell">Inquiry</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableCell className="font-medium">{userLabel}</TableCell>
                <TableCell>{formatDate(request.created_at)}</TableCell>
                <TableCell>
                  <SupportRequestStatusBadge status={request.status} />
                  {isSupportRequestClosed(request) ? null : (
                    <span className="sr-only">Open request</span>
                  )}
                </TableCell>
                <TableCell className="hidden max-w-xs truncate md:table-cell">{preview}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onSelect(request)}
                    aria-label={`View support request from ${userLabel}`}
                    aria-pressed={isSelected}
                    title="View request"
                    className="admin-outline-btn"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
