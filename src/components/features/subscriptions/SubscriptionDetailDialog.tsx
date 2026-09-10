import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { titleCase } from '@/lib/utils';
import type { SubscriptionPlan } from '@/types/api';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

interface SubscriptionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: SubscriptionPlan | null;
}

export function SubscriptionDetailDialog({
  open,
  onOpenChange,
  subscription,
}: SubscriptionDetailDialogProps) {
  if (!subscription) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription Plan Details</DialogTitle>
          <DialogDescription>
            Read-only view of this subscription plan&apos;s pricing and billing settings.
          </DialogDescription>
        </DialogHeader>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Subscription Name</dt>
            <dd className="mt-1 text-foreground">{subscription.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Price</dt>
            <dd className="mt-1 text-foreground">{priceFormatter.format(subscription.price)}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Billing Cycle</dt>
            <dd className="mt-1 text-foreground">{titleCase(subscription.billing_cycle)}</dd>
          </div>
          {subscription.status ? (
            <div>
              <dt className="font-medium text-muted-foreground">Status</dt>
              <dd className="mt-1">
                <Badge variant="secondary">{titleCase(subscription.status)}</Badge>
              </dd>
            </div>
          ) : null}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
