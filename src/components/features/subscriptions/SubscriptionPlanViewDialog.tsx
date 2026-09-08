import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

interface SubscriptionPlanViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlanItem | null;
}

function formatPrice(amount: string, currency: string): string {
  const numeric = Number.parseFloat(amount);
  if (Number.isNaN(numeric)) {
    return amount;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(numeric);
  } catch {
    return amount;
  }
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatLimitType(type: string, count: number | null): string {
  if (type === 'unlimited') return 'Unlimited';
  return count !== null ? String(count) : '—';
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="admin-subscriptions-detail-row grid sm:grid-cols-[minmax(140px,35%)_1fr]">
      <dt>{label}</dt>
      <dd>{value}</dd>
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

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      className="admin-form-dialog admin-subscriptions-dialog admin-subscriptions-dialog--view"
    >
      <DialogHeader className="admin-form-dialog__header border-0 px-6 py-5">
        <DialogTitle className="admin-form-dialog__title">{plan.name}</DialogTitle>
        <DialogDescription className="admin-form-dialog__description">
          Subscription plan details
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="admin-form-dialog__content max-h-[70vh] overflow-y-auto border-0 py-5">
        <dl>
          <DetailRow label="Id" value={plan.id} />
          <DetailRow label="Role" value={plan.role === 'org_admin' ? 'Organization admin' : 'Coach'} />
          <DetailRow label="Name" value={plan.name} />
          <DetailRow
            label="Billing frequency"
            value={plan.billing_frequency === 'monthly' ? 'Monthly' : 'Yearly'}
          />
          <DetailRow label="Price" value={formatPrice(plan.price_amount, plan.currency)} />
          <DetailRow label="Currency" value={plan.currency} />
          <DetailRow label="Stripe product id" value={plan.stripe_product_id || '—'} />
          <DetailRow label="Stripe price id" value={plan.stripe_price_id || '—'} />
          <DetailRow label="Teams limit" value={formatLimitType(plan.teams_limit_type, plan.teams_count)} />
          <DetailRow
            label="Coaches limit"
            value={
              plan.coaches_limit_type
                ? formatLimitType(plan.coaches_limit_type, plan.coaches_count)
                : '—'
            }
          />
          <DetailRow
            label="Players limit"
            value={formatLimitType(plan.players_limit_type, plan.players_count)}
          />
          <DetailRow
            label="Historical records"
            value={plan.historical_records_duration.replace(/_/g, ' ')}
          />
          <DetailRow label="Is active" value={plan.is_active ? 'Yes' : 'No'} />
          <DetailRow label="Offline sync" value={plan.include_offline_sync ? 'Yes' : 'No'} />
          <DetailRow label="Status" value={plan.status} />
          <DetailRow label="Archived at" value={formatDate(plan.archived_at)} />
          <DetailRow label="Replacement plan id" value={plan.replacement_plan_id ?? '—'} />
          <DetailRow label="Stripe status" value={plan.stripe_status ?? '—'} />
          <DetailRow label="Description" value={plan.description ?? '—'} />
          <DetailRow
            label="Features"
            value={
              plan.features.length > 0 ? (
                <ul className="list-inside list-disc">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              ) : (
                '—'
              )
            }
          />
          <DetailRow label="Created at" value={formatDate(plan.created_at)} />
          <DetailRow label="Updated at" value={formatDate(plan.updated_at)} />
        </dl>
      </DialogContent>
    </Dialog>
  );
}
