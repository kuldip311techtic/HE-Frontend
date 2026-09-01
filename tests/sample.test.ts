import { describe, expect, it } from 'vitest';
import { hasAdminAccess, isAdminRole } from '@/lib/auth/roles';
import { cn, formatNumber } from '@/lib/utils';

describe('auth roles', () => {
  it('identifies admin roles correctly', () => {
    expect(isAdminRole('super_admin')).toBe(true);
    expect(isAdminRole('admin')).toBe(true);
    expect(isAdminRole('coach')).toBe(false);
    expect(isAdminRole('player')).toBe(false);
  });

  it('checks admin access from role arrays', () => {
    expect(hasAdminAccess(['coach', 'admin'])).toBe(true);
    expect(hasAdminAccess(['coach', 'player'])).toBe(false);
    expect(hasAdminAccess(['super_admin'])).toBe(true);
  });
});

describe('utils', () => {
  it('merges class names with cn', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
    expect(cn('px-2', undefined, 'py-1')).toBe('px-2 py-1');
  });

  it('formats numbers with locale separators', () => {
    expect(formatNumber(1234)).toBe('1,234');
  });
});
