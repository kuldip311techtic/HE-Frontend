import { describe, expect, it } from 'vitest';
import { isAdminRole, canAccessAdmin } from '@/lib/auth/roles';

describe('isAdminRole', () => {
  it('returns true for super_admin', () => {
    expect(isAdminRole('super_admin')).toBe(true);
  });

  it('returns true for admin', () => {
    expect(isAdminRole('admin')).toBe(true);
  });

  it('returns false for coach', () => {
    expect(isAdminRole('coach')).toBe(false);
  });
});

describe('canAccessAdmin', () => {
  it('allows super admin flag', () => {
    expect(
      canAccessAdmin({
        id: '1',
        email: 'a@b.com',
        role: 'coach',
        org_id: null,
        first_name: 'A',
        last_name: 'B',
        is_super_admin: true,
        is_active: true,
      }),
    ).toBe(true);
  });

  it('denies non-admin roles', () => {
    expect(
      canAccessAdmin({
        id: '1',
        email: 'a@b.com',
        role: 'coach',
        org_id: null,
        first_name: 'A',
        last_name: 'B',
        is_super_admin: false,
        is_active: true,
      }),
    ).toBe(false);
  });
});
