import type { PaginationMeta } from '@/types/api';

export interface SupportRequestItem {
  id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  created_at: string;
  attachment?: unknown | null;
}

export interface SupportRequestListResponse {
  items: SupportRequestItem[];
  pagination?: PaginationMeta;
}

export interface SupportRequestListParams {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface SupportRespondRequest {
  request_id: string;
  response: string;
}

export interface SupportRespondResponse {
  message?: string;
}

export interface SupportCloseResponse {
  message?: string;
}
