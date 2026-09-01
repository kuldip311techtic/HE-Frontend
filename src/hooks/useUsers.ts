import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { ApiClientError } from "@/services/api-client";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/services/super-admin-users";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
} from "@/types/user";

const DEFAULT_PAGE_SIZE = 10;

export function useUsers(
  params: UserListParams = { page: 1, page_size: DEFAULT_PAGE_SIZE },
) {
  const page = params.page ?? 1;
  const pageSize = params.page_size ?? DEFAULT_PAGE_SIZE;

  return useQuery({
    queryKey: queryKeys.superAdmin.users(page, pageSize),
    queryFn: () => fetchUsers({ page, page_size: pageSize }),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => createUser(payload),
    onSuccess: (response) => {
      toast.success(response.message || "User created successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "users"],
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to create user. Please try again.");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserRequest;
    }) => updateUser(id, payload),
    onSuccess: (response) => {
      toast.success(response.message || "User updated successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "users"],
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to update user. Please try again.");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: (response) => {
      toast.success(response.message || "User removed successfully.");
      void queryClient.invalidateQueries({
        queryKey: ["super-admin", "users"],
      });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message);
        return;
      }
      toast.error("Unable to remove user. Please try again.");
    },
  });
}

export { DEFAULT_PAGE_SIZE };
