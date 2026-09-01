import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  label: string
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'muted' | 'outline'
  className?: string
}

export function StatusBadge({
  label,
  variant = 'secondary',
  className,
}: StatusBadgeProps) {
  return (
    <Badge variant={variant} className={cn('capitalize', className)}>
      {label}
    </Badge>
  )
}

export function RoleBadge({ role }: { role: string }) {
  const normalized = role.toLowerCase()
  const label =
    normalized === 'coach'
      ? 'Coach'
      : normalized === 'player'
        ? 'Player'
        : role

  const variant =
    normalized === 'coach'
      ? 'default'
      : normalized === 'player'
        ? 'success'
        : 'secondary'

  return <StatusBadge label={label} variant={variant} />
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <StatusBadge
      label={active ? 'Active' : 'Inactive'}
      variant={active ? 'success' : 'muted'}
    />
  )
}
