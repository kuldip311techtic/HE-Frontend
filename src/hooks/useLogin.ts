import { useCallback, useState } from "react";

import { ApiClientError } from "@/services/api-client";
import { loginSuperAdmin } from "@/services/auth";
import type { LoginRequest } from "@/types/super-admin";

interface UseLoginResult {
  login: (credentials: LoginRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useLogin(): UseLoginResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await loginSuperAdmin(credentials);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, isLoading, error, clearError };
}
