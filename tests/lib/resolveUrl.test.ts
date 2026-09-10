import { describe, expect, it } from 'vitest';
import { resolveUrl } from '@/lib/api/resolveUrl';

const BASE = 'http://localhost:3300/api';

describe('resolveUrl', () => {
  it('joins non-api paths to host root without /api suffix', () => {
    expect(resolveUrl('/super-admin/users', BASE)).toBe('http://localhost:3300/super-admin/users');
  });

  it('joins /api paths to host root', () => {
    expect(resolveUrl('/api/super-admin/dashboard', BASE)).toBe(
      'http://localhost:3300/api/super-admin/dashboard',
    );
  });

  it('handles paths without leading slash', () => {
    expect(resolveUrl('super-admin/organizations', BASE)).toBe(
      'http://localhost:3300/super-admin/organizations',
    );
  });
});
