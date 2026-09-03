import { getToken } from '@/lib/auth/token-storage';
import { isAdminRole, type AuthUser } from '@/types/auth';

export function hasAdminSession(
  user: AuthUser | null,
  isAuthenticated: boolean,
  isHydrating: boolean,
): boolean {
  return (
    !isHydrating &&
    isAuthenticated &&
    Boolean(getToken()) &&
    Boolean(user && isAdminRole(user.role))
  );
}

export function isProtectedAdminPath(pathname: string): boolean {
  return (
    pathname.startsWith('/admin') &&
    pathname !== '/admin/login' &&
    pathname !== '/admin/unauthorized'
  );
}
