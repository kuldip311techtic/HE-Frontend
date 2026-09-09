import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency, humanizeEnum } from '@/lib/utils/format';
import type { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: SubscriptionPlan | null;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="font-lato text-body-sm font-medium text-figma-accent">{label}</dt>
      <dd className="text-body-sm text-foreground">{value}</dd>
    </div>
  );
}

export function SubscriptionDetailModal({
  open,
  onOpenChange,
  subscription,
}: SubscriptionDetailModalProps) {
  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{subscription.name}</DialogTitle>
        </DialogHeader>
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Name" value={subscription.name} />
          <DetailRow label="Price" value={formatCurrency(subscription.price)} />
          <DetailRow label="Billing cycle" value={humanizeEnum(subscription.billing_cycle)} />
          <DetailRow
            label="Status"
            value={
              subscription.status ? (
                <Badge variant="secondary">{humanizeEnum(subscription.status)}</Badge>
              ) : (
                '—'
              )
            }
          />
          <div className="sm:col-span-2">
            <DetailRow
              label="Description"
              value={subscription.description || '—'}
            />
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
