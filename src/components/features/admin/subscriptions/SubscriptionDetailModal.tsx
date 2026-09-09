import type { RefObject } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DetailRow } from '@/components/features/admin/DetailFields';
import { formatCurrency, humanizeEnum } from '@/lib/utils/format';
import type { SubscriptionPlan } from '@/types/subscription';

interface SubscriptionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription: SubscriptionPlan | null;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function SubscriptionDetailModal({
  open,
  onOpenChange,
  subscription,
  returnFocusRef,
}: SubscriptionDetailModalProps) {
  if (!subscription) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} returnFocusRef={returnFocusRef}>
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
          <DetailRow
            label="Description"
            value={subscription.description || '—'}
            multiline
            className="sm:col-span-2"
          />
        </dl>
      </DialogContent>
    </Dialog>
  );
}
