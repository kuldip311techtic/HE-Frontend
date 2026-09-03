import { describe, expect, it } from 'vitest';

import { hasAdminSession, isProtectedAdminPath } from '@/lib/auth/admin-session';
import type { AuthUser } from '@/types/auth';

const superAdminUser: AuthUser = {
  id: '11111111-2222-3333-4444-555555555555',
  email: 'admin@example.com',
  name: 'Jane Admin',
  role: 'super_admin',
  isSuperAdmin: true,
};

describe('admin session helpers', () => {
  it('detects protected admin paths', () => {
    expect(isProtectedAdminPath('/admin')).toBe(true);
    expect(isProtectedAdminPath('/admin/users')).toBe(true);
    expect(isProtectedAdminPath('/admin/login')).toBe(false);
    expect(isProtectedAdminPath('/admin/unauthorized')).toBe(false);
  });

  it('requires hydrated authenticated super admin session', () => {
    expect(hasAdminSession(superAdminUser, true, false)).toBe(false);
    expect(hasAdminSession(superAdminUser, false, false)).toBe(false);
    expect(hasAdminSession(null, true, false)).toBe(false);
  });
});
