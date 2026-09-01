import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { Toaster } from 'sonner'

import { isAuthenticated } from '@/lib/auth'

const PUBLIC_ROUTES = ['/super-admin/login']

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      location.pathname.startsWith(route),
    )

    if (!isPublicRoute && !isAuthenticated()) {
      throw redirect({ to: '/super-admin/login' })
    }

    if (
      isPublicRoute &&
      isAuthenticated() &&
      location.pathname === '/super-admin/login'
    ) {
      throw redirect({ to: '/super-admin/dashboard' })
    }
  },
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
    </>
  )
}
