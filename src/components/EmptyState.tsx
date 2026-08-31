import type { ReactNode } from 'react'
import { Users } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Users className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
