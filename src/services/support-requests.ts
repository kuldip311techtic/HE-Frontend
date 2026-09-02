import { apiRequest, unwrapList } from "@/services/api-client";
import type {
  CloseSupportRequestBody,
  RespondSupportRequestBody,
  SupportRequest,
  SupportRequestsListResponse,
} from "@/types/super-admin";

function unwrapSupportRequests(
  response: SupportRequestsListResponse | SupportRequest[]
): SupportRequest[] {
  if (Array.isArray(response)) {
    return response;
  }

  for (const key of ["items", "data", "results"] as const) {
    const list = unwrapList<SupportRequest>(
      response as Record<string, unknown>,
      key
    );
    if (list.length > 0) {
      return list;
    }
  }

  return (
    response.items ??
    response.data ??
    response.results ??
    []
  );
}

export async function listSupportRequests(): Promise<SupportRequest[]> {
  const response = await apiRequest<
    SupportRequestsListResponse | SupportRequest[]
  >("/api/super-admin/support-requests", {
    method: "GET",
  });
  return unwrapSupportRequests(response);
}

export async function respondToSupportRequest(
  data: RespondSupportRequestBody
): Promise<SupportRequest> {
  return apiRequest<SupportRequest>("/api/super-admin/support-requests", {
    method: "POST",
    body: data,
  });
}

export async function closeSupportRequest(
  id: string,
  data: CloseSupportRequestBody = { status: "closed" }
): Promise<SupportRequest> {
  return apiRequest<SupportRequest>(`/api/super-admin/support-requests/${id}`, {
    method: "PUT",
    body: data,
  });
}
