import type { PaginationMeta } from '@/types/pagination';

export interface Organization {
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  join_code: string;
}

export interface OrganizationListResponse {
  items: Organization[];
  pagination?: PaginationMeta;
}

export interface OrganizationWriteRequest {
  name: string;
  contact_email: string;
  phone_number?: string;
  address?: string;
}

export interface OrganizationMutationResponse extends Organization {
  message: string;
}
