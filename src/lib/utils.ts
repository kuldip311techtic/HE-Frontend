import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: string | number): string {
  const amount = typeof value === 'string' ? parseFloat(value) : value;

  if (Number.isNaN(amount)) {
    return String(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDuration(
  duration: string,
  billingCycle?: string,
): string {
  if (duration) {
    return duration;
  }

  if (!billingCycle) {
    return '—';
  }

  const normalized = billingCycle.toLowerCase();

  if (['monthly', 'month'].includes(normalized)) {
    return 'Monthly';
  }

  if (['yearly', 'year', 'annual'].includes(normalized)) {
    return 'Yearly';
  }

  return billingCycle;
}

export function isActiveSubscriptionStatus(status: string): boolean {
  return status.toLowerCase() === 'active';
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function isClosedSupportRequestStatus(status: string): boolean {
  return status.toLowerCase() === 'closed';
}

export function isDashboardEmpty(metrics: {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
}): boolean {
  return (
    metrics.total_organizations === 0 &&
    metrics.total_coaches === 0 &&
    metrics.total_players === 0 &&
    metrics.total_sessions === 0 &&
    metrics.active_subscriptions === 0 &&
    metrics.revenue_overview === 0
  );
}
