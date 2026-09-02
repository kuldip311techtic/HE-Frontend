import { createContext } from 'react';
import type { AuthSession, AuthUser } from '@/types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  setDemoAdminSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const DEMO_ADMIN_USER: AuthUser = {
  id: 'demo-admin-1',
  email: 'admin@hoopsengine.com',
  firstName: 'Alex',
  lastName: 'Morgan',
  name: 'Alex Morgan',
  role: 'organization_admin',
  roles: ['organization_admin'],
};
