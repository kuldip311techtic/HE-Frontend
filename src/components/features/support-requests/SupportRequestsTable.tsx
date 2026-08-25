import { Eye, MessageSquare, XCircle } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTime, isClosedSupportRequestStatus } from '@/lib/utils';
import type { SupportRequest } from '@/types/supportRequest';

interface SupportRequestsTableProps {
  requests: SupportRequest[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onView: (request: SupportRequest) => void;
  onRespond: (request: SupportRequest) => void;
  onClose: (request: SupportRequest) => void;
}

function TableSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading support requests" role="status">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
      <span className="sr-only">Loading support requests</span>
    </div>
  );
}

export default function SupportRequestsTable({
  requests,
  loading = false,
  error = null,
  onRetry,
  onView,
  onRespond,
  onClose,
}: SupportRequestsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <TableSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load support requests"
        message={error}
        retryLabel="Retry loading support requests"
        onRetry={onRetry}
      />
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No support requests"
        description="When users submit support inquiries, they will appear here for review and response."
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table aria-label="Support requests">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">User</TableHead>
                <TableHead scope="col">Subject</TableHead>
                <TableHead scope="col" className="hidden md:table-cell">
                  Request Date
                </TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const isClosed = isClosedSupportRequestStatus(request.status);

                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <span className="text-sm text-foreground">
                        {request.submitter_email ?? 'Unknown user'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {request.subject}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:hidden">
                          {formatDateTime(request.created_at)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDateTime(request.created_at)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onView(request)}
                          aria-label={`View support request: ${request.subject}`}
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRespond(request)}
                          disabled={isClosed}
                          aria-label={`Respond to support request: ${request.subject}`}
                        >
                          <MessageSquare className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">Respond</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onClose(request)}
                          disabled={isClosed}
                          aria-label={`Close support request: ${request.subject}`}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4" aria-hidden="true" />
                          <span className="hidden sm:inline">Close</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
