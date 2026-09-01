import { Pencil, Trash2 } from "lucide-react";

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
  formatSubscriptionDuration,
  formatSubscriptionPrice,
  getSubscriptionName,
  getSubscriptionStatus,
} from "@/lib/subscription-helpers";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/types/subscription";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscription: Subscription) => void;
  isLoading?: boolean;
}

function SubscriptionTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-9 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function SubscriptionStatusBadge({ subscription }: { subscription: Subscription }) {
  const status = getSubscriptionStatus(subscription);
  const isActive = status === "Active";

  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(!isActive && "text-muted-foreground")}
    >
      {status}
    </Badge>
  );
}

export function SubscriptionTable({
  subscriptions,
  onEdit,
  onDelete,
  isLoading = false,
}: SubscriptionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Name</TableHead>
            <TableHead scope="col">Price</TableHead>
            <TableHead scope="col">Duration</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SubscriptionTableSkeleton />
          ) : (
            subscriptions.map((subscription) => {
              const name = getSubscriptionName(subscription);

              return (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>
                    {formatSubscriptionPrice(subscription.price)}
                  </TableCell>
                  <TableCell>
                    {formatSubscriptionDuration(subscription.duration)}
                  </TableCell>
                  <TableCell>
                    <SubscriptionStatusBadge subscription={subscription} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(subscription)}
                        aria-label={`Edit ${name}`}
                        className="min-h-11 min-w-11 sm:min-h-9 sm:min-w-0"
                      >
                        <Pencil
                          className="h-4 w-4 sm:mr-1"
                          aria-hidden="true"
                        />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(subscription)}
                        aria-label={`Remove ${name}`}
                        className="min-h-11 min-w-11 text-destructive hover:text-destructive sm:min-h-9 sm:min-w-0"
                      >
                        <Trash2
                          className="h-4 w-4 sm:mr-1"
                          aria-hidden="true"
                        />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
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
