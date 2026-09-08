import { Eye } from 'lucide-react';
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
import {
  PlanStatusBadge,
  formatDuration,
  formatPlanPrice,
  planStatusLabel,
} from './subscription-plan-display';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlanItem[];
  isLoading?: boolean;
  onView: (plan: SubscriptionPlanItem) => void;
  onEdit: (plan: SubscriptionPlanItem) => void;
  onArchive: (plan: SubscriptionPlanItem) => void;
}

type PlanSortKey = 'name' | 'price' | 'duration' | 'status';

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

export function SubscriptionPlansTable({
  plans,
  isLoading = false,
  onView,
  onEdit,
  onArchive,
}: SubscriptionPlansTableProps) {
  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<
    SubscriptionPlanItem,
    PlanSortKey
  >(plans, comparePlans);

  if (isLoading) {
    return (
      <div className="admin-manage-table">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`plan-skeleton-${index}`} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manage-table overflow-x-auto">
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
          {sortedRows.map((plan) => {
            const isArchived = plan.status === 'archived';

            return (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{formatPlanPrice(plan.price_amount, plan.currency)}</TableCell>
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
                      onClick={() => onView(plan)}
                      aria-label={`View ${plan.name}`}
                      title={`View ${plan.name}`}
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">View</span>
                    </Button>
                    {!isArchived ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(plan)}
                          aria-label={`Edit ${plan.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => onArchive(plan)}
                          aria-label={`Remove ${plan.name}`}
                        >
                          Remove
                        </Button>
                      </>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
