import { describe, expect, it } from 'vitest';

import {
  formatBillingFrequency,
  formatPlanPrice,
  getSubscriptionRoleLabel,
  isActiveSubscriptionPlan,
} from '@/lib/api/subscription-plans';
import type { SubscriptionPlanItem } from '@/types/api';

function buildPlan(overrides: Partial<SubscriptionPlanItem> = {}): SubscriptionPlanItem {
  return {
    id: '11111111-2222-3333-4444-555555555555',
    role: 'org_admin',
    name: 'Starter',
    billing_frequency: 'monthly',
    currency: 'USD',
    price_amount: '29.99',
    teams_limit_type: 'unlimited',
    players_limit_type: 'unlimited',
    historical_records_duration: '1_year',
    is_active: true,
    include_offline_sync: false,
    status: 'active',
    ...overrides,
  };
}

describe('subscription plan helpers', () => {
  it('detects active plans by status or is_active flag', () => {
    expect(isActiveSubscriptionPlan(buildPlan())).toBe(true);
    expect(isActiveSubscriptionPlan(buildPlan({ status: 'archived', is_active: true }))).toBe(true);
    expect(isActiveSubscriptionPlan(buildPlan({ status: 'archived', is_active: false }))).toBe(
      false,
    );
  });

  it('formats billing frequency labels', () => {
    expect(formatBillingFrequency('monthly')).toBe('Monthly');
    expect(formatBillingFrequency('yearly')).toBe('Yearly');
  });

  it('formats plan prices with currency', () => {
    expect(formatPlanPrice('USD', '29.99')).toBe('$29.99');
  });

  it('returns role tab labels', () => {
    expect(getSubscriptionRoleLabel('org_admin')).toBe('Organization Admin Plans');
    expect(getSubscriptionRoleLabel('coach')).toBe('Coach Plans');
  });
});
