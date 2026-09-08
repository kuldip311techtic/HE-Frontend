import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SubscriptionPlanItem } from '@/types/subscriptions';
import { PlanStatusBadge, formatDuration, formatPlanPrice } from './subscription-plan-display';

interface SubscriptionPlanViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlanItem | null;
}

function formatTimestamp(value: string | null): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="font-lato text-body-sm text-muted-foreground">{label}</dt>
      <dd className="font-outfit text-body-sm text-foreground sm:text-right">{value}</dd>
    </div>
  );
}

export function SubscriptionPlanViewDialog({
  open,
  onOpenChange,
  plan,
}: SubscriptionPlanViewDialogProps) {
  if (!plan) {
    return null;
  }

  const roleLabel = plan.role === 'org_admin' ? 'Organization' : 'Coach';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{plan.name}</DialogTitle>
        <DialogDescription>
          Subscription plan details for {roleLabel.toLowerCase()} offerings.
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <dl className="space-y-3">
          <DetailRow label="Name" value={plan.name} />
          <DetailRow label="Price" value={formatPlanPrice(plan.price_amount, plan.currency)} />
          <DetailRow label="Duration" value={formatDuration(plan.billing_frequency)} />
          <DetailRow
            label="Status"
            value={<PlanStatusBadge plan={plan} />}
          />
          <DetailRow label="Role" value={roleLabel} />
          <DetailRow label="Currency" value={plan.currency.toUpperCase()} />
          <DetailRow
            label="Description"
            value={plan.description?.trim() ? plan.description : '—'}
          />
          {plan.features.length > 0 ? (
            <DetailRow
              label="Features"
              value={
                <ul className="list-inside list-disc text-left sm:text-right">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              }
            />
          ) : null}
          <DetailRow label="Created" value={formatTimestamp(plan.created_at)} />
          <DetailRow label="Last updated" value={formatTimestamp(plan.updated_at)} />
          {plan.status === 'archived' ? (
            <DetailRow label="Archived" value={formatTimestamp(plan.archived_at)} />
          ) : null}
        </dl>
      </DialogContent>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
