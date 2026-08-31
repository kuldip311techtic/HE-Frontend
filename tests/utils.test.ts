import { describe, expect, it } from 'vitest';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { isAdminRole } from '@/types';

describe('formatNumber', () => {
  it('formats integers with locale separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('formatCurrency', () => {
  it('formats values as USD without cents', () => {
    expect(formatCurrency(12500)).toBe('$12,500');
  });
});

describe('isAdminRole', () => {
  it('returns true for super_admin and admin roles', () => {
    expect(isAdminRole('super_admin')).toBe(true);
    expect(isAdminRole('admin')).toBe(true);
  });

  it('returns false for non-admin roles', () => {
    expect(isAdminRole('coach')).toBe(false);
    expect(isAdminRole('player')).toBe(false);
  });
});

describe('API client base URL resolution', () => {
  it('uses the configured Vite env base URL', () => {
    expect(import.meta.env.VITE_API_BASE_URL).toBeDefined();
  });
});
