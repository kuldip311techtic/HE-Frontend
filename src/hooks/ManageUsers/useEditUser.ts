import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/users";
import { USERS_QUERY_KEY } from "@/hooks/ManageUsers/useUsers";
import type { UpdateUserRequest } from "@/types/users";
import { toast } from "sonner";
import { ApiClientError } from "@/types/api";

interface EditUserParams {
  userId: string;
  data: UpdateUserRequest;
}

export function useEditUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: EditUserParams) => updateUser(userId, data),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success(response.message || "User updated successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Failed to update user";
      toast.error(message);
    },
  });
}
