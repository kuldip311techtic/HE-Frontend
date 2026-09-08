import { describe, expect, it } from 'vitest';
import { getRoleLabel, isAdminRole } from '@/lib/auth/roles';
import type { AuthUser } from '@/types/auth';

function makeUser(overrides: Partial<AuthUser>): AuthUser {
  return {
    id: 'user-1',
    email: 'admin@example.com',
    role: 'coach',
    org_id: null,
    first_name: 'Test',
    last_name: 'User',
    is_super_admin: false,
    is_active: true,
    last_sign_in_at: null,
    ...overrides,
  };
}

describe('isAdminRole', () => {
  it('returns false for null or undefined', () => {
    expect(isAdminRole(null)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });

  it('allows super admin via is_super_admin flag', () => {
    expect(isAdminRole(makeUser({ is_super_admin: true, role: 'coach' }))).toBe(true);
  });

  it('allows admin and super_admin roles', () => {
    expect(isAdminRole(makeUser({ role: 'admin' }))).toBe(true);
    expect(isAdminRole(makeUser({ role: 'super_admin' }))).toBe(true);
    expect(isAdminRole(makeUser({ role: 'super-admin' }))).toBe(true);
  });

  it('rejects non-admin roles', () => {
    expect(isAdminRole(makeUser({ role: 'coach' }))).toBe(false);
    expect(isAdminRole(makeUser({ role: 'player' }))).toBe(false);
  });
});

describe('getRoleLabel', () => {
  it('labels super admin users', () => {
    expect(getRoleLabel(makeUser({ is_super_admin: true }))).toBe('Super Admin');
  });

  it('labels admin role', () => {
    expect(getRoleLabel(makeUser({ role: 'admin' }))).toBe('Admin');
  });
});
