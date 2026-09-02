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
  cn,
  formatDate,
  getSupportRequestDate,
  getSupportRequestUserLabel,
  isOpenSupportRequest,
} from "@/lib/utils";
import type { SupportRequest } from "@/types/super-admin";

interface SupportRequestListProps {
  supportRequests: SupportRequest[];
  isLoading?: boolean;
  onRespond: (request: SupportRequest) => void;
  onClose: (request: SupportRequest) => void;
  onViewDetails: (request: SupportRequest) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 5 }).map((__, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function SupportRequestStatusBadge({ status }: { status: string }) {
  const open = isOpenSupportRequest(status);

  return (
    <Badge
      variant={open ? "default" : "secondary"}
      className={cn(
        open
          ? "border-transparent bg-warning/20 text-warning hover:bg-warning/30"
          : "border-transparent bg-muted text-muted-foreground"
      )}
      aria-label={`Status: ${status}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function SupportRequestList({
  supportRequests,
  isLoading = false,
  onRespond,
  onClose,
  onViewDetails,
}: SupportRequestListProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <Table aria-label="Support requests">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
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
            <TableSkeleton />
          ) : (
            supportRequests.map((request) => {
              const isOpen = isOpenSupportRequest(request.status);
              const userLabel = getSupportRequestUserLabel(request);
              const dateValue = getSupportRequestDate(request);

              return (
                <TableRow key={request.id} className="h-12">
                  <TableCell className="font-medium">
                    <button
                      type="button"
                      onClick={() => onViewDetails(request)}
                      className="text-left text-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                      aria-label={`View details for request from ${userLabel}`}
                    >
                      {userLabel}
                    </button>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {request.subject ?? request.message ?? "—"}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatDate(dateValue)}
                  </TableCell>
                  <TableCell>
                    <SupportRequestStatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isOpen && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRespond(request)}
                            aria-label={`Respond to request from ${userLabel}`}
                          >
                            <MessageSquare
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                            <span className="sr-only sm:not-sr-only sm:inline">
                              Respond
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onClose(request)}
                            aria-label={`Close request from ${userLabel}`}
                          >
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only sm:not-sr-only sm:inline">
                              Close
                            </span>
                          </Button>
                        </>
                      )}
                      {!isOpen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(request)}
                          aria-label={`View closed request from ${userLabel}`}
                        >
                          View
                        </Button>
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
