import type { OrganizationPayload } from '../../types/organization';

export type OrganizationFieldErrors = Partial<
  Record<keyof OrganizationPayload, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s().-]{7,20}$/;

export function validateOrganizationPayload(
  values: OrganizationPayload,
): OrganizationFieldErrors {
  const errors: OrganizationFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Organization name is required.';
  }

  if (!values.contact_email.trim()) {
    errors.contact_email = 'Contact email is required.';
  } else if (!EMAIL_PATTERN.test(values.contact_email.trim())) {
    errors.contact_email = 'Enter a valid contact email address.';
  }

  if (!values.phone_number.trim()) {
    errors.phone_number = 'Phone number is required.';
  } else if (!PHONE_PATTERN.test(values.phone_number.trim())) {
    errors.phone_number = 'Enter a valid phone number.';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required.';
  }

  return errors;
}

export function emptyOrganizationPayload(): OrganizationPayload {
  return {
    name: '',
    contact_email: '',
    phone_number: '',
    address: '',
  };
}
