import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { isAuthenticated } from '@/lib/auth'

const navLinks = [
  { to: '/super-admin/dashboard', label: 'Dashboard' },
  { to: '/super-admin/manage-users', label: 'Manage Users' },
]

export function RootLayout() {
  const location = useLocation()
  const authenticated = isAuthenticated()
  const isLoginRoute = location.pathname === '/super-admin/login'

  if (!authenticated && !isLoginRoute) {
    return <Navigate to="/super-admin/login" replace />
  }

  if (authenticated && isLoginRoute) {
    return <Navigate to="/super-admin/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      {!isLoginRoute && (
        <header className="border-b bg-card">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Hoops Engine Admin
            </span>
            <nav aria-label="Main navigation">
              <ul className="flex items-center gap-1 sm:gap-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          'inline-flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/super-admin/login" replace />,
      },
      {
        path: 'super-admin/login',
        lazy: async () => {
          const { default: Login } = await import('@/routes/super-admin/Login')
          return { Component: Login }
        },
      },
      {
        path: 'super-admin/dashboard',
        lazy: async () => {
          const { default: Dashboard } = await import('@/routes/super-admin/Dashboard')
          return { Component: Dashboard }
        },
      },
      {
        path: 'super-admin/manage-users',
        lazy: async () => {
          const { default: ManageUsers } = await import(
            '@/routes/super-admin/ManageUsers'
          )
          return { Component: ManageUsers }
        },
      },
    ],
  },
]
