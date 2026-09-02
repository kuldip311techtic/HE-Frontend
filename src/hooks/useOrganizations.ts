import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOrganization,
  deleteOrganization,
  getOrganizations,
  updateOrganization,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  ListQueryParams,
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
} from "@/types/api";

export function useOrganizations(params: ListQueryParams) {
  return useQuery({
    queryKey: ["super-admin", "organizations", params],
    queryFn: () => getOrganizations(params),
  });
}

export function useOrganizationMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["super-admin", "organizations"] });

  const createMutation = useMutation({
    mutationFn: (data: OrganizationCreateRequest) => createOrganization(data),
    onSuccess: (response) => {
      invalidate();
      toast.success(response.message || "Organization created successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrganizationUpdateRequest }) =>
      updateOrganization(id, data),
    onSuccess: (response) => {
      invalidate();
      toast.success(response.message || "Changes saved successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: (response) => {
      invalidate();
      toast.success(response.message || "Organization removed successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return { createMutation, updateMutation, deleteMutation };
}
