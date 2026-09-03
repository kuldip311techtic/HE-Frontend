import { Button } from '@/components/ui/button';
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
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => {
            const isSelected = request.id === selectedId;

            return (
              <TableRow
                key={request.id}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(isSelected && 'bg-primary/10')}
              >
                <TableCell>
                  <div className="font-medium">{request.name}</div>
                  <div className="text-body-sm text-muted-foreground">{request.email}</div>
                </TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">
                  {formatSupportRequestDate(request.created_at)}
                </TableCell>
                <TableCell className="max-w-[240px] truncate">{request.subject}</TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant={isSelected ? 'secondary' : 'outline'}
                    size="sm"
                    className="h-9"
                    aria-pressed={isSelected}
                    aria-label={`View support request from ${request.name}: ${request.subject}`}
                    onClick={() => onSelect(request)}
                  >
                    View
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
