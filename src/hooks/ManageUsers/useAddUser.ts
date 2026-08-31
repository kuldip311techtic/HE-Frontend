import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/services/users";
import { USERS_QUERY_KEY } from "@/hooks/ManageUsers/useUsers";
import type { CreateUserRequest } from "@/types/users";
import { toast } from "sonner";
import { ApiClientError } from "@/types/api";

export function useAddUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success(response.message || "User created successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Failed to create user";
      toast.error(message);
    },
  });
}
