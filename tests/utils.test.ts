import { describe, expect, it } from 'vitest';
import { resolveApiUrl } from '@/lib/api/client';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { isAdminRole } from '@/types/auth';
import { isDashboardEmpty } from '@/types/dashboard';

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });
});

describe('formatNumber', () => {
  it('formats integers with locale separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('formatCurrency', () => {
  it('formats values as USD currency', () => {
    expect(formatCurrency(1200)).toBe('$1,200');
  });
});

describe('isAdminRole', () => {
  it('returns true for admin roles', () => {
    expect(isAdminRole('super_admin')).toBe(true);
    expect(isAdminRole('admin')).toBe(true);
  });

  it('returns false for non-admin roles', () => {
    expect(isAdminRole('coach')).toBe(false);
    expect(isAdminRole('player')).toBe(false);
  });
});

describe('isDashboardEmpty', () => {
  it('detects when all dashboard metrics are zero', () => {
    expect(
      isDashboardEmpty({
        total_organizations: 0,
        total_coaches: 0,
        total_players: 0,
        total_sessions: 0,
        active_subscriptions: 0,
        revenue_overview: 0,
        description: null,
        link: null,
        error: null,
      }),
    ).toBe(true);
  });
});

describe('resolveApiUrl', () => {
  it('joins base URL and contract path without duplicating /api', () => {
    expect(
      resolveApiUrl('/api/v1/super-admin/dashboard'),
    ).toMatch(/\/api\/v1\/super-admin\/dashboard$/);
  });
});
