import { apiRequest } from "@/services/api-client";
import type {
  RespondSupportRequestPayload,
  SupportRequestListData,
  SupportRequestListResponse,
  SupportRequestMutationResponse,
} from "@/types/support-request";

const SUPER_ADMIN_SUPPORT_REQUESTS_PATH = "/api/super-admin/support-requests";

function normalizeListData(
  data: SupportRequestListResponse["data"],
): SupportRequestListData {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
    };
  }

  return {
    items: data.items ?? [],
    total: data.total ?? data.items?.length ?? 0,
  };
}

export async function fetchSupportRequests(): Promise<SupportRequestListData> {
  const response = await apiRequest<SupportRequestListResponse>(
    SUPER_ADMIN_SUPPORT_REQUESTS_PATH,
    {
      method: "GET",
      auth: true,
    },
  );

  return normalizeListData(response.data);
}

export async function respondToSupportRequest(
  payload: RespondSupportRequestPayload,
): Promise<SupportRequestMutationResponse> {
  return apiRequest<SupportRequestMutationResponse>(
    SUPER_ADMIN_SUPPORT_REQUESTS_PATH,
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );
}

export async function closeSupportRequest(
  id: string,
): Promise<SupportRequestMutationResponse> {
  return apiRequest<SupportRequestMutationResponse>(
    `/api/super-admin/support-requests/${id}`,
    {
      method: "PUT",
      auth: true,
    },
  );
}
