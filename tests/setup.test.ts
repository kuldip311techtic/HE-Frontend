import { describe, expect, it } from 'vitest';
import { AUTH_QUERY_KEY, getAuthErrorMessage } from '../src/hooks/useAuth';
import { DASHBOARD_QUERY_KEY } from '../src/lib/api/queryKeys';
import { validateLoginCredentials } from '../src/lib/auth/validateLogin';
import { getApiBaseUrl } from '../src/lib/api/client';
import {
  formatDateRangeLabel,
  getDefaultDateRange,
  validateDateRange,
} from '../src/lib/dashboard/dateRange';
import { buildDashboardCsv } from '../src/lib/dashboard/export';
import {
  DASHBOARD_METRIC_DEFINITIONS,
  formatMetricValue,
  hasAnyMetricValues,
  orderDashboardMetrics,
} from '../src/lib/dashboard/metrics';
import { colors } from '../src/theme/tokens';
import { breakpoints } from '../src/theme/breakpoints';
import { ApiError } from '../src/types/api';
import {
  adminCoreModules,
  adminNavigation,
  adminPaths,
  adminPublicNavigation,
} from '../src/routes/admin';

describe('design tokens', () => {
  it('exposes core brand colors', () => {
    expect(colors.accent).toBe('#EA580C');
    expect(colors.primary).toBe('#0B1A2E');
    expect(colors.successSoft).toBe('#F0FDF4');
  });

  it('exposes layout breakpoints', () => {
    expect(breakpoints.mobile).toBe('480px');
    expect(breakpoints.tablet).toBe('768px');
    expect(breakpoints.desktop).toBe('1024px');
  });
});

describe('auth query key', () => {
  it('uses the login query key from the contract', () => {
    expect(AUTH_QUERY_KEY).toEqual(['auth', 'login']);
  });

  it('maps auth errors to user-friendly messages', () => {
    expect(getAuthErrorMessage(new ApiError('Invalid credentials.', 401))).toBe(
      'Invalid credentials.',
    );
    expect(getAuthErrorMessage(new ApiError('Request failed.', 0))).toBe(
      'Unable to sign in. Check your connection and try again.',
    );
    expect(getAuthErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Unable to sign in. Check your connection and try again.',
    );
  });
});

describe('dashboard query key', () => {
  it('uses a stable dashboard query key', () => {
    expect(DASHBOARD_QUERY_KEY).toEqual(['dashboard']);
  });
});

describe('admin routes', () => {
  it('registers the login route in admin public navigation', () => {
    expect(adminPaths.login).toBe('/admin/login');
    expect(adminPublicNavigation.map((item) => item.to)).toContain(
      adminPaths.login,
    );
  });

  it('registers the dashboard route in admin navigation', () => {
    expect(adminPaths.dashboard).toBe('/admin/dashboard');
    expect(adminNavigation.map((item) => item.to)).toContain(
      adminPaths.dashboard,
    );
  });

  it('registers core module routes for super admin navigation', () => {
    expect(adminCoreModules.map((item) => item.to)).toEqual([
      adminPaths.organizations,
      adminPaths.coaches,
      adminPaths.players,
      adminPaths.sessions,
      adminPaths.subscriptions,
    ]);
    expect(adminNavigation.length).toBe(adminCoreModules.length + 1);
  });
});

describe('login validation', () => {
  it('requires email and password', () => {
    expect(validateLoginCredentials({ email: '', password: '' })).toEqual({
      email: 'Email is required.',
      password: 'Password is required.',
    });
  });

  it('validates email format', () => {
    expect(
      validateLoginCredentials({ email: 'invalid', password: 'secret' }),
    ).toEqual({
      email: 'Enter a valid email address.',
    });
  });
});

describe('api client', () => {
  it('falls back to /api when env is unset', () => {
    expect(getApiBaseUrl()).toMatch(/\/api$/);
  });
});

describe('dashboard metrics', () => {
  it('defines the six required super admin metrics', () => {
    expect(DASHBOARD_METRIC_DEFINITIONS.map((metric) => metric.label)).toEqual([
      'Total Organizations',
      'Total Coaches',
      'Total Players',
      'Total Sessions',
      'Active Subscriptions',
      'Revenue Overview',
    ]);
  });

  it('orders metrics and formats revenue values', () => {
    const ordered = orderDashboardMetrics({
      updated_at: '2026-08-21T00:00:00.000Z',
      metrics: [
        { key: 'total_players', label: 'Total Players', value: 1200 },
        { key: 'revenue_overview', label: 'Revenue Overview', value: 54000 },
      ],
    });

    expect(ordered).toHaveLength(6);
    expect(ordered.find((metric) => metric.key === 'total_players')?.value).toBe(
      1200,
    );
    expect(
      formatMetricValue({
        key: 'revenue_overview',
        label: 'Revenue Overview',
        value: 54000,
      }),
    ).toBe('$54,000');
    expect(hasAnyMetricValues(ordered)).toBe(true);
  });
});

describe('dashboard date range', () => {
  it('creates a default 30-day reporting window', () => {
    const range = getDefaultDateRange(new Date('2026-08-21T12:00:00.000Z'));

    expect(range.endDate).toBe('2026-08-21');
    expect(range.startDate).toBe('2026-07-23');
  });

  it('validates start and end dates', () => {
    expect(
      validateDateRange({ startDate: '2026-08-22', endDate: '2026-08-21' }),
    ).toEqual({
      isValid: false,
      error: 'Start date must be on or before the end date.',
    });
  });

  it('formats a readable reporting period label', () => {
    expect(
      formatDateRangeLabel({
        startDate: '2026-07-01',
        endDate: '2026-08-21',
      }),
    ).toBe('Jul 1, 2026 – Aug 21, 2026');
  });
});

describe('dashboard export', () => {
  it('builds a csv export with metric rows', () => {
    const csv = buildDashboardCsv(
      {
        updated_at: '2026-08-21T00:00:00.000Z',
        metrics: [
          { key: 'total_coaches', label: 'Total Coaches', value: 42 },
          { key: 'revenue_overview', label: 'Revenue Overview', value: 9000 },
        ],
      },
      {
        startDate: '2026-07-01',
        endDate: '2026-08-21',
      },
      new Date('2026-08-21T12:00:00.000Z'),
    );

    expect(csv).toContain('Reporting period,"Jul 1, 2026 – Aug 21, 2026"');
    expect(csv).toContain('Total Coaches,42');
    expect(csv).toContain('Revenue Overview,"$9,000"');
  });
});
