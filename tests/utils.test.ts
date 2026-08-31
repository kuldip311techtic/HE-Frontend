import { describe, expect, it } from 'vitest';
import { buildApiUrl } from '@/lib/api/client';
import { hasAdminAccess, isAdminRole, formatNumber } from '@/lib/utils';

describe('lib/utils', () => {
  it('identifies admin roles correctly', () => {
    expect(isAdminRole('admin')).toBe(true);
    expect(isAdminRole('super_admin')).toBe(true);
    expect(isAdminRole('Super Admin')).toBe(true);
    expect(isAdminRole('coach')).toBe(false);
  });

  it('checks admin access from role list', () => {
    expect(hasAdminAccess(['coach', 'super_admin'])).toBe(true);
    expect(hasAdminAccess(['player'])).toBe(false);
  });

  it('formats numbers with locale grouping', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('buildApiUrl', () => {
  it('joins contract paths to base URL without duplicating /api', () => {
    expect(buildApiUrl('/api/v1/super-admin/dashboard')).toContain(
      '/v1/super-admin/dashboard',
    );
  });
});
