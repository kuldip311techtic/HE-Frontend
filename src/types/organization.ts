export interface Organization {
  id: string;
  name: string;
  email: string;
  contact_email: string;
  phone_number: string;
  address: string;
  description: string;
  status: string;
}

export interface OrganizationPayload {
  name: string;
  email: string;
  contact_email: string;
  phone_number: string;
  address: string;
  description: string;
  status: string;
}

export interface PaginatedOrganizations {
  items: Organization[];
  total: number;
  page: number;
  page_size: number;
}

export interface DeleteOrganizationResponse {
  success: boolean;
  message: string;
}

export const ORGANIZATION_STATUSES = ['active', 'inactive', 'pending'] as const;

export type OrganizationStatus = (typeof ORGANIZATION_STATUSES)[number];
