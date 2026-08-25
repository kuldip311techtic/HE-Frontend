import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { ApiClientError } from "@/services/api-client";
import { loginSuperAdmin } from "@/services/super-admin-auth";
import type { LoginCredentials } from "@/types/auth";

export const LOGIN_QUERY_KEY = queryKeys.superAdmin.login;

export function useLogin() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationKey: LOGIN_QUERY_KEY,
    mutationFn: (credentials: LoginCredentials) => loginSuperAdmin(credentials),
    onSuccess: (response) => {
      toast.success(response.message || "Login successful");
      const redirectTo =
        response.data?.redirect_to || "/super-admin/dashboard";
      navigate(redirectTo, { replace: true });
    },
    onError: (error: Error) => {
      if (error instanceof ApiClientError) {
        return;
      }
      toast.error("Unable to sign in. Please try again.");
    },
  });

  const loginError =
    mutation.error instanceof ApiClientError
      ? mutation.error.message
      : mutation.error?.message ?? null;

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: loginError,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}
