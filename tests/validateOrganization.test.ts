import { describe, expect, it } from 'vitest';
import {
  emptyOrganizationPayload,
  validateOrganizationPayload,
} from '../src/lib/organizations/validateOrganization';

describe('validateOrganizationPayload', () => {
  it('requires name, contact email, phone number, and address', () => {
    const errors = validateOrganizationPayload(emptyOrganizationPayload());

    expect(errors.name).toBe('Organization name is required.');
    expect(errors.contact_email).toBe('Contact email is required.');
    expect(errors.phone_number).toBe('Phone number is required.');
    expect(errors.address).toBe('Address is required.');
  });

  it('validates email and phone formats', () => {
    const errors = validateOrganizationPayload({
      ...emptyOrganizationPayload(),
      name: 'Hoops Academy',
      contact_email: 'invalid-email',
      phone_number: 'abc',
      address: '123 Court Street',
    });

    expect(errors.contact_email).toBe('Enter a valid contact email address.');
    expect(errors.phone_number).toBe('Enter a valid phone number.');
  });

  it('accepts a valid payload', () => {
    const errors = validateOrganizationPayload({
      name: 'Hoops Academy',
      contact_email: 'contact@example.com',
      phone_number: '+1 (555) 382-9102',
      address: '123 Court Street',
    });

    expect(Object.keys(errors)).toHaveLength(0);
  });
});
