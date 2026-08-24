import { describe, expect, it } from 'vitest';
import { AxiosError, AxiosHeaders } from 'axios';
import { getApiErrorMessage } from '../src/lib/api/errors';

describe('getApiErrorMessage', () => {
  it('reads detail from the API error envelope', () => {
    const error = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { detail: 'Invalid credentials.' },
      },
    );

    expect(getApiErrorMessage(error, 'Fallback message')).toBe(
      'Invalid credentials.',
    );
  });

  it('falls back when no response is available', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK');

    expect(getApiErrorMessage(error, 'Fallback message')).toBe(
      'Unable to reach the server. Check your connection and try again.',
    );
  });
});
