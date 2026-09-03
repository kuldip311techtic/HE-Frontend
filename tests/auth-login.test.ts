import { describe, expect, it } from 'vitest';

import {
  isSuperAdminUser,
  mapUserPublicToAuthUser,
  SUPER_ADMIN_ACCESS_DENIED_MESSAGE,
} from '@/lib/api/auth';
import type { UserPublic } from '@/types/api';

function buildUser(overrides: Partial<UserPublic> = {}): UserPublic {
  return {
    id: '11111111-2222-3333-4444-555555555555',
    email: 'admin@example.com',
    role: 'super_admin',
    is_super_admin: true,
    is_active: true,
    first_name: 'Jane',
    last_name: 'Admin',
    ...overrides,
  };
}

describe('auth login helpers', () => {
  describe('isSuperAdminUser', () => {
    it('returns true when role is super_admin', () => {
      expect(isSuperAdminUser(buildUser({ role: 'super_admin', is_super_admin: false }))).toBe(true);
    });

    it('returns true when is_super_admin flag is true', () => {
      expect(isSuperAdminUser(buildUser({ role: 'org_admin', is_super_admin: true }))).toBe(true);
    });

    it('returns false for non-super-admin users', () => {
      expect(isSuperAdminUser(buildUser({ role: 'coach', is_super_admin: false }))).toBe(false);
      expect(isSuperAdminUser(buildUser({ role: 'player', is_super_admin: false }))).toBe(false);
    });
  });

  describe('mapUserPublicToAuthUser', () => {
    it('maps first and last name to display name', () => {
      const authUser = mapUserPublicToAuthUser(buildUser());
      expect(authUser).toEqual({
        id: '11111111-2222-3333-4444-555555555555',
        email: 'admin@example.com',
        name: 'Jane Admin',
        role: 'super_admin',
        isSuperAdmin: true,
      });
    });

    it('falls back to email when name parts are missing', () => {
      const authUser = mapUserPublicToAuthUser(
        buildUser({ first_name: null, last_name: null, email: 'solo@example.com' }),
      );
      expect(authUser.name).toBe('solo@example.com');
    });
  });

  describe('super admin gate message', () => {
    it('uses a user-safe access denied message', () => {
      expect(SUPER_ADMIN_ACCESS_DENIED_MESSAGE).toBe(
        'This account does not have Super Admin access.',
      );
    });
  });
});
