export interface Organization {
  id: string;
  name: string;
  organization: string;
  contact_email: string;
  email: string;
  phone_number: string;
  phone: string;
  address: string;
  description: string | null;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationListData {
  items: Organization[];
  total: number;
}

export interface OrganizationListResponse {
  success: boolean;
  message: string;
  description: string;
  data: OrganizationListData;
}

export interface CreateOrganizationRequest {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface UpdateOrganizationRequest {
  name?: string | null;
  contact_email?: string | null;
  phone_number?: string | null;
  address?: string | null;
}

export interface OrganizationMutationResponse {
  success: boolean;
  message: string;
  description: string;
  data: Organization;
}

export interface OrganizationFormValues {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}
