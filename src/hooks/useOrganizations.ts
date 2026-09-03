import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from "@/lib/api/services/super-admin";
import type {
  OrganizationCreateRequest,
  OrganizationListParams,
  OrganizationUpdateRequest,
} from "@/types/api";

export function useOrganizations(params: OrganizationListParams) {
  return useQuery({
    queryKey: ["super-admin", "organizations", params],
    queryFn: () => getOrganizations(params),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OrganizationCreateRequest) => createOrganization(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "organizations"],
      });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organization_id,
      data,
    }: {
      organization_id: string;
      data: OrganizationUpdateRequest;
    }) => updateOrganization(organization_id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "organizations"],
      });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organization_id: string) =>
      deleteOrganization(organization_id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "organizations"],
      });
    },
  });
}
