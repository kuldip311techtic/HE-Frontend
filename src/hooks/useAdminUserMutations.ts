import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
} from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import type {
  AdminUserCreateRequest,
  AdminUserUpdateRequest,
} from "@/types/api";

export function useCreateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AdminUserCreateRequest) => createAdminUser(body),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
      toast.success(response.message || "User created successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to create user. Please try again."),
      );
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      body,
    }: {
      userId: string;
      body: AdminUserUpdateRequest;
    }) => updateAdminUser(userId, body),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
      toast.success(response.message || "Changes saved successfully.");
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, "Unable to save changes. Please try again."),
      );
    },
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: (response) => {
      void queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
      toast.success(response.message || "User removed successfully.");
    },
    onError: (error) => {
      const fallback =
        axios.isAxiosError(error) && error.response?.status === 400
          ? "Unable to remove this user. You cannot delete your own account."
          : "Unable to remove user. Please try again.";
      toast.error(getApiErrorMessage(error, fallback));
    },
  });
}
