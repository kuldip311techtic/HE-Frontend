import type { ReactNode } from 'react';
import RoleGate from './RoleGate';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <RoleGate>{children}</RoleGate>;
}
