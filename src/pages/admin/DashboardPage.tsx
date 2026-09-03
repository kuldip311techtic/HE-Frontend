import {
  Building2,
  CalendarDays,
  CreditCard,
  DollarSign,
  Users,
  UserSquare2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

const PLACEHOLDER_METRICS = [
  {
    key: 'total_organizations',
    label: 'Total Organizations',
    icon: Building2,
  },
  {
    key: 'total_coaches',
    label: 'Total Coaches',
    icon: UserSquare2,
  },
  {
    key: 'total_players',
    label: 'Total Players',
    icon: Users,
  },
  {
    key: 'total_sessions',
    label: 'Total Sessions',
    icon: CalendarDays,
  },
  {
    key: 'active_subscriptions',
    label: 'Active Subscriptions',
    icon: CreditCard,
  },
  {
    key: 'revenue_overview',
    label: 'Revenue Overview',
    icon: DollarSign,
  },
] as const;

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit text-body-25">Dashboard</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Admin panel ready. Analytics will load here once connected to the Super Admin dashboard
          API.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PLACEHOLDER_METRICS.map((metric) => (
          <Card key={metric.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-body-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <p className="font-outfit text-body-33 tabular-nums">—</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <EmptyState
        title="Analytics not connected yet"
        description="This setup ticket ships the admin shell. Live KPI data from GET /api/v1/super-admin/dashboard will be wired in a follow-up ticket."
      />
    </div>
  );
}
