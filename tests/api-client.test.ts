import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { apiClient } from '@/lib/api/client';
import { clearAuthStorage, setToken } from '@/lib/auth/token-storage';

describe('apiClient', () => {
  beforeEach(() => {
    clearAuthStorage();
  });

  afterEach(() => {
    clearAuthStorage();
  });

  it('reads base URL from environment', () => {
    expect(apiClient.defaults.baseURL).toBeTruthy();
  });

  it('attaches Authorization header when a token is stored', async () => {
    setToken('demo-token-super_admin');
    let capturedAuth: string | undefined;

    await apiClient.get('/v1/health', {
      adapter: async (config) => {
        capturedAuth = config.headers?.Authorization as string | undefined;
        return {
          data: { status: 'ok' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      },
    });

    expect(capturedAuth).toBe('Bearer demo-token-super_admin');
  });
});
