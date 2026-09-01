import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { ApiClientError } from "@/services/api-client";
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
} from "@/services/super-admin-organizations";
import type {
  CreateOrganizationRequest,
  OrganizationListParams,
  UpdateOrganizationRequest,
} from "@/types/organization";

const DEFAULT_PAGE_SIZE = 10;

export function useOrganizations(
  params: OrganizationListParams = { page: 1, page_size: DEFAULT_PAGE_SIZE },
) {
  const page = params.page ?? 1;
  const pageSize = params.page_size ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: queryKeys.superAdmin.organizations(page, pageSize),
    queryFn: () => fetchOrganizations({ page, page_size: pageSize }),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganizationRequest) =>
      createOrganization(payload),
    onSuccess: (response) => {
      toast.success(response.message || "Organization created successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "organizations"],
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to create organization. Please try again.");
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrganizationRequest;
    }) => updateOrganization(id, payload),
    onSuccess: (response) => {
      toast.success(response.message || "Organization updated successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "organizations"],
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to update organization. Please try again.");
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: (response) => {
      toast.success(response.message || "Organization removed successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "organizations"],
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to remove organization. Please try again.");
    },
  });
}

export { DEFAULT_PAGE_SIZE };
