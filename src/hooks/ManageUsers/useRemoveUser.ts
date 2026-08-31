import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/services/users";
import { USERS_QUERY_KEY } from "@/hooks/ManageUsers/useUsers";
import { toast } from "sonner";
import { ApiClientError } from "@/types/api";

export function useRemoveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success(response.message || "User removed successfully");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Failed to remove user";
      toast.error(message);
    },
  });
}
