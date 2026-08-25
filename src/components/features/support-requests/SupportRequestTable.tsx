import { Eye } from 'lucide-react';
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
import { formatDateTime } from '@/lib/utils';
import type { SupportRequest } from '@/types/support-request';

interface SupportRequestTableProps {
  requests: SupportRequest[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onView: (request: SupportRequest) => void;
}

function TableSkeleton() {
  return (
    <div
      className="space-y-3"
      aria-label="Loading support requests"
      role="status"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
      <span className="sr-only">Loading support requests</span>
    </div>
  );
}

export default function SupportRequestTable({
  requests,
  loading = false,
  error = null,
  onRetry,
  onView,
}: SupportRequestTableProps) {
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
    return <ErrorState message={error} onRetry={onRetry} />;
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
                <TableHead scope="col">Subject</TableHead>
                <TableHead scope="col" className="hidden md:table-cell">
                  User
                </TableHead>
                <TableHead scope="col">Request Date</TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {request.subject}
                      </p>
                      {request.submitter_email ? (
                        <p className="mt-0.5 text-xs text-muted-foreground md:hidden">
                          {request.submitter_email}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {request.submitter_email ?? 'Unknown user'}
                  </TableCell>
                  <TableCell>{formatDateTime(request.created_at)}</TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onView(request)}
                        aria-label={`View and respond to ${request.subject}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
