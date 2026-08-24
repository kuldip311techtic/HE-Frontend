import { describe, expect, it } from 'vitest';
import { validateLoginCredentials } from '../src/lib/auth/validateLogin';

describe('validateLoginCredentials', () => {
  it('requires email and password', () => {
    expect(validateLoginCredentials({ email: '', password: '' })).toEqual({
      email: 'Email is required.',
      password: 'Password is required.',
    });
  });

  it('rejects an invalid email', () => {
    expect(
      validateLoginCredentials({ email: 'not-an-email', password: 'secret' }),
    ).toEqual({
      email: 'Enter a valid email address.',
    });
  });

  it('accepts a valid payload', () => {
    expect(
      validateLoginCredentials({
        email: 'admin@example.com',
        password: 'secret',
      }),
    ).toEqual({});
  });
});
