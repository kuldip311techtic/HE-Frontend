import { describe, expect, it } from 'vitest';
import { contractPathToClientPath } from '@/lib/api/endpoints';

describe('contractPathToClientPath', () => {
  it('strips /api prefix when base URL ends with /api', () => {
    expect(contractPathToClientPath('/api/v1/super-admin/dashboard')).toBe(
      '/v1/super-admin/dashboard',
    );
    expect(contractPathToClientPath('/api/v1/auth/login')).toBe('/v1/auth/login');
  });

  it('returns path unchanged when it does not start with /api/', () => {
    expect(contractPathToClientPath('/sessions/{session_id}')).toBe('/sessions/{session_id}');
  });

  it('maps locked organization update/delete ticket paths for /api baseURL', () => {
    expect(contractPathToClientPath('/api/super-admin/organizations/{id}')).toBe(
      '/super-admin/organizations/{id}',
    );
  });
});
