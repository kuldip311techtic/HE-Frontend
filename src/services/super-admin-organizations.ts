import { apiRequest, unwrapListResponse } from "@/services/api-client";
import type {
  CreateOrganizationRequest,
  Organization,
  OrganizationListData,
  OrganizationListParams,
  OrganizationMutationResponse,
  OrganizationPagination,
  UpdateOrganizationRequest,
} from "@/types/organization";

const SUPER_ADMIN_ORGANIZATIONS_PATH = "/api/v1/super-admin/organizations";
const ORGANIZATION_BY_ID_PATH =
  "/api/v1/super-admin/organizations/{organization_id}";
const ORGANIZATIONS_LIST_UNWRAP_KEY = "items" as const;

function resolveOrganizationByIdPath(organization_id: string): string {
  return ORGANIZATION_BY_ID_PATH.replace("{organization_id}", organization_id);
}

function buildOrganizationsPath(params: OrganizationListParams = {}): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.page_size !== undefined) {
    searchParams.set("page_size", String(params.page_size));
  }

  const query = searchParams.toString();
  return query
    ? `${SUPER_ADMIN_ORGANIZATIONS_PATH}?${query}`
    : SUPER_ADMIN_ORGANIZATIONS_PATH;
}

function buildPagination(
  items: Organization[],
  raw: Record<string, unknown>,
): OrganizationPagination {
  const pagination = raw.pagination as OrganizationPagination | undefined;

  if (pagination) {
    return pagination;
  }

  const page = typeof raw.page === "number" ? raw.page : 1;
  const pageSize =
    typeof raw.page_size === "number"
      ? raw.page_size
      : typeof raw.limit === "number"
        ? raw.limit
        : items.length || 10;
  const total = typeof raw.total === "number" ? raw.total : items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    page,
    page_size: pageSize,
    total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
}

function normalizeOrganizationListData(
  raw: Record<string, unknown>,
): OrganizationListData {
  const items = Array.isArray(raw.items) ? (raw.items as Organization[]) : [];

  return {
    items,
    pagination: buildPagination(items, raw),
  };
}

export async function fetchOrganizations(
  params: OrganizationListParams = {},
): Promise<OrganizationListData> {
  const response = await apiRequest<unknown>(buildOrganizationsPath(params), {
    method: "GET",
    auth: true,
  });

  const unwrapped = unwrapListResponse<Record<string, unknown>>(
    response,
    ORGANIZATIONS_LIST_UNWRAP_KEY,
  );

  return normalizeOrganizationListData(unwrapped);
}

export async function createOrganization(
  payload: CreateOrganizationRequest,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(
    SUPER_ADMIN_ORGANIZATIONS_PATH,
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );
}

export async function updateOrganization(
  organization_id: string,
  payload: UpdateOrganizationRequest,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(
    resolveOrganizationByIdPath(organization_id),
    {
      method: "PUT",
      body: payload,
      auth: true,
    },
  );
}

export async function deleteOrganization(
  organization_id: string,
): Promise<OrganizationMutationResponse> {
  return apiRequest<OrganizationMutationResponse>(
    resolveOrganizationByIdPath(organization_id),
    {
      method: "DELETE",
      auth: true,
    },
  );
}
