import axios from 'axios';
import apiClient from '@/lib/api/client';
import type { ErrorResponse } from '@/types/api';
import type {
  RespondToSupportRequestRequest,
  SupportRequestListResponse,
  SupportRequestMutationResponse,
} from '@/types/support-request';

const SUPPORT_REQUESTS_PATH = '/super-admin/support-requests';

export async function fetchSupportRequests(): Promise<
  SupportRequestListResponse['data']
> {
  const { data } =
    await apiClient.get<SupportRequestListResponse>(SUPPORT_REQUESTS_PATH);

  if (!data.success) {
    throw new Error(data.message || 'Failed to load support requests.');
  }

  return data.data;
}

export async function respondToSupportRequest(
  payload: RespondToSupportRequestRequest,
): Promise<SupportRequestMutationResponse> {
  const { data } = await apiClient.post<SupportRequestMutationResponse>(
    SUPPORT_REQUESTS_PATH,
    payload,
  );

  if (!data.success) {
    throw new Error(data.message || 'Failed to respond to support request.');
  }

  return data;
}

export async function closeSupportRequest(
  id: string,
): Promise<SupportRequestMutationResponse> {
  const { data } = await apiClient.put<SupportRequestMutationResponse>(
    `${SUPPORT_REQUESTS_PATH}/${id}`,
    {},
  );

  if (!data.success) {
    throw new Error(data.message || 'Failed to close support request.');
  }

  return data;
}

export function getSupportRequestErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Check your connection and try again.';
    }

    return (
      error.response.data?.message ?? 'Something went wrong. Please try again.'
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
