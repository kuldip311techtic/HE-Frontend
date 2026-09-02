import { describe, expect, it } from 'vitest';
import { cn, getInitials } from '@/lib/utils';
import { canAccessAdmin, isAdminRole } from '@/lib/auth/roles';

describe('utils', () => {
  it('merges class names with cn', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('extracts initials from a name', () => {
    expect(getInitials('Alex Morgan')).toBe('AM');
  });
});

describe('roles', () => {
  it('identifies admin roles', () => {
    expect(isAdminRole('organization_admin')).toBe(true);
    expect(isAdminRole('super_admin')).toBe(true);
    expect(isAdminRole('coach')).toBe(false);
  });

  it('checks admin access from user roles', () => {
    expect(
      canAccessAdmin({
        role: 'coach',
        roles: ['coach', 'organization_admin'],
      }),
    ).toBe(true);

    expect(
      canAccessAdmin({
        role: 'player',
      }),
    ).toBe(false);
  });
});

describe('getApiErrorMessage', () => {
  it('maps network errors to user-safe messages', async () => {
    const axios = (await import('axios')).default;
    const { getApiErrorMessage } = await import('@/lib/api/errors');
    const error = new axios.AxiosError('Network Error');
    expect(getApiErrorMessage(error)).toBe(
      'Unable to connect. Please check your connection.',
    );
  });
});
