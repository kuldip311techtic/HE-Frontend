import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSuperAdminUser,
  deleteSuperAdminUser,
  getSuperAdminUsers,
  updateSuperAdminUser,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { useSuperAdminQueryEnabled } from "@/hooks/useSuperAdminQueryEnabled";
import type {
  AdminUserCreateRequest,
  AdminUserUpdateRequest,
  ListQueryParams,
} from "@/types/api";

export function useSuperAdminUsers(params: ListQueryParams) {
  const enabled = useSuperAdminQueryEnabled();

  return useQuery({
    queryKey: ["super-admin", "users", params],
    queryFn: () => getSuperAdminUsers(params),
    enabled,
  });
}

export function useSuperAdminUserMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });

  const createMutation = useMutation({
    mutationFn: (data: AdminUserCreateRequest) => createSuperAdminUser(data),
    onSuccess: (response) => {
      invalidate();
      toast.success(response.message || "User created successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUserUpdateRequest }) =>
      updateSuperAdminUser(id, data),
    onSuccess: (response) => {
      invalidate();
      toast.success(response.message || "Changes saved successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSuperAdminUser(id),
    onSuccess: (response) => {
      invalidate();
      toast.success(response.message || "User removed successfully.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });

  return { createMutation, updateMutation, deleteMutation };
}
