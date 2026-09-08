import { Badge } from '@/components/ui/badge';
import type { SubscriptionPlanItem } from '@/types/subscriptions';

export function formatPlanPrice(amount: string, currency: string): string {
  const numeric = Number.parseFloat(amount);
  if (Number.isNaN(numeric)) {
    return `${currency.toUpperCase()} ${amount}`;
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(numeric);
  } catch {
    return `${currency.toUpperCase()} ${amount}`;
  }
}

export function formatDuration(frequency: string): string {
  if (frequency === 'monthly') return 'Monthly';
  if (frequency === 'yearly') return 'Yearly';
  return frequency;
}

export function planStatusLabel(plan: SubscriptionPlanItem): string {
  if (plan.status === 'archived') return 'Archived';
  if (plan.is_active) return 'Active';
  return 'Inactive';
}

export function PlanStatusBadge({ plan }: { plan: SubscriptionPlanItem }) {
  if (plan.status === 'archived') {
    return <Badge variant="outline">Archived</Badge>;
  }
  if (plan.is_active) {
    return <Badge variant="default">Active</Badge>;
  }
  return <Badge variant="secondary">Inactive</Badge>;
}
