import { createFileRoute } from '@tanstack/react-router'

import { SuperAdminLayout } from '@/components/SuperAdminLayout'

export const Route = createFileRoute('/super-admin/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <SuperAdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome to the Hoops Engine Super Admin portal.
        </p>
      </div>
    </SuperAdminLayout>
  )
}
