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
  UpdateOrganizationRequest,
} from "@/types/organization";

export function useOrganizations() {
  return useQuery({
    queryKey: queryKeys.superAdmin.organizations,
    queryFn: fetchOrganizations,
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
        queryKey: queryKeys.superAdmin.organizations,
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
        queryKey: queryKeys.superAdmin.organizations,
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
        queryKey: queryKeys.superAdmin.organizations,
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
