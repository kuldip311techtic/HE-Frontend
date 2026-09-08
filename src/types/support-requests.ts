import type { PaginationMeta } from '@/types/api';

export type SupportRequestStatus = 'open' | 'closed' | 'pending' | string;

export interface SupportRequestAttachment {
  original_name: string;
  content_type?: string | null;
  size_bytes: number;
  download_url: string;
}

export interface SupportRequestItem {
  id: string;
  request_id?: string;
  name?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  email?: string | null;
  status?: SupportRequestStatus;
  subject?: string | null;
  message?: string | null;
  inquiry?: string | null;
  response?: string | null;
  created_at: string;
  updated_at?: string | null;
  attachment?: SupportRequestAttachment | null;
}

export interface SupportRequestListResponse {
  items: SupportRequestItem[];
  pagination: PaginationMeta;
}

export interface SupportRequestListParams {
  page?: number;
  page_size?: number;
  search?: string | null;
}

export interface SupportRequestRespondRequest {
  request_id: string;
  response: string;
}

export interface SupportRequestMutationResponse extends SupportRequestItem {
  message: string;
}

export function displaySupportRequestUser(request: SupportRequestItem): string {
  if (request.name?.trim()) {
    return request.name.trim();
  }
  if (request.user_name?.trim()) {
    return request.user_name.trim();
  }
  return request.user_email?.trim() || request.email?.trim() || 'Unknown user';
}

export function displaySupportRequestMessage(request: SupportRequestItem): string {
  return request.message?.trim() || request.inquiry?.trim() || request.subject?.trim() || '—';
}

export function isSupportRequestClosed(request: SupportRequestItem): boolean {
  return (request.status ?? '').toLowerCase() === 'closed';
}

export function resolveSupportRequestId(request: SupportRequestItem): string {
  return request.request_id ?? request.id;
}
