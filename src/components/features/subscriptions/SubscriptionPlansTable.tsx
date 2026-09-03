import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlanItem[];
  isLoading?: boolean;
  onEdit: (plan: SubscriptionPlanItem) => void;
  onArchive: (plan: SubscriptionPlanItem) => void;
}

function formatPrice(amount: string, currency: string): string {
  const numeric = Number.parseFloat(amount);
  if (Number.isNaN(numeric)) {
    return `${currency} ${amount}`;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(numeric);
  } catch {
    return `${currency} ${amount}`;
  }
}

function formatDuration(frequency: string): string {
  if (frequency === 'monthly') return 'Monthly';
  if (frequency === 'yearly') return 'Yearly';
  return frequency;
}

function PlanStatusBadge({ plan }: { plan: SubscriptionPlanItem }) {
  if (plan.status === 'archived') {
    return <Badge variant="outline">Archived</Badge>;
  }
  if (plan.is_active) {
    return <Badge variant="default">Active</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
}

export function SubscriptionPlansTable({
  plans,
  isLoading = false,
  onEdit,
  onArchive,
}: SubscriptionPlansTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{formatPrice(plan.price_amount, plan.currency)}</TableCell>
              <TableCell>{formatDuration(plan.billing_frequency)}</TableCell>
              <TableCell>
                <PlanStatusBadge plan={plan} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(plan)}
                    aria-label={`Edit ${plan.name}`}
                  >
                    Edit
                  </Button>
                  {plan.status !== 'archived' ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onArchive(plan)}
                      aria-label={`Archive ${plan.name}`}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
