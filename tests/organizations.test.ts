import { describe, expect, it } from 'vitest';

import {
  getOrganizationDisplayName,
  getOrganizationPhone,
} from '@/lib/api/organizations';
import type { OrganizationItem } from '@/types/api';

function buildOrganization(overrides: Partial<OrganizationItem> = {}): OrganizationItem {
  return {
    id: '11111111-2222-3333-4444-555555555555',
    name: 'Acme Sports',
    contact_email: 'contact@acme.com',
    phone_number: '555-0100',
    address: '123 Main St',
    ...overrides,
  };
}

describe('organization helpers', () => {
  it('returns display name from name or organization alias', () => {
    expect(getOrganizationDisplayName(buildOrganization())).toBe('Acme Sports');
    expect(
      getOrganizationDisplayName(
        buildOrganization({ name: '', organization: 'Alias Org' }),
      ),
    ).toBe('Alias Org');
  });

  it('returns phone from phone_number or phone alias', () => {
    expect(getOrganizationPhone(buildOrganization())).toBe('555-0100');
    expect(
      getOrganizationPhone(buildOrganization({ phone_number: null, phone: '555-0200' })),
    ).toBe('555-0200');
    expect(getOrganizationPhone(buildOrganization({ phone_number: null, phone: null }))).toBe('—');
  });
});
