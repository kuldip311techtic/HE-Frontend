import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  role: string
}

function formatRoleLabel(role: string): string {
  const normalized = role.toLowerCase()
  if (normalized === 'coach') return 'Coach'
  if (normalized === 'player') return 'Player'
  if (normalized === 'super_admin' || normalized === 'super-admin') {
    return 'Super Admin'
  }
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function StatusBadge({ role }: StatusBadgeProps) {
  const normalized = role.toLowerCase()
  const variant =
    normalized === 'coach'
      ? 'success'
      : normalized === 'player'
        ? 'secondary'
        : 'outline'

  return (
    <Badge variant={variant} aria-label={`Role: ${formatRoleLabel(role)}`}>
      {formatRoleLabel(role)}
    </Badge>
  )
}
