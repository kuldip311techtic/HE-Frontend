import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const ROLE_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  coach: 'default',
  player: 'secondary',
}

interface StatusBadgeProps {
  role: string
  className?: string
}

export function StatusBadge({ role, className }: StatusBadgeProps) {
  const normalizedRole = role.toLowerCase()
  const variant = ROLE_VARIANTS[normalizedRole] ?? 'outline'
  const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

  return (
    <Badge variant={variant} className={cn(className)}>
      {label}
    </Badge>
  )
}
