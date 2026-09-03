import { useAuth } from "@/hooks/useAuth";
import { getStoredToken, isDemoAuthToken, isValidationAuthToken } from "@/lib/auth/storage";

/** True when the user is authenticated with a non-demo token suitable for live API calls. */
export function useHasLiveApiAccess(): boolean {
  const { isAuthenticated, hasAdminAccess, isLoading } = useAuth();
  const token = getStoredToken();

  if (isLoading) return false;

  if (isValidationAuthToken()) {
    return false;
  }

  return (
    isAuthenticated &&
    hasAdminAccess &&
    Boolean(token) &&
    !isDemoAuthToken()
  );
}
