import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSuperAdminUser,
  deleteSuperAdminUser,
  getSuperAdminUsers,
  updateSuperAdminUser,
} from "@/lib/api/services/super-admin";
import type {
  AdminUserCreateRequest,
  AdminUserListParams,
  AdminUserUpdateRequest,
} from "@/types/api";

export function useSuperAdminUsers(params: AdminUserListParams) {
  return useQuery({
    queryKey: ["super-admin", "users", params],
    queryFn: () => getSuperAdminUsers(params),
    retry: false,
  });
}

export function useCreateSuperAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminUserCreateRequest) => createSuperAdminUser(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "users"],
      });
    },
  });
}

export function useUpdateSuperAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      user_id,
      data,
    }: {
      user_id: string;
      data: AdminUserUpdateRequest;
    }) => updateSuperAdminUser(user_id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "users"],
      });
    },
  });
}

export function useDeleteSuperAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user_id: string) => deleteSuperAdminUser(user_id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "users"],
      });
    },
  });
}
