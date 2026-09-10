import { describe, expect, it } from 'vitest';
import { isAdminRole } from '@/lib/auth/isAdminRole';

describe('isAdminRole', () => {
  it('returns true for allowed admin roles', () => {
    expect(isAdminRole('super_admin')).toBe(true);
    expect(isAdminRole('admin')).toBe(true);
    expect(isAdminRole('Super Admin')).toBe(true);
    expect(isAdminRole('Admin')).toBe(true);
  });

  it('returns false for non-admin roles', () => {
    expect(isAdminRole('player')).toBe(false);
    expect(isAdminRole('coach')).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});
