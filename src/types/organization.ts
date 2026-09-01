export interface Organization {
  id: string;
  name: string;
  organization: string;
  contact_email: string;
  email: string;
  phone_number: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  join_code?: string | null;
  is_active?: boolean;
  is_published?: boolean;
  created_at: string | null;
  updated_at?: string;
}

export interface OrganizationPagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface OrganizationListData {
  items: Organization[];
  pagination: OrganizationPagination;
}

export interface OrganizationListResponse {
  success: boolean;
  message: string;
  description: string;
  data: OrganizationListData;
}

export interface OrganizationListOpenApiResponse {
  items: Organization[];
  pagination: OrganizationPagination;
}

export interface OrganizationListParams {
  page?: number;
  page_size?: number;
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
