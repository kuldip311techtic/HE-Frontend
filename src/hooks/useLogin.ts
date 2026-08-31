import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login } from "@/services/auth";
import type { LoginRequest } from "@/types/auth";
import { ApiClientError } from "@/types/api";

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: () => {
      void navigate({ to: "/super-admin/dashboard" });
    },
  });
}

export function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Login failed. Please check your credentials and try again.";
}
