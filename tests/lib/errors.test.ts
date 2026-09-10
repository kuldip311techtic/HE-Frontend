import { describe, expect, it } from 'vitest';
import { ApiError, getApiErrorMessage, getApiFieldErrors, getDuplicateEmailMessage, parseErrorBody } from '@/lib/api/errors';

describe('parseErrorBody', () => {
  it('reads nested error.message from the live envelope', () => {
    const body = parseErrorBody({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
    });
    expect(body?.error).toEqual({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
      details: undefined,
    });
  });
});

describe('getApiErrorMessage', () => {
  it('prefers nested error.message over session copy on login 401', () => {
    const err = new ApiError('Request failed', 401, {
      error: { code: 'INVALID_TOKEN', message: 'Invalid email or password.' },
    });
    expect(getApiErrorMessage(err, 'Unable to sign in. Please try again.', { isLogin: true })).toBe(
      'Invalid email or password.',
    );
  });

  it('maps authenticated 401 to session expired copy', () => {
    const err = new ApiError('Request failed', 401, {
      error: { code: 'INVALID_TOKEN', message: 'Token expired' },
    });
    expect(getApiErrorMessage(err)).toBe('Your session may have expired. Please sign in again.');
  });

  it('maps network failures to a connection message', () => {
    expect(getApiErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Unable to connect. Please check your connection.',
    );
  });
});

describe('getApiFieldErrors', () => {
  it('reads nested error.details field messages', () => {
    const err = new ApiError('Conflict', 409, {
      error: {
        code: 'EMAIL_EXISTS',
        message: 'Email already exists.',
        details: [{ field: 'email', message: 'This email is already in use.' }],
      },
    });
    expect(getApiFieldErrors(err)).toEqual({ email: 'This email is already in use.' });
  });
});

describe('getDuplicateEmailMessage', () => {
  it('maps HTTP 409 without an email phrase to a user-safe duplicate message', () => {
    const err = new ApiError('Conflict', 409, {
      error: { code: 'CONFLICT', message: 'Conflict' },
    });
    expect(getDuplicateEmailMessage(err)).toBe('This email is already in use.');
  });
});
