import { describe, expect, it } from 'vitest';
import {
  QUICK_ACCESS_STATIC_LINKS,
  getQuickAccessStatus,
  normalizeAdminRoute,
} from '@/lib/navigation/admin-routes';

describe('normalizeAdminRoute', () => {
  it('maps ticket-style link paths to admin routes', () => {
    expect(normalizeAdminRoute('/manage-organizations')).toBe('/admin/organizations');
    expect(normalizeAdminRoute('/manage-users')).toBe('/admin/users');
    expect(normalizeAdminRoute('/subscriptions')).toBe('/admin/subscriptions');
    expect(normalizeAdminRoute('/analytics')).toBe('/admin');
    expect(normalizeAdminRoute('/support-requests')).toBe('/admin/support');
  });

  it('accepts values without a leading slash', () => {
    expect(normalizeAdminRoute('analytics')).toBe('/admin');
  });

  it('returns null for unknown paths', () => {
    expect(normalizeAdminRoute('/unknown-module')).toBeNull();
    expect(normalizeAdminRoute('')).toBeNull();
  });
});

describe('getQuickAccessStatus', () => {
  it('marks implemented admin routes as available', () => {
    expect(getQuickAccessStatus('/admin/organizations')).toBe('available');
    expect(getQuickAccessStatus('/admin/users')).toBe('available');
    expect(getQuickAccessStatus('/admin/subscriptions')).toBe('available');
    expect(getQuickAccessStatus('/admin')).toBe('available');
    expect(getQuickAccessStatus('/admin/support')).toBe('available');
  });

  it('marks unresolved routes as coming soon', () => {
    expect(getQuickAccessStatus(null)).toBe('coming_soon');
    expect(getQuickAccessStatus('/admin/analytics')).toBe('coming_soon');
  });
});

describe('QUICK_ACCESS_STATIC_LINKS', () => {
  it('includes all five required quick access modules', () => {
    const modules = QUICK_ACCESS_STATIC_LINKS.map((item) => item.module);
    expect(modules).toEqual([
      'Manage Organizations',
      'Manage Users',
      'Subscriptions',
      'Analytics',
      'Support Requests',
    ]);
  });
});
