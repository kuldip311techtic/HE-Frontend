import { NavLink } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ModuleNavItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const MODULE_ITEMS: ModuleNavItem[] = [
  {
    to: '/admin/organizations',
    label: 'Organizations',
    description: 'View and manage organizations.',
    icon: Building2,
  },
  {
    to: '/admin/users',
    label: 'Coaches',
    description: 'Open Users to review coach accounts.',
    icon: Users,
  },
  {
    to: '/admin/users',
    label: 'Players',
    description: 'Open Users to review player accounts.',
    icon: UserRound,
  },
  {
    to: '/admin/subscriptions',
    label: 'Subscriptions',
    description: 'Review subscription plans.',
    icon: CreditCard,
  },
];

interface DashboardModuleNavProps {
  loading?: boolean;
}

export function DashboardModuleNav({ loading = false }: DashboardModuleNavProps) {
  return (
    <nav aria-labelledby="core-modules-heading" className="space-y-4">
      <div>
        <h2 id="core-modules-heading" className="text-body-25 text-foreground">
          Core modules
        </h2>
        <p className="text-body-sm text-muted-foreground">
          Jump to Organizations, Coaches, Players, and Subscriptions. Coaches and Players open Users
          because those roles share that list.
        </p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MODULE_ITEMS.map((item) => (
            <div
              key={item.label}
              className="min-h-[132px] rounded-figma-10 border border-figma-border bg-card p-4"
            >
              <Skeleton className="mb-4 h-5 w-32" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MODULE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className="group rounded-figma-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
              >
                <Card className="flex min-h-[132px] flex-col justify-between p-4 transition-colors hover:bg-muted/40 group-active:bg-muted/60">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-h-11 items-center gap-2">
                      <Icon className="h-4 w-4 text-figma-brand" aria-hidden />
                      <span className="text-body-13 text-foreground">{item.label}</span>
                    </div>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <p className="text-body-sm text-muted-foreground">{item.description}</p>
                </Card>
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}
