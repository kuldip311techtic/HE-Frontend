import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    to: '/super-admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/super-admin/manage-users',
    label: 'Manage Users',
    icon: Users,
  },
] as const

interface SuperAdminShellProps {
  children: React.ReactNode
}

export function SuperAdminShell({ children }: SuperAdminShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="flex min-h-screen">
      <aside
        className="hidden w-56 shrink-0 border-r border-border bg-card/50 md:flex md:flex-col"
        aria-label="Super Admin navigation"
      >
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <span className="text-xs font-bold text-primary" aria-hidden="true">
                HE
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Hoops Engine</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex border-b border-border bg-card/30 px-4 py-3 md:hidden">
          <nav
            className="flex w-full gap-1 overflow-x-auto"
            aria-label="Super Admin mobile navigation"
          >
            {navItems.map(({ to, label }) => {
              const isActive = pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    'flex min-h-[44px] shrink-0 items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </header>

        <main className="flex-1 px-4 py-4 md:px-6">{children}</main>
      </div>
    </div>
  )
}
