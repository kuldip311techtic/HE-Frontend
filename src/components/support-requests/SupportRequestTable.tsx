import { MessageSquare, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  canCloseSupportRequest,
  canRespondToSupportRequest,
  formatSupportRequestDate,
  getSupportRequestStatusLabel,
  getSupportRequestSubject,
  getSupportRequestUserLabel,
  normalizeSupportRequestStatus,
} from "@/lib/support-request-helpers";
import { cn } from "@/lib/utils";
import type { SupportRequest } from "@/types/support-request";

interface SupportRequestTableProps {
  supportRequests: SupportRequest[];
  onRespond: (request: SupportRequest) => void;
  onClose: (request: SupportRequest) => void;
  isLoading?: boolean;
}

function SupportRequestTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-9 w-32" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function SupportRequestStatusBadge({ request }: { request: SupportRequest }) {
  const status = normalizeSupportRequestStatus(request.status);
  const label = getSupportRequestStatusLabel(request);

  return (
    <Badge
      variant={
        status === "closed"
          ? "secondary"
          : status === "responded"
            ? "default"
            : "outline"
      }
      className={cn(
        status === "closed" && "text-muted-foreground",
        status === "open" &&
          "border-amber-500/50 text-amber-700 dark:text-amber-400",
      )}
    >
      {label}
    </Badge>
  );
}

export function SupportRequestTable({
  supportRequests,
  onRespond,
  onClose,
  isLoading = false,
}: SupportRequestTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">User</TableHead>
            <TableHead scope="col">Subject</TableHead>
            <TableHead scope="col">Request Date</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SupportRequestTableSkeleton />
          ) : (
            supportRequests.map((request) => {
              const userLabel = getSupportRequestUserLabel(request);
              const subject = getSupportRequestSubject(request);
              const showRespond = canRespondToSupportRequest(request);
              const showClose = canCloseSupportRequest(request);

              return (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{userLabel}</TableCell>
                  <TableCell>{subject}</TableCell>
                  <TableCell>
                    {formatSupportRequestDate(request.created_at)}
                  </TableCell>
                  <TableCell>
                    <SupportRequestStatusBadge request={request} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {showRespond && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRespond(request)}
                          aria-label={`Respond to request from ${userLabel}`}
                          className="min-h-11 min-w-11 sm:min-h-9 sm:min-w-0"
                        >
                          <MessageSquare
                            className="h-4 w-4 sm:mr-1"
                            aria-hidden="true"
                          />
                          <span className="hidden sm:inline">Respond</span>
                        </Button>
                      )}
                      {showClose && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onClose(request)}
                          aria-label={`Close request from ${userLabel}`}
                          className="min-h-11 min-w-11 text-destructive hover:text-destructive sm:min-h-9 sm:min-w-0"
                        >
                          <XCircle
                            className="h-4 w-4 sm:mr-1"
                            aria-hidden="true"
                          />
                          <span className="hidden sm:inline">Close</span>
                        </Button>
                      )}
                      {!showRespond && !showClose && (
                        <span className="text-sm text-muted-foreground">
                          No actions
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
