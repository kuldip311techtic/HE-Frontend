import { apiRequest } from "@/services/api-client";
import type {
  RespondSupportRequestPayload,
  SupportRequestListData,
  SupportRequestMutationResponse,
} from "@/types/support-request";

const SUPER_ADMIN_SUPPORT_REQUESTS_PATH = "/api/super-admin/support-requests";
const SUPPORT_REQUEST_BY_ID_PATH = "/api/super-admin/support-requests/{id}";
const SUPPORT_REQUESTS_LIST_UNWRAP_KEY = "data" as const;

function resolveSupportRequestByIdPath(id: string): string {
  return SUPPORT_REQUEST_BY_ID_PATH.replace("{id}", id);
}

function normalizeListData(
  data: SupportRequestListData | SupportRequestListData["items"],
): SupportRequestListData {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
    };
  }

  if (data && typeof data === "object") {
    const record = data as unknown as Record<string, unknown>;
    const items =
      (Array.isArray(record.items) ? record.items : undefined) ??
      (Array.isArray(record.data) ? record.data : undefined) ??
      (Array.isArray(record.results) ? record.results : undefined) ??
      [];

    const total =
      typeof record.total === "number" ? record.total : items.length;

    return {
      items: items as SupportRequestListData["items"],
      total,
    };
  }

  return {
    items: [],
    total: 0,
  };
}

export async function fetchSupportRequests(): Promise<SupportRequestListData> {
  const response = await apiRequest<unknown>(SUPER_ADMIN_SUPPORT_REQUESTS_PATH, {
    method: "GET",
    auth: true,
  });

  const record =
    typeof response === "object" && response !== null
      ? (response as Record<string, unknown>)
      : {};

  const listBody = (record[SUPPORT_REQUESTS_LIST_UNWRAP_KEY] ??
    response) as SupportRequestListData | SupportRequestListData["items"];

  return normalizeListData(listBody);
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
    resolveSupportRequestByIdPath(id),
    {
      method: "PUT",
      auth: true,
    },
  );
}
