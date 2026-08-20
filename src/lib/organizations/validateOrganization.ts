import type { OrganizationPayload } from '../../types/organization';

export type OrganizationFieldErrors = Partial<
  Record<keyof OrganizationPayload, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateOrganizationPayload(
  values: OrganizationPayload,
): OrganizationFieldErrors {
  const errors: OrganizationFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Organization name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (values.contact_email.trim() && !EMAIL_PATTERN.test(values.contact_email.trim())) {
    errors.contact_email = 'Enter a valid contact email address.';
  }

  if (!values.status.trim()) {
    errors.status = 'Status is required.';
  }

  return errors;
}

export function emptyOrganizationPayload(): OrganizationPayload {
  return {
    name: '',
    email: '',
    contact_email: '',
    phone_number: '',
    address: '',
    description: '',
    status: 'active',
  };
}

export function organizationToPayload(
  organization: OrganizationPayload & { id?: string },
): OrganizationPayload {
  return {
    name: organization.name,
    email: organization.email,
    contact_email: organization.contact_email,
    phone_number: organization.phone_number,
    address: organization.address,
    description: organization.description,
    status: organization.status,
  };
}
