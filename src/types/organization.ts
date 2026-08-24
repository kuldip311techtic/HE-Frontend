export interface Organization {
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface OrganizationPayload {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
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

export const ORGANIZATIONS_API_PATH = '/super-admin/organizations';
