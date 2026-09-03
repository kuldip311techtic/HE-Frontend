import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
} from "@/types/api";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: OrganizationCreateRequest) => createOrganization(body),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "organizations"] });
      toast.success(response.message || "Organization created successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to create organization. Please try again."),
      );
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      body,
    }: {
      organizationId: string;
      body: OrganizationUpdateRequest;
    }) => updateOrganization(organizationId, body),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "organizations"] });
      toast.success(response.message || "Changes saved successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to save changes. Please try again."),
      );
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) => deleteOrganization(organizationId),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "organizations"] });
      toast.success(response.message || "Organization removed successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to remove organization. Please try again."),
      );
    },
  });
}
