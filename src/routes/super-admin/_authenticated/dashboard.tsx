import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { getDashboard } from '@/services/auth'

export const Route = createFileRoute('/super-admin/_authenticated/dashboard')({
  component: SuperAdminDashboardPage,
})

function SuperAdminDashboardPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['super-admin', 'dashboard'],
    queryFn: getDashboard,
  })

  return (
    <div>
      <header className="mb-6 border-b border-border pb-4">
        <h1 className="text-xl font-bold">Super Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hoops Engine administration overview
        </p>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <p className="font-medium">Failed to load dashboard data.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Organizations" value={data.total_organizations} />
          <StatCard label="Coaches" value={data.total_coaches} />
          <StatCard label="Players" value={data.total_players} />
          <StatCard label="Sessions" value={data.total_sessions} />
          <StatCard
            label="Active Subscriptions"
            value={data.active_subscriptions}
          />
          <StatCard
            label="Revenue Overview"
            value={data.revenue_overview}
            prefix="$"
          />
        </div>
      ) : null}
    </div>
  )
}

function StatCard({
  label,
  value,
  prefix = '',
}: {
  label: string
  value: number
  prefix?: string
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/80 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">
        {prefix}
        {value.toLocaleString()}
      </p>
    </div>
  )
}
