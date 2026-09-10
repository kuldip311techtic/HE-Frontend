import { describe, expect, it } from 'vitest';
import { normalizeLoginResponse } from '@/lib/auth/normalizeLoginResponse';

describe('normalizeLoginResponse', () => {
  it('maps token field to AdminSession', () => {
    const session = normalizeLoginResponse(
      { token: 'abc123', role: 'super_admin', email: 'a@b.com', name: 'Admin' },
      'fallback@b.com',
    );
    expect(session.token).toBe('abc123');
    expect(session.email).toBe('a@b.com');
    expect(session.role).toBe('super_admin');
  });

  it('accepts access_token alias', () => {
    const session = normalizeLoginResponse({ access_token: 'xyz' }, 'user@test.com');
    expect(session.token).toBe('xyz');
    expect(session.email).toBe('user@test.com');
  });

  it('throws when token is missing', () => {
    expect(() => normalizeLoginResponse({}, 'user@test.com')).toThrow(/missing authentication token/i);
  });
});
