import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Users } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { clearAuthToken } from '@/lib/auth'
import { cn } from '@/lib/utils'

interface SuperAdminLayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
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

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const handleLogout = () => {
    clearAuthToken()
    window.location.href = '/super-admin/login'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <span className="text-sm font-semibold text-primary">
              Hoops Engine
            </span>
            <nav
              className="hidden items-center gap-1 sm:flex"
              aria-label="Super Admin navigation"
            >
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                const isActive = pathname.startsWith(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      'inline-flex min-h-[36px] items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="min-h-[36px] text-muted-foreground hover:text-foreground"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
        <nav
          className="flex border-t border-border sm:hidden"
          aria-label="Super Admin mobile navigation"
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const isActive = pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
