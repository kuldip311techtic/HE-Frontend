import { Pencil, Trash2 } from "lucide-react";

import { StatusBadge } from "@/components/StatusBadge";
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
import { formatCurrency } from "@/lib/utils";
import type { SubscriptionPlan } from "@/types/super-admin";

interface SubscriptionTableProps {
  subscriptions: SubscriptionPlan[];
  isLoading?: boolean;
  onEdit: (subscription: SubscriptionPlan) => void;
  onRemove: (subscription: SubscriptionPlan) => void;
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

export function SubscriptionTable({
  subscriptions,
  isLoading = false,
  onEdit,
  onRemove,
}: SubscriptionTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <Table aria-label="Subscription plans">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
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
            <TableSkeleton />
          ) : (
            subscriptions.map((subscription) => (
              <TableRow key={subscription.id} className="h-12">
                <TableCell className="font-medium">{subscription.name}</TableCell>
                <TableCell className="tabular-nums">
                  {formatCurrency(subscription.price)}
                </TableCell>
                <TableCell>{subscription.duration}</TableCell>
                <TableCell>
                  <StatusBadge status={subscription.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(subscription)}
                      aria-label={`Edit ${subscription.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:inline">
                        Edit
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onRemove(subscription)}
                      aria-label={`Remove ${subscription.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:inline">
                        Remove
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
