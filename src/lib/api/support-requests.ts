import { apiClient } from '@/lib/api/client';
import type {
  SupportRequestCloseResponse,
  SupportRequestItem,
  SupportRequestListParams,
  SupportRequestListResponse,
  SupportRequestRespondRequest,
} from '@/types/api';

export async function fetchSupportRequests(
  params: SupportRequestListParams,
): Promise<SupportRequestListResponse> {
  const { data } = await apiClient.get<SupportRequestListResponse>('/super-admin/support-requests', {
    params,
  });
  return data;
}

export async function respondToSupportRequest(
  body: SupportRequestRespondRequest,
): Promise<SupportRequestItem> {
  const { data } = await apiClient.post<SupportRequestItem>('/super-admin/support-requests', body);
  return data;
}

export async function closeSupportRequest(requestId: string): Promise<SupportRequestCloseResponse> {
  const { data } = await apiClient.put<SupportRequestCloseResponse>(
    `/super-admin/support-requests/${requestId}`,
  );
  return data;
}

export async function downloadSupportRequestAttachment(
  requestId: string,
  filename: string,
): Promise<void> {
  const { data } = await apiClient.get<Blob>(
    `/super-admin/support-requests/${requestId}/attachment`,
    {
      responseType: 'blob',
    },
  );

  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function formatSupportRequestDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function formatAttachmentSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const SUPPORT_ACTIONS_PENDING_MESSAGE =
  'Response actions pending backend API (JAW-9605).';
