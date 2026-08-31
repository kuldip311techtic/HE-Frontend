import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  role: string;
  className?: string;
}

function normalizeRoleLabel(role: string): string {
  const normalized = role.toLowerCase();
  if (normalized === 'coach') return 'Coach';
  if (normalized === 'player') return 'Player';
  if (normalized === 'super_admin' || normalized === 'super-admin') return 'Super Admin';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getRoleVariant(role: string): 'default' | 'secondary' | 'outline' {
  const normalized = role.toLowerCase();
  if (normalized === 'coach') return 'default';
  if (normalized === 'player') return 'secondary';
  return 'outline';
}

export function StatusBadge({ role, className }: StatusBadgeProps) {
  return (
    <Badge variant={getRoleVariant(role)} className={cn('capitalize', className)}>
      {normalizeRoleLabel(role)}
    </Badge>
  );
}

export { normalizeRoleLabel };
