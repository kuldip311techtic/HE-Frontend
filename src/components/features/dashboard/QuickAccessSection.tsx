import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  CreditCard,
  LifeBuoy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface QuickAccessItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    to: '/admin/organizations',
    label: 'Organizations',
    description: 'Create and update organizations.',
    icon: Building2,
  },
  {
    to: '/admin/users',
    label: 'Users',
    description: 'Manage coaches, players, and admins.',
    icon: Users,
  },
  {
    to: '/admin/subscriptions',
    label: 'Subscriptions',
    description: 'Review subscription plans.',
    icon: CreditCard,
  },
  {
    to: '/admin/analytics',
    label: 'Analytics',
    description: 'View the same platform KPI totals.',
    icon: BarChart3,
  },
  {
    to: '/admin/support',
    label: 'Support',
    description: 'Read inbound support inquiries.',
    icon: LifeBuoy,
  },
];

interface QuickAccessSectionProps {
  loading?: boolean;
}

export function QuickAccessSection({ loading = false }: QuickAccessSectionProps) {
  return (
    <section aria-labelledby="quick-access-heading" className="space-y-4">
      <div>
        <h2 id="quick-access-heading" className="text-body-25 text-foreground">
          Quick Access
        </h2>
        <p className="text-body-sm text-muted-foreground">
          Shortcut row for common modules. Use the sidebar for primary navigation.
        </p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <div
              key={item.to}
              className="rounded-figma-10 border border-figma-border bg-card p-4"
            >
              <Skeleton className="mb-4 h-5 w-32" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {QUICK_ACCESS_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="group rounded-figma-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
              >
                <Card className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-muted/40 group-active:bg-muted/60">
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
    </section>
  );
}
