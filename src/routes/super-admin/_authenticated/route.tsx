import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { SuperAdminShell } from '@/components/layout/SuperAdminShell'
import { isAuthenticated } from '@/lib/auth-storage'

export const Route = createFileRoute('/super-admin/_authenticated')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/super-admin/login' })
    }
  },
  component: AuthenticatedSuperAdminLayout,
})

function AuthenticatedSuperAdminLayout() {
  return (
    <SuperAdminShell>
      <Outlet />
    </SuperAdminShell>
  )
}
