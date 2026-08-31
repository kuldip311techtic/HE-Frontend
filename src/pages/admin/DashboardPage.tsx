import { useOutletContext } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  Dumbbell,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardData } from '@/types/dashboard';

interface AdminOutletContext {
  dashboard: DashboardData | undefined;
}

export function DashboardPage() {
  const { dashboard } = useOutletContext<AdminOutletContext>();

  if (!dashboard) {
    return null;
  }

  const metrics = [
    {
      label: 'Organizations',
      value: formatNumber(dashboard.total_organizations),
      icon: Building2,
      description: 'Total registered organizations',
    },
    {
      label: 'Coaches',
      value: formatNumber(dashboard.total_coaches),
      icon: UserCheck,
      description: 'Active coaching staff',
    },
    {
      label: 'Players',
      value: formatNumber(dashboard.total_players),
      icon: Users,
      description: 'Registered players',
    },
    {
      label: 'Sessions',
      value: formatNumber(dashboard.total_sessions),
      icon: Dumbbell,
      description: 'Completed training sessions',
    },
    {
      label: 'Subscriptions',
      value: formatNumber(dashboard.active_subscriptions),
      icon: CreditCard,
      description: 'Active paid subscriptions',
    },
    {
      label: 'Revenue',
      value: formatCurrency(dashboard.revenue_overview),
      icon: TrendingUp,
      description: 'Total revenue overview',
    },
  ] as const;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={
          dashboard.description ??
          'Platform-wide analytics for Super Admin oversight.'
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.label}
                </CardTitle>
                <Icon
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <CardDescription>{metric.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview summary</CardTitle>
          <CardDescription>
            Key platform metrics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric) => (
                <TableRow key={metric.label}>
                  <TableCell className="font-medium">{metric.label}</TableCell>
                  <TableCell className="text-right">{metric.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
