import { describe, expect, it } from 'vitest';
import { contractPathToClientPath } from '@/lib/api/endpoints';

describe('contractPathToClientPath', () => {
  it('strips /api prefix when base URL ends with /api', () => {
    expect(contractPathToClientPath('/api/v1/super-admin/dashboard')).toBe(
      '/v1/super-admin/dashboard',
    );
    expect(contractPathToClientPath('/api/super-admin/login')).toBe('/super-admin/login');
    expect(contractPathToClientPath('/api/super-admin/subscriptions')).toBe('/super-admin/subscriptions');
    expect(contractPathToClientPath('/api/super-admin/support-requests')).toBe(
      '/super-admin/support-requests',
    );
  });

  it('returns path unchanged when it does not start with /api/', () => {
    expect(contractPathToClientPath('/sessions/{session_id}')).toBe('/sessions/{session_id}');
  });
});
