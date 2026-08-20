import type { UserAddPayload, UserEditPayload } from '../../types/user';

export type UserAddFieldErrors = Partial<
  Record<keyof UserAddPayload, string>
>;

export type UserEditFieldErrors = Partial<
  Record<keyof UserEditPayload, string>
>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateSharedFields(
  values: UserEditPayload,
): UserEditFieldErrors {
  const errors: UserEditFieldErrors = {};

  if (!values.first_name.trim()) {
    errors.first_name = 'First name is required.';
  }

  if (!values.last_name.trim()) {
    errors.last_name = 'Last name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.role.trim()) {
    errors.role = 'Role is required.';
  }

  return errors;
}

export function validateUserAddPayload(
  values: UserAddPayload,
): UserAddFieldErrors {
  const errors: UserAddFieldErrors = validateSharedFields(values);

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  return errors;
}

export function validateUserEditPayload(
  values: UserEditPayload,
): UserEditFieldErrors {
  return validateSharedFields(values);
}

export function emptyUserAddPayload(): UserAddPayload {
  return {
    first_name: '',
    last_name: '',
    name: '',
    email: '',
    role: 'player',
    roles: ['player'],
    password: '',
    status: 'active',
    organization_id: null,
  };
}

export function emptyUserEditPayload(): UserEditPayload {
  return {
    first_name: '',
    last_name: '',
    name: '',
    email: '',
    role: 'player',
    roles: ['player'],
    status: 'active',
    organization_id: null,
  };
}

export function buildUserName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}
