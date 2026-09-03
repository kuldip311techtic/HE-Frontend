import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  formatBillingFrequency,
  formatPlanPrice,
  isActiveSubscriptionPlan,
} from '@/lib/api/subscription-plans';
import type { SubscriptionPlanItem } from '@/types/api';

interface SubscriptionPlansTableProps {
  plans: SubscriptionPlanItem[];
  onEdit: (plan: SubscriptionPlanItem) => void;
  onArchive: (plan: SubscriptionPlanItem) => void;
}

function PlanStatusBadge({ plan }: { plan: SubscriptionPlanItem }) {
  const isActive = isActiveSubscriptionPlan(plan);

  return (
    <Badge variant={isActive ? 'default' : 'secondary'}>
      {isActive ? 'Active' : 'Archived'}
    </Badge>
  );
}

export function SubscriptionPlansTable({ plans, onEdit, onArchive }: SubscriptionPlansTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell className="tabular-nums">
                {formatPlanPrice(plan.currency, plan.price_amount)}
              </TableCell>
              <TableCell>{formatBillingFrequency(plan.billing_frequency)}</TableCell>
              <TableCell>
                <PlanStatusBadge plan={plan} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      aria-label={`Actions for ${plan.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(plan)}>
                      <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onArchive(plan)}
                      disabled={plan.status === 'archived'}
                    >
                      <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
