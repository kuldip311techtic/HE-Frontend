import { describe, expect, it, vi, beforeEach } from 'vitest';

import { bootstrapValidationSession } from '@/lib/auth/bootstrap-validation-session';
import * as authApi from '@/lib/api/auth';
import * as tokenStorage from '@/lib/auth/token-storage';

vi.mock('@/lib/api/auth', () => ({
  isSuperAdminUser: vi.fn(),
  loginWithEmail: vi.fn(),
  mapUserPublicToAuthUser: vi.fn(),
}));

vi.mock('@/lib/auth/token-storage', () => ({
  getToken: vi.fn(),
  getStoredUser: vi.fn(),
  setToken: vi.fn(),
  setStoredUser: vi.fn(),
}));

describe('bootstrapValidationSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(tokenStorage.getToken).mockReturnValue(null);
    vi.mocked(tokenStorage.getStoredUser).mockReturnValue(null);
  });

  it('returns stored user when token and user already exist', async () => {
    const storedUser = {
      id: '1',
      email: 'admin@example.com',
      name: 'Super Admin',
      role: 'super_admin' as const,
    };
    vi.mocked(tokenStorage.getToken).mockReturnValue('existing-token');
    vi.mocked(tokenStorage.getStoredUser).mockReturnValue(storedUser);

    await expect(bootstrapValidationSession()).resolves.toEqual(storedUser);
    expect(authApi.loginWithEmail).not.toHaveBeenCalled();
  });

  it('logs in with validation env credentials and persists session', async () => {
    const loginResponse = {
      access_token: 'fresh-token',
      token_type: 'bearer',
      expires_in_hours: 24,
      user: {
        id: '1',
        email: 'admin@example.com',
        role: 'super_admin' as const,
        is_super_admin: true,
        is_active: true,
        org_id: null,
        first_name: 'Super',
        last_name: 'Admin',
        last_sign_in_at: null,
      },
    };
    const authUser = {
      id: '1',
      email: 'admin@example.com',
      name: 'Super Admin',
      role: 'super_admin' as const,
      isSuperAdmin: true,
    };

    vi.mocked(authApi.loginWithEmail).mockResolvedValue(loginResponse);
    vi.mocked(authApi.isSuperAdminUser).mockReturnValue(true);
    vi.mocked(authApi.mapUserPublicToAuthUser).mockReturnValue(authUser);

    await expect(bootstrapValidationSession()).resolves.toEqual(authUser);
    expect(authApi.loginWithEmail).toHaveBeenCalledWith({
      email: 'admin@example.com',
      password: 'ChangeMe1!',
    });
    expect(tokenStorage.setToken).toHaveBeenCalledWith('fresh-token');
    expect(tokenStorage.setStoredUser).toHaveBeenCalledWith(authUser);
  });
});
