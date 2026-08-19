import { describe, expect, it } from 'vitest';
import { AUTH_QUERY_KEY } from '../src/hooks/useAuth';
import { colors } from '../src/theme/tokens';
import { breakpoints } from '../src/theme/breakpoints';
import { adminPublicNavigation, paths } from '../src/routes/paths';

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
  it('registers the login route in admin public navigation', () => {
    expect(paths.login).toBe('/admin/login');
    expect(adminPublicNavigation.map((item) => item.to)).toContain(paths.login);
  });
});
