import { describe, expect, it } from 'vitest';

import {
  canRemoveUser,
  filterCreateRoleOptions,
  getAdminUserRoleLabel,
} from '@/lib/api/users';
import type { AdminUserItem, RoleOption } from '@/types/api';

function buildUser(overrides: Partial<AdminUserItem> = {}): AdminUserItem {
  return {
    id: '11111111-2222-3333-4444-555555555555',
    name: 'John Doe',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    role: 'coach',
    roles: ['coach'],
    is_super_admin: false,
    is_active: true,
    is_self: false,
    ...overrides,
  };
}

const roleOptions: RoleOption[] = [
  { value: 'coach', label: 'Coach', description: 'Coach account' },
  { value: 'player', label: 'Player', description: 'Player account' },
  { value: 'org_admin', label: 'Organization Admin', description: 'Org admin account' },
];

describe('admin user helpers', () => {
  it('returns role labels from API options or fallback mapping', () => {
    expect(getAdminUserRoleLabel('coach', roleOptions)).toBe('Coach');
    expect(getAdminUserRoleLabel('org_admin', roleOptions)).toBe('Organization Admin');
    expect(getAdminUserRoleLabel('super_admin')).toBe('Super Admin');
  });

  it('filters create role options to coach and player', () => {
    expect(filterCreateRoleOptions(roleOptions)).toHaveLength(2);
    expect(filterCreateRoleOptions([])).toEqual([
      { value: 'coach', label: 'Coach', description: 'Coach account' },
      { value: 'player', label: 'Player', description: 'Player account' },
    ]);
  });

  it('blocks remove for self rows and matching auth user id', () => {
    expect(canRemoveUser(buildUser({ is_self: true }))).toBe(false);
    expect(canRemoveUser(buildUser(), '11111111-2222-3333-4444-555555555555')).toBe(false);
    expect(canRemoveUser(buildUser(), '22222222-2222-2222-2222-222222222222')).toBe(true);
  });
});
