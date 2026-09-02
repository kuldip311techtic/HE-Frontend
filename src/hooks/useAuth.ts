import { useContext } from 'react';
import { AuthContext } from '@/hooks/auth-context';
import type { UserRole } from '@/types/auth';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useHasRole(role: UserRole): boolean {
  const { user } = useAuth();
  if (!user) return false;
  const roles = user.roles?.length ? user.roles : [user.role];
  return roles.includes(role);
}
