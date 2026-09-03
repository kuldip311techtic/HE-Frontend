import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatSupportRequestDate } from '@/lib/api/support-requests';
import { cn } from '@/lib/utils';
import type { SupportRequestItem } from '@/types/api';

interface SupportRequestsTableProps {
  requests: SupportRequestItem[];
  selectedId?: string | null;
  onSelect: (request: SupportRequestItem) => void;
}

export function SupportRequestsTable({
  requests,
  selectedId,
  onSelect,
}: SupportRequestsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Request date</TableHead>
            <TableHead>Subject</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const isSelected = request.id === selectedId;

            return (
              <TableRow
                key={request.id}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isSelected && 'bg-primary/10',
                )}
                tabIndex={0}
                role="button"
                aria-selected={isSelected}
                aria-label={`Support request from ${request.name}: ${request.subject}`}
                onClick={() => onSelect(request)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelect(request);
                  }
                }}
              >
                <TableCell>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-body-sm text-muted-foreground">{request.email}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">
                  {formatSupportRequestDate(request.created_at)}
                </TableCell>
                <TableCell className="max-w-[240px] truncate">{request.subject}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
