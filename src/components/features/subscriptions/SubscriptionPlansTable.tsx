import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTableSort } from '@/hooks/useTableSort';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlanItem[];
  isLoading?: boolean;
  onEdit: (plan: SubscriptionPlanItem) => void;
  onArchive: (plan: SubscriptionPlanItem) => void;
}

type PlanSortKey = 'name' | 'price' | 'duration' | 'status';

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

function planStatusLabel(plan: SubscriptionPlanItem): string {
  if (plan.status === 'archived') return 'Archived';
  if (plan.is_active) return 'Active';
  return 'Inactive';
}

function comparePlans(a: SubscriptionPlanItem, b: SubscriptionPlanItem, sortKey: PlanSortKey): number {
  switch (sortKey) {
    case 'name':
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    case 'price': {
      const priceA = Number.parseFloat(a.price_amount);
      const priceB = Number.parseFloat(b.price_amount);
      if (Number.isNaN(priceA) || Number.isNaN(priceB)) {
        return a.price_amount.localeCompare(b.price_amount);
      }
      return priceA - priceB;
    }
    case 'duration':
      return a.billing_frequency.localeCompare(b.billing_frequency);
    case 'status':
      return planStatusLabel(a).localeCompare(planStatusLabel(b), undefined, { sensitivity: 'base' });
    default:
      return 0;
  }
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
  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<
    SubscriptionPlanItem,
    PlanSortKey
  >(plans, comparePlans, 'name');

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`plan-skeleton-${index}`} className="h-12 w-full" />
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
            <SortableTableHead
              label="Name"
              sortKey="name"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Price"
              sortKey="price"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Duration"
              sortKey="duration"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Status"
              sortKey="status"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((plan) => (
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
