import { describe, expect, it } from 'vitest';

import { isAdminRole } from '@/types/auth';

describe('isAdminRole', () => {
  it('allows super admin, admin, and organization admin', () => {
    expect(isAdminRole('super_admin')).toBe(true);
    expect(isAdminRole('admin')).toBe(true);
    expect(isAdminRole('organization_admin')).toBe(true);
  });

  it('rejects coach and player roles', () => {
    expect(isAdminRole('coach')).toBe(false);
    expect(isAdminRole('player')).toBe(false);
  });
});
