import type { PaginationMeta } from '@/types/api';

export type { PaginationMeta };

export interface OrganizationItem {
  id: string;
  name: string;
  organization: string;
  contact_email: string;
  email: string;
  phone_number: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  join_code: string | null;
  created_at: string | null;
}

export interface OrganizationListResponse {
  items: OrganizationItem[];
  pagination: PaginationMeta;
}

export interface OrganizationListParams {
  page?: number;
  page_size?: number;
  search?: string | null;
}

export interface OrganizationCreateRequest {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export type OrganizationUpdateRequest = Partial<OrganizationCreateRequest>;

export interface OrganizationMutationResponse extends OrganizationItem {
  message: string;
}

export interface OrganizationDeleteResponse {
  message: string;
}
