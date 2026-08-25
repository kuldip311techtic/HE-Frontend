import { Pencil, Trash2 } from 'lucide-react';
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
import { formatCurrency, formatDuration } from '@/lib/utils';
import type { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlan[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onEdit: (plan: SubscriptionPlan) => void;
  onRemove: (plan: SubscriptionPlan) => void;
}

function TableSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading subscription plans" role="status">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
      <span className="sr-only">Loading subscription plans</span>
    </div>
  );
}

export default function SubscriptionPlansTable({
  plans,
  loading = false,
  error = null,
  onRetry,
  onEdit,
  onRemove,
}: SubscriptionPlansTableProps) {
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
        title="Unable to load subscription plans"
        message={error}
        retryLabel="Retry loading subscription plans"
        onRetry={onRetry}
      />
    );
  }

  if (plans.length === 0) {
    return (
      <EmptyState
        title="No subscription plans yet"
        description="Create your first subscription plan to offer organizations flexible billing options."
      />
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table aria-label="Subscription plans">
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Name</TableHead>
                <TableHead scope="col">Price</TableHead>
                <TableHead scope="col" className="hidden sm:table-cell">
                  Duration
                </TableHead>
                <TableHead scope="col">Status</TableHead>
                <TableHead scope="col" className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{plan.name}</p>
                      {plan.description ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground sm:hidden">
                          {plan.description}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(plan.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDuration(plan.duration, plan.billing_cycle)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={plan.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(plan)}
                        aria-label={`Edit ${plan.name}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onRemove(plan)}
                        aria-label={`Remove ${plan.name}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Remove</span>
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
