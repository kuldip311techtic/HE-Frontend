import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '@/context/AuthProvider';
import type { AuthUser, UserRole } from '@/types/auth';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function createDemoUser(role: UserRole): AuthUser {
  return {
    id: 'demo-user',
    email: `${role}@example.com`,
    name: role === 'super_admin' ? 'Super Admin' : role.replace('_', ' '),
    role,
  };
}

export { AuthProvider } from '@/context/AuthProvider';
