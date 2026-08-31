import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { apiRequest } from '@/services/api-client'
import type { SuperAdminDashboardResponse } from '@/types/api'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/ErrorMessage'

async function fetchDashboard(): Promise<SuperAdminDashboardResponse> {
  return apiRequest<SuperAdminDashboardResponse>('/api/v1/super-admin/dashboard', {
    method: 'GET',
    auth: true,
  })
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['super-admin-dashboard'],
    queryFn: fetchDashboard,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Overview of your Hoops Engine platform
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <span className="sr-only">Loading dashboard…</span>
        </div>
      )}

      {isError && (
        <div className="space-y-4">
          <ErrorMessage
            message={
              error instanceof Error
                ? error.message
                : 'Failed to load dashboard data.'
            }
          />
          <Button variant="outline" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      )}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Organizations" value={data.total_organizations} />
          <StatCard label="Coaches" value={data.total_coaches} />
          <StatCard label="Players" value={data.total_players} />
          <StatCard label="Sessions" value={data.total_sessions} />
          <StatCard label="Active Subscriptions" value={data.active_subscriptions} />
          <StatCard label="Revenue Overview" value={data.revenue_overview} />
        </div>
      )}
    </div>
  )
}
