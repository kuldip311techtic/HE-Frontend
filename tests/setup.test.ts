import { describe, expect, it } from 'vitest';
import { AUTH_QUERY_KEY } from '../src/hooks/useAuth';
import { breakpoints } from '../src/theme/breakpoints';
import { colors } from '../src/theme/tokens';
import { adminNavigation, paths } from '../src/routes/paths';
import { ORGANIZATIONS_API_PATH } from '../src/types/organization';

describe('design tokens', () => {
  it('exposes core brand colors', () => {
    expect(colors.accent).toBe('#EA580C');
    expect(colors.primary).toBe('#0B1A2E');
  });

  it('exposes layout breakpoints', () => {
    expect(breakpoints.mobile).toBe('480px');
    expect(breakpoints.tablet).toBe('768px');
    expect(breakpoints.desktop).toBe('1024px');
  });
});

describe('auth query key', () => {
  it('uses the login query key from the contract', () => {
    expect(AUTH_QUERY_KEY).toEqual(['auth', 'login']);
  });
});

describe('admin routes', () => {
  it('registers manage organizations in admin navigation', () => {
    expect(paths.manageOrganizations).toBe('/super-admin/manage-organizations');
    expect(adminNavigation.map((item) => item.to)).toContain(
      paths.manageOrganizations,
    );
  });

  it('uses the super admin organizations API path', () => {
    expect(ORGANIZATIONS_API_PATH).toBe('/super-admin/organizations');
  });
});
